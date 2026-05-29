create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  court_count smallint not null default 1 check (court_count >= 1),
  court_type text not null check (court_type in ('indoor', 'outdoor', 'both')),
  address text not null,
  pricing jsonb not null default '[]'::jsonb,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clubs enable row level security;

create policy "Authenticated users can read clubs"
  on public.clubs for select
  using (auth.role() = 'authenticated');

create policy "Service role full access on clubs"
  on public.clubs for all
  using (auth.jwt() ->> 'role' = 'service_role');

create extension if not exists pg_trgm;

create index clubs_name_idx on public.clubs using gin (name gin_trgm_ops);
create index clubs_court_type_idx on public.clubs (court_type);
create index clubs_address_idx on public.clubs using gin (address gin_trgm_ops);

comment on table public.clubs is 'Padel clubs with court info and pricing';
comment on column public.clubs.court_type is 'indoor, outdoor or both';
comment on column public.clubs.pricing is 'Price per hour by day, e.g. [{"day":"lunes","pricePerHour":5000},{"day":"sábado","pricePerHour":8000}]';
