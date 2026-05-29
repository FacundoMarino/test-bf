create table public.court_booking_participants (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.court_bookings (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.court_booking_participants enable row level security;

create policy "Authenticated users can read court booking participants"
  on public.court_booking_participants for select
  using (auth.role() = 'authenticated');

create policy "Service role full access on court booking participants"
  on public.court_booking_participants for all
  using (auth.jwt() ->> 'role' = 'service_role');

create unique index court_booking_participants_booking_profile_uniq
  on public.court_booking_participants (booking_id, profile_id);

comment on table public.court_booking_participants is 'Participants (players) for a given court booking.';

