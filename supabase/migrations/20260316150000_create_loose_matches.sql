create table if not exists public.loose_matches (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  start_label text not null,
  level smallint not null,
  court_type text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists loose_matches_profile_id_idx
  on public.loose_matches (profile_id);

