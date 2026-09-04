-- Production data model for Seoul Estate AI.
-- Run this in Supabase SQL Editor or a PostgreSQL migration tool.

create table if not exists public.apartments (
  id text primary key,
  name text not null,
  district text not null,
  dong text,
  address text,
  households integer,
  building_count integer,
  approval_date date,
  heating_type text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  nearest_station text,
  station_walk_minutes integer,
  source text,
  updated_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id text primary key,
  apartment_id text references public.apartments(id) on delete set null,
  district text not null,
  dong text,
  complex text not null,
  area numeric(8,2) not null,
  floor integer,
  price integer not null,
  deal_date date not null,
  dealing_type text,
  permit_zone text,
  source text not null default 'molit',
  fetched_at timestamptz not null default now()
);

create index if not exists transactions_complex_area_date_idx on public.transactions (complex, area, deal_date desc);
create index if not exists transactions_district_date_idx on public.transactions (district, deal_date desc);

create table if not exists public.rent_transactions (
  id text primary key,
  apartment_id text references public.apartments(id) on delete set null,
  district text not null,
  dong text,
  complex text not null,
  area numeric(8,2) not null,
  floor integer,
  deposit integer not null,
  monthly_rent integer not null default 0,
  deal_date date not null,
  source text not null default 'molit-rent',
  fetched_at timestamptz not null default now()
);

create table if not exists public.saved_apartments (
  user_id uuid not null references auth.users(id) on delete cascade,
  apartment_id text not null references public.apartments(id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  primary key (user_id, apartment_id)
);

alter table public.saved_apartments enable row level security;
create policy "users manage own saved apartments" on public.saved_apartments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
