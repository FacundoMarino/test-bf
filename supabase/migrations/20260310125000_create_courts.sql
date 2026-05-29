create table public.courts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  surface text not null,
  lighting boolean not null default false,
  club_id uuid not null references public.clubs (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.courts enable row level security;

create policy "Authenticated users can read courts"
  on public.courts for select
  using (auth.role() = 'authenticated');

create policy "Service role full access on courts"
  on public.courts for all
  using (auth.jwt() ->> 'role' = 'service_role');

create index courts_club_id_idx on public.courts (club_id);

comment on table public.courts is 'Individual padel courts belonging to a club';
