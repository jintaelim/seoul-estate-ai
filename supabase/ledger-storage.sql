-- Execute once in the existing project's SQL Editor. Existing tables remain intact.
begin;
create table if not exists public.estate_ledgers (
  dataset text primary key check (dataset in ('transactions', 'rent-transactions', 'land-permits')),
  metadata jsonb not null,
  started_at timestamptz not null,
  fetched_at timestamptz not null
);
create table if not exists public.estate_ledger_rows (
  dataset text not null references public.estate_ledgers(dataset),
  ordinal integer not null,
  payload jsonb not null,
  district text generated always as (payload->>'district') stored,
  contract_date text generated always as (coalesce(payload->>'dealDate', payload->>'permitDate')) stored,
  complex text generated always as (payload->>'complex') stored,
  primary key (dataset, ordinal)
);
create index if not exists estate_rows_date_district_idx on public.estate_ledger_rows(dataset, contract_date, district);
create index if not exists estate_rows_complex_idx on public.estate_ledger_rows(dataset, district, complex);
create table if not exists public.estate_sync_runs (
  id uuid primary key,
  dataset text not null,
  status text not null,
  started_at timestamptz not null,
  finished_at timestamptz,
  row_count integer,
  error text
);
create table if not exists public.estate_ledger_staging (
  run_id uuid not null,
  dataset text not null,
  ordinal integer not null,
  payload jsonb not null,
  primary key (run_id, ordinal)
);
alter table public.estate_ledger_rows add column if not exists dong text generated always as (payload->>'dong') stored;
alter table public.estate_ledger_rows add column if not exists status text generated always as (coalesce(payload->>'status', '거래')) stored;
alter table public.estate_ledger_rows add column if not exists rent_type text generated always as (payload->>'rentType') stored;
alter table public.estate_ledger_rows add column if not exists area numeric generated always as (nullif(payload->>'area', '')::numeric) stored;
alter table public.estate_ledger_rows add column if not exists price integer generated always as (nullif(payload->>'price', '')::integer) stored;
alter table public.estate_ledger_rows add column if not exists built_year integer generated always as (nullif(payload->>'builtYear', '')::integer) stored;
create index if not exists estate_rows_filter_idx on public.estate_ledger_rows(dataset, district, dong, complex, contract_date);
create index if not exists estate_rows_rent_type_idx on public.estate_ledger_rows(dataset, rent_type, contract_date);
create index if not exists estate_rows_catalog_idx on public.estate_ledger_rows(dataset, district, area, contract_date desc);
create index if not exists estate_rows_price_idx on public.estate_ledger_rows(dataset, price, built_year);
alter table public.estate_ledgers enable row level security;
alter table public.estate_ledger_rows enable row level security;
alter table public.estate_sync_runs enable row level security;
alter table public.estate_ledger_staging enable row level security;
revoke all on public.estate_ledgers, public.estate_ledger_rows, public.estate_sync_runs, public.estate_ledger_staging from anon, authenticated;
grant all on public.estate_ledgers, public.estate_ledger_rows, public.estate_sync_runs, public.estate_ledger_staging to service_role;

alter table public.estate_ledgers drop constraint if exists estate_ledgers_dataset_check;
alter table public.estate_ledgers add constraint estate_ledgers_dataset_check
  check (dataset in ('transactions', 'rent-transactions', 'land-permits'));

