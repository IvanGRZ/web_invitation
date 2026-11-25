-- La service key salta RLS, pero también necesita privilegios sobre las tablas: en los proyectos nuevos de
-- Supabase las tablas creadas por SQL ya no se conceden solas a los roles de la API. Sólo service_role
-- (el servidor); anon y authenticated siguen sin acceso.
grant select, insert, update, delete on public.guests, public.rsvps, public.code_attempts to service_role;
