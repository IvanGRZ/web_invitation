-- Personas e invitaciones (aprobado por Ivan el 24 nov 2026). Reemplaza el modelo de una fila por familia:
--   person              cada invitado, exista o no en una invitación
--   invitations         lo que tiene código, enlace y QR (antes guests): familia, persona sola o pareja
--   invitation_members  quién va en qué invitación (a lo más una a la vez), con su rol y su orden
--   rsvps               la respuesta de cada persona (asiste o no)
--   invitation_responses el mensaje y la fecha de respuesta de toda la invitación
-- Sin agrupar = sin fila en invitation_members. Agrupar o mover = insertar o cambiar esa fila.
-- Las respuestas de prueba anteriores (rsvps por familia) se pierden; las invitaciones (PRUEBA22) se conservan.

-- ─── invitations (antes guests) ──────────────────────────────────────────
alter table public.guests rename to invitations;
alter table public.invitations rename column family_name to label;
alter table public.invitations drop column seats;  -- los lugares son las personas de la invitación

-- La función de aperturas apuntaba a guests: se vuelve a crear con el nombre nuevo.
create or replace function public.register_open(p_guest_id uuid) returns void
language sql
set search_path = ''
as $$
  update public.invitations
     set first_opened_at = coalesce(first_opened_at, now()),
         last_opened_at = now()
   where id = p_guest_id;
$$;

-- ─── person ──────────────────────────────────────────────────────────────
create table public.person (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  first_last_name text not null check (char_length(first_last_name) between 1 and 80),
  second_last_name text check (char_length(second_last_name) between 1 and 80),  -- hay quien tiene uno solo
  created_at timestamptz not null default now()
);

-- ─── invitation_members ──────────────────────────────────────────────────
create table public.invitation_members (
  person_id uuid primary key references public.person(id) on delete cascade,  -- una invitación a la vez
  invitation_id uuid not null references public.invitations(id) on delete cascade,  -- borrar la invitación no borra a nadie
  role text not null default 'titular' check (role in ('titular', 'acompañante')),
  position int not null check (position between 1 and 12),  -- orden de las sillas; vacío = al final
  unique (invitation_id, position) deferrable initially deferred
);
create index invitation_members_invitation_id_idx on public.invitation_members (invitation_id);

-- Máximo 12 personas por invitación y posición automática (la siguiente libre) si no se da.
create function public.invitation_members_check() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select count(*) from public.invitation_members
       where invitation_id = new.invitation_id and person_id <> new.person_id) >= 12 then
    raise exception 'Una invitación admite a lo más 12 personas';
  end if;
  -- Al moverla a otra invitación sin decir en qué lugar, va al final de la nueva.
  if tg_op = 'UPDATE' and new.invitation_id <> old.invitation_id and new.position = old.position then
    new.position := null;
  end if;
  if new.position is null then
    select coalesce(max(position), 0) + 1 into new.position
      from public.invitation_members
     where invitation_id = new.invitation_id and person_id <> new.person_id;
  end if;
  return new;
end;
$$;
create trigger invitation_members_check
  before insert or update of invitation_id, position on public.invitation_members
  for each row execute function public.invitation_members_check();

-- ─── rsvps (ahora por persona) ───────────────────────────────────────────
drop table public.rsvps;
create table public.rsvps (
  person_id uuid primary key references public.person(id) on delete cascade,
  attending boolean not null,
  responded_at timestamptz not null default now()
);

-- ─── invitation_responses ────────────────────────────────────────────────
create table public.invitation_responses (
  invitation_id uuid primary key references public.invitations(id) on delete cascade,
  message text check (char_length(message) <= 500),
  responded_at timestamptz not null default now()
);

-- Guarda la respuesta de una invitación en una sola transacción: asisten las personas de p_attending y
-- no asisten las demás de la invitación; el mensaje y la fecha van en invitation_responses.
create function public.save_rsvp(p_invitation_id uuid, p_attending uuid[], p_message text, p_at timestamptz)
returns void
language sql
set search_path = ''
as $$
  insert into public.rsvps (person_id, attending, responded_at)
  select m.person_id, m.person_id = any(p_attending), p_at
    from public.invitation_members m
   where m.invitation_id = p_invitation_id
  on conflict (person_id) do update set attending = excluded.attending, responded_at = excluded.responded_at;

  insert into public.invitation_responses (invitation_id, message, responded_at)
  values (p_invitation_id, p_message, p_at)
  on conflict (invitation_id) do update set message = excluded.message, responded_at = excluded.responded_at;
$$;

-- ─── Vista para el editor de tablas de Supabase ──────────────────────────
-- Una fila por persona: su invitación (vacía si no está agrupada), rol y respuesta.
create view public.guest_list with (security_invoker = true) as
select p.id as person_id,
       p.name,
       p.first_last_name,
       p.second_last_name,
       i.code,
       i.label as invitation,
       i.channel,
       m.role,
       m.position,
       r.attending,
       r.responded_at,
       i.first_opened_at
  from public.person p
  left join public.invitation_members m on m.person_id = p.id
  left join public.invitations i on i.id = m.invitation_id
  left join public.rsvps r on r.person_id = p.id
 order by i.label nulls first, m.position;

-- ─── Seguridad: sólo el servidor (service_role) ──────────────────────────
alter table public.person enable row level security;
alter table public.invitation_members enable row level security;
alter table public.rsvps enable row level security;
alter table public.invitation_responses enable row level security;

revoke all on public.person, public.invitation_members, public.rsvps, public.invitation_responses, public.guest_list
  from anon, authenticated;
grant select, insert, update, delete on public.person, public.invitation_members, public.rsvps, public.invitation_responses
  to service_role;
grant select on public.guest_list to service_role;

revoke execute on function public.save_rsvp(uuid, uuid[], text, timestamptz) from public, anon, authenticated;
revoke execute on function public.invitation_members_check() from public, anon, authenticated;
grant execute on function public.save_rsvp(uuid, uuid[], text, timestamptz) to service_role;