create or replace function public.publish_estate_ledger(p_dataset text, p_payload jsonb)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare started timestamptz; fetched timestamptz;
begin
  if p_dataset not in ('transactions', 'rent-transactions', 'land-permits') then raise exception 'Invalid dataset'; end if;
  if jsonb_typeof(p_payload->'data') is distinct from 'array'
    or (p_payload#>>'{coverage,complete}') is distinct from 'true' then
    raise exception 'Incomplete ledger';
  end if;
  if (p_payload->>'count')::integer is distinct from jsonb_array_length(p_payload->'data') then
    raise exception 'Count mismatch';
  end if;
  started := coalesce(p_payload->>'startedAt', p_payload->>'fetchedAt')::timestamptz;
  fetched := (p_payload->>'fetchedAt')::timestamptz;
  perform pg_advisory_xact_lock(hashtext('estate-ledger-' || p_dataset));
  if exists(select 1 from estate_ledgers where dataset = p_dataset and started_at > started) then
    raise exception 'A newer collection has already been published';
  end if;
  insert into estate_ledgers(dataset, metadata, started_at, fetched_at)
    values(p_dataset, p_payload - 'data' - 'warning' - 'persistence', started, fetched)
    on conflict(dataset) do update set metadata = excluded.metadata, started_at = excluded.started_at, fetched_at = excluded.fetched_at;
  -- The validated collection replaces its entire scope in one transaction.
  -- Removed/cancelled contracts cannot survive as stale upsert rows.
  delete from estate_ledger_rows where dataset = p_dataset;
  insert into estate_ledger_rows(dataset, ordinal, payload)
    select p_dataset, ordinality::integer, value from jsonb_array_elements(p_payload->'data') with ordinality;
  return jsonb_build_object('published', true, 'count', jsonb_array_length(p_payload->'data'));
end;
$$;

create or replace function public.publish_estate_ledger_staged(
  p_dataset text, p_metadata jsonb, p_run_id uuid, p_expected_count integer
) returns jsonb language plpgsql security invoker set search_path = public set statement_timeout = '120s' as $$
declare started timestamptz; fetched timestamptz; staged_count integer;
begin
  if p_dataset not in ('transactions', 'rent-transactions', 'land-permits') then raise exception 'Invalid dataset'; end if;
  if (p_metadata#>>'{coverage,complete}') is distinct from 'true' then raise exception 'Incomplete ledger'; end if;
  select count(*) into staged_count from estate_ledger_staging where run_id = p_run_id and dataset = p_dataset;
  if staged_count is distinct from p_expected_count then raise exception 'Staged count mismatch'; end if;
  started := coalesce(p_metadata->>'startedAt', p_metadata->>'fetchedAt')::timestamptz;
  fetched := (p_metadata->>'fetchedAt')::timestamptz;
  perform pg_advisory_xact_lock(hashtext('estate-ledger-' || p_dataset));
  if exists(select 1 from estate_ledgers where dataset = p_dataset and started_at > started) then raise exception 'A newer collection has already been published'; end if;
  insert into estate_ledgers(dataset, metadata, started_at, fetched_at)
    values(p_dataset, p_metadata, started, fetched)
    on conflict(dataset) do update set metadata = excluded.metadata, started_at = excluded.started_at, fetched_at = excluded.fetched_at;
  delete from estate_ledger_rows where dataset = p_dataset;
  insert into estate_ledger_rows(dataset, ordinal, payload)
    select dataset, ordinal, payload from estate_ledger_staging where run_id = p_run_id and dataset = p_dataset order by ordinal;
  delete from estate_ledger_staging where run_id = p_run_id;
  return jsonb_build_object('published', true, 'count', staged_count);
end;
$$;

create or replace function public.read_estate_ledger_filtered(
  p_dataset text, p_date text default null, p_from text default null, p_district text default null,
  p_dong text default null, p_complex text default null, p_status text default null,
  p_rent_type text default null, p_offset integer default 0, p_limit integer default 50
) returns jsonb language plpgsql stable security invoker set search_path = public as $$
declare meta jsonb; rows jsonb; total integer;
begin
  select metadata into meta from estate_ledgers where dataset = p_dataset;
  if meta is null then return null; end if;
  select count(*) into total from estate_ledger_rows r where r.dataset = p_dataset
    and (p_date is null or r.contract_date = p_date) and (p_from is null or r.contract_date >= p_from)
    and (p_district is null or r.district = p_district) and (p_dong is null or r.dong = p_dong)
    and (p_complex is null or r.complex = p_complex) and (p_status is null or r.status = p_status)
    and (p_rent_type is null or r.rent_type = p_rent_type);
  select coalesce(jsonb_agg(s.payload order by s.contract_date desc, s.ordinal), '[]'::jsonb) into rows from (
    select r.payload, r.contract_date, r.ordinal from estate_ledger_rows r where r.dataset = p_dataset
      and (p_date is null or r.contract_date = p_date) and (p_from is null or r.contract_date >= p_from)
      and (p_district is null or r.district = p_district) and (p_dong is null or r.dong = p_dong)
      and (p_complex is null or r.complex = p_complex) and (p_status is null or r.status = p_status)
      and (p_rent_type is null or r.rent_type = p_rent_type)
    order by r.contract_date desc, r.ordinal offset p_offset limit p_limit
  ) s;
  return meta || jsonb_build_object('data', rows, 'count', jsonb_array_length(rows), 'totalCount', total,
    'hasMore', p_offset + jsonb_array_length(rows) < total);
end;
$$;

create or replace function public.summarize_estate_ledger(p_dataset text)
returns jsonb language sql stable security invoker set search_path = public as $$
  select l.metadata || jsonb_build_object('groups', coalesce((select jsonb_agg(x order by x->>'date' desc) from (
    select jsonb_build_object('date', r.contract_date, 'district', r.district, 'status', r.status, 'count', count(*)) x
    from estate_ledger_rows r where r.dataset = l.dataset group by r.contract_date, r.district, r.status
  ) grouped), '[]'::jsonb)) from estate_ledgers l where l.dataset = p_dataset;
$$;

create or replace function public.read_estate_ledger(p_dataset text)
returns jsonb language sql stable security invoker set search_path = public as $$
  select l.metadata || jsonb_build_object('data', coalesce(
    (select jsonb_agg(r.payload order by r.ordinal) from estate_ledger_rows r where r.dataset = l.dataset), '[]'::jsonb))
  from estate_ledgers l where l.dataset = p_dataset;
$$;

create or replace function public.search_estate_apartments(
  p_keyword text default '', p_district text default null, p_min_price integer default null,
  p_max_price integer default null, p_min_area numeric default null, p_min_built integer default null,
  p_theme text default 'all', p_sort text default 'latest', p_offset integer default 0, p_limit integer default 20
) returns jsonb language plpgsql stable security invoker set search_path = public as $$
declare result_rows jsonb; result_total integer; sale_meta jsonb;
begin
  if p_offset < 0 or p_limit < 1 or p_limit > 50 then raise exception 'Invalid pagination'; end if;
  select metadata into sale_meta from estate_ledgers where dataset = 'transactions';
  if sale_meta is null then return null; end if;
  with sale_units as materialized (
    select distinct on (district, dong, complex, round(area, 1))
      district, dong, complex, round(area, 1) area_key, area, price, built_year, contract_date, ordinal, payload
    from estate_ledger_rows where dataset = 'transactions'
    order by district, dong, complex, round(area, 1), contract_date desc, price desc, ordinal desc
  ), rent_units as materialized (
    select distinct on (district, dong, complex, round(area, 1))
      district, dong, complex, round(area, 1) area_key, contract_date,
      nullif(payload->>'deposit', '')::integer deposit
    from estate_ledger_rows
    where dataset = 'rent-transactions' and coalesce(nullif(payload->>'monthlyRent', '')::integer, 0) = 0
    order by district, dong, complex, round(area, 1), contract_date desc, ordinal desc
  ), catalog as (
    select s.*, s.payload || jsonb_build_object(
      'latestJeonse', coalesce(r.deposit, 0), 'latestJeonseDate', coalesce(r.contract_date, ''),
      'rentCount', case when r.deposit is null then 0 else 1 end
    ) item,
    lower(regexp_replace(replace(replace(s.district || s.dong || s.complex, '아파트', ''), '단지', ''), '[^0-9a-z가-힣]', '', 'g')) search_text,
    max(s.contract_date) over () latest_date
    from sale_units s left join rent_units r using (district, dong, complex, area_key)
  ), filtered as (
    select *, count(*) over () total_count from catalog
    where (coalesce(p_keyword, '') = '' or search_text like '%' || lower(p_keyword) || '%')
      and (p_district is null or district = p_district)
      and (p_min_price is null or price >= p_min_price) and (p_max_price is null or price <= p_max_price)
      and (p_min_area is null or area >= p_min_area) and (p_min_built is null or built_year >= p_min_built)
      and (p_theme <> 'latest' or contract_date = latest_date)
      and (p_theme <> 'rent' or coalesce((item->>'latestJeonse')::integer, 0) > 0)
      and (p_theme <> 'record' or coalesce((item->>'previousHigh')::integer, 0) > 0 and price > (item->>'previousHigh')::integer)
      and (p_theme <> 'active' or coalesce((item->>'recentCount')::integer, 0) >= 7)
      and (p_theme <> 'value' or coalesce((item->>'previousHigh')::integer, 0) > price)
  ), page as (
    select * from filtered order by
      case when p_sort = 'priceAsc' then price end asc nulls last,
      case when p_sort = 'priceDesc' then price end desc nulls last,
      case when p_sort = 'activity' then coalesce((item->>'recentCount')::integer, 0) end desc nulls last,
      contract_date desc, price desc, ordinal
    offset p_offset limit p_limit
  )
  select coalesce(jsonb_agg(item), '[]'::jsonb), coalesce(max(total_count), 0)
    into result_rows, result_total from page;
  return sale_meta || jsonb_build_object(
    'data', result_rows, 'count', jsonb_array_length(result_rows), 'totalCount', result_total,
    'page', floor(p_offset::numeric / p_limit)::integer + 1, 'limit', p_limit,
    'hasMore', p_offset + jsonb_array_length(result_rows) < result_total, 'source', 'stored-ledgers'
  );
end;
$$;
revoke all on function public.publish_estate_ledger(text,jsonb), public.publish_estate_ledger_staged(text,jsonb,uuid,integer),
  public.read_estate_ledger(text), public.read_estate_ledger_filtered(text,text,text,text,text,text,text,text,integer,integer),
  public.summarize_estate_ledger(text), public.search_estate_apartments(text,text,integer,integer,numeric,integer,text,text,integer,integer) from public, anon, authenticated;
grant execute on function public.publish_estate_ledger(text,jsonb), public.publish_estate_ledger_staged(text,jsonb,uuid,integer),
  public.read_estate_ledger(text), public.read_estate_ledger_filtered(text,text,text,text,text,text,text,text,integer,integer),
  public.summarize_estate_ledger(text), public.search_estate_apartments(text,text,integer,integer,numeric,integer,text,text,integer,integer) to service_role;
notify pgrst, 'reload schema';
commit;
