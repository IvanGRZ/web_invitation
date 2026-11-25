-- Celular por persona y primer apellido opcional (Ivan, 24 nov 2026).
-- - Cada persona puede tener su celular: aunque sean familia, a veces la invitación se manda a cada quien.
--   invitations.phone se queda como el número al que se manda la invitación (el del titular al importar).
-- - Hay invitados que sólo se conocen por su nombre (p. ej. una acompañante): el primer apellido deja de ser obligatorio.

alter table public.person add column phone text check (phone ~ '^[1-9][0-9]{9,14}$');  -- internacional sin "+": 52… o 1…
alter table public.person alter column first_last_name drop not null;

-- La vista suma el celular de cada persona (las columnas nuevas van al final).
create or replace view public.guest_list with (security_invoker = true) as
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
       i.first_opened_at,
       p.phone
  from public.person p
  left join public.invitation_members m on m.person_id = p.id
  left join public.invitations i on i.id = m.invitation_id
  left join public.rsvps r on r.person_id = p.id
 order by i.label nulls first, m.position;
