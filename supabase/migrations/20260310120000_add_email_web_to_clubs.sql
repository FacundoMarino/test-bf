alter table public.clubs
  add column if not exists email text,
  add column if not exists web text;

comment on column public.clubs.email is 'Contact email for the club';
comment on column public.clubs.web is 'Website URL for the club';
