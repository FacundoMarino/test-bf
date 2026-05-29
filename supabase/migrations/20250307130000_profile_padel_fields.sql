alter table public.profiles
  add column description text,
  add column location text,
  add column level smallint check (level between 1 and 7),
  add column preferred_position text check (preferred_position in ('derecha', 'izquierda', 'ambos')),
  add column court_type text check (court_type in ('indoor', 'outdoor', 'ambas')),
  add column availability jsonb default '[]'::jsonb;

comment on column public.profiles.level is 'Categoría del jugador: 1 (1ra) a 7 (7ma)';
comment on column public.profiles.preferred_position is 'Posición preferida: derecha, izquierda o ambos';
comment on column public.profiles.court_type is 'Tipo de cancha preferida: indoor, outdoor o ambas';
comment on column public.profiles.availability is 'Disponibilidad horaria en formato JSON, ej: [{"day":"lunes","timeSlots":["mañana","tarde"]}]';
