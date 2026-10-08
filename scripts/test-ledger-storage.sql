-- Run only against an isolated test database after ledger-storage.sql.
begin;
do $$
declare fixture jsonb; result jsonb;
begin
  fixture := '{"count":2,"coverage":{"complete":true},"startedAt":"2026-09-24T00:00:00Z","fetchedAt":"2026-09-24T00:01:00Z","data":[{"id":"a"},{"id":"a"}]}'::jsonb;
  perform public.publish_estate_ledger('transactions', fixture);
  result := public.read_estate_ledger('transactions');
  if jsonb_array_length(result->'data') <> 2 then raise exception 'Duplicate rows lost'; end if;
  begin
    perform public.publish_estate_ledger('transactions', jsonb_set(fixture, '{coverage,complete}', 'false'));
    raise exception 'Incomplete snapshot accepted';
  exception when others then
    if sqlerrm <> 'Incomplete ledger' then raise; end if;
  end;
  if jsonb_array_length(public.read_estate_ledger('transactions')->'data') <> 2 then
    raise exception 'Failed publish changed ledger';
  end if;
  fixture := fixture || '{"count":1,"startedAt":"2026-09-24T01:00:00Z","fetchedAt":"2026-09-24T01:01:00Z","data":[{"id":"b"}]}'::jsonb;
  perform public.publish_estate_ledger('transactions', fixture);
  result := public.read_estate_ledger('transactions');
  if result#>>'{data,0,id}' <> 'b' or jsonb_array_length(result->'data') <> 1 then
    raise exception 'Removed rows survived replacement';
  end if;
  begin
    perform public.publish_estate_ledger('transactions', fixture || '{"startedAt":"2026-09-23T00:00:00Z"}'::jsonb);
    raise exception 'Older snapshot accepted';
  exception when others then
    if sqlerrm <> 'A newer collection has already been published' then raise; end if;
  end;
  if has_function_privilege('anon', 'public.publish_estate_ledger(text,jsonb)', 'execute') then
    raise exception 'Anonymous writes permitted';
  end if;
end;
$$;
rollback;
