alter table public.profiles
  add column if not exists is_club boolean not null default false;

comment on column public.profiles.is_club is 'Cuenta de usuario asociada a un club (gestor/propietario).';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, updated_at, is_club)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    now(),
    coalesce((new.raw_user_meta_data->>'is_club')::boolean, false)
  );
  return new;
end;
$$;
