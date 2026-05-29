create table public.court_schedules (
  id uuid primary key default gen_random_uuid(),
  court_id uuid not null references public.courts (id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time_minutes int not null check (start_time_minutes >= 0 and start_time_minutes < 24*60),
  end_time_minutes int not null check (end_time_minutes > 0 and end_time_minutes <= 24*60 and end_time_minutes > start_time_minutes),
  slot_duration_minutes int not null check (slot_duration_minutes > 0 and slot_duration_minutes <= 8*60),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.court_schedules enable row level security;

create policy "Authenticated users can read court schedules"
  on public.court_schedules for select
  using (auth.role() = 'authenticated');

create policy "Service role full access on court schedules"
  on public.court_schedules for all
  using (auth.jwt() ->> 'role' = 'service_role');

create index court_schedules_court_day_idx
  on public.court_schedules (court_id, day_of_week);

comment on table public.court_schedules is 'Per-court weekly schedule configuration (slots by day and time).';


create type public.court_booking_status as enum ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED');

create table public.court_bookings (
  id uuid primary key default gen_random_uuid(),
  court_id uuid not null references public.courts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  start timestamptz not null,
  "end" timestamptz not null check ("end" > start),
  status public.court_booking_status not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.court_bookings enable row level security;

create policy "Users can read own and public court bookings"
  on public.court_bookings for select
  using (auth.role() = 'authenticated');

create policy "Service role full access on court bookings"
  on public.court_bookings for all
  using (auth.jwt() ->> 'role' = 'service_role');

create index court_bookings_court_start_idx
  on public.court_bookings (court_id, start);

comment on table public.court_bookings is 'Reservations for court time slots.';

