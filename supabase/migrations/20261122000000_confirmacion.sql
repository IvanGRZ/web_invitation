-- Confirmación de asistencia (CLAUDE.md § 7 › Datos; esquema aprobado por Ivan el 22 nov 2026).
-- Sólo el esquema: los datos de invitados nunca entran al repo.
-- Lectura y escritura sólo desde el servidor con la service key: RLS activado y sin políticas públicas.

-- Invitados: una fila por familia/invitación.
create table public.guests (
  id uuid primary key default gen_random_uuid(),
  -- 8 caracteres de un alfabeto de 31 sin ambiguos (sin 0/O, 1/I/L), sin guion; se muestra como K7M2-PQ9X
  code text unique not null check (code ~ '^[2-9A-HJKMNP-Z]{8}$'),
  family_name text not null check (char_length(family_name) between 1 and 120),
  seats int not null check (seats between 1 and 6),
  channel text not null check (channel in ('impresa', 'digital')),
  -- WhatsApp en formato internacional sin "+" (52…), sólo para 'digital'; dato privado
  phone text check (phone ~ '^[1-9][0-9]{9,14}$'),
  -- primera y última vez que se abrió su enlace (sin contar las vistas previas de WhatsApp)
  first_opened_at timestamptz,
  last_opened_at timestamptz,
  created_at timestamptz not null default now(),
  check (channel = 'digital' or phone is null)
);

-- Confirmaciones: la última respuesta de cada familia (upsert por guest_id).
-- guests_count <= seats cruza dos tablas: lo valida el dominio (src/server/domain/confirmacion.js).
create table public.rsvps (
  guest_id uuid primary key references public.guests(id) on delete cascade,
  attending boolean not null,
  guests_count int not null default 0 check (guests_count between 0 and 6),
  message text check (char_length(message) <= 500),
  responded_at timestamptz not null default now(),
  check ((attending and guests_count >= 1) or (not attending and guests_count = 0))
);

-- Intentos fallidos del candado, para limitarlos por IP (docs/invitaciones.md). Nunca la IP: su sha-256.
create table public.code_attempts (
  ip_hash text not null,
  attempted_at timestamptz not null default now()
);
create index code_attempts_ip_hash_attempted_at_idx on public.code_attempts (ip_hash, attempted_at);

-- Apertura de un enlace personal en una sola llamada: first_opened_at sólo la primera vez.
create function public.register_open(p_guest_id uuid) returns void
language sql
set search_path = ''
as $$
  update public.guests
     set first_opened_at = coalesce(first_opened_at, now()),
         last_opened_at = now()
   where id = p_guest_id;
$$;

-- Intento fallido del candado: lo guarda y borra los de más de un día de esa IP.
create function public.register_code_attempt(p_ip_hash text) returns void
language sql
set search_path = ''
as $$
  delete from public.code_attempts where ip_hash = p_ip_hash and attempted_at < now() - interval '1 day';
  insert into public.code_attempts (ip_hash) values (p_ip_hash);
$$;

alter table public.guests enable row level security;
alter table public.rsvps enable row level security;
alter table public.code_attempts enable row level security;

-- Sin acceso para las llaves públicas (anon / authenticated): sólo la service key, desde el servidor.
revoke all on public.guests, public.rsvps, public.code_attempts from anon, authenticated;
revoke execute on function public.register_open(uuid) from public, anon, authenticated;
revoke execute on function public.register_code_attempt(text) from public, anon, authenticated;
grant execute on function public.register_open(uuid) to service_role;
grant execute on function public.register_code_attempt(text) to service_role;
