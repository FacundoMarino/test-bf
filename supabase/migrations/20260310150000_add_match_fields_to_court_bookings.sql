alter table public.court_bookings
  add column if not exists is_match boolean not null default false,
  add column if not exists title text,
  add column if not exists max_players smallint check (max_players is null or (max_players >= 2 and max_players <= 4)),
  add column if not exists level smallint check (level is null or (level >= 1 and level <= 7));

comment on column public.court_bookings.is_match is 'True when this booking represents a match/game.';
comment on column public.court_bookings.title is 'User-visible match title.';
comment on column public.court_bookings.max_players is 'Maximum number of players for the match (2-4).';
comment on column public.court_bookings.level is 'Match level/category from 1 (highest) to 7 (lowest).';

