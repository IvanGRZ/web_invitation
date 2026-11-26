-- Cuándo mandó Ivan la invitación por WhatsApp (docs/invitaciones.md, tareas 2, 3 y 6; Ivan, 25 nov 2026).
-- La llena `npm run whatsapp` al tocar "Marcar enviada"; vacía = todavía no se manda. Sin reglas: no bloquea nada.
-- Junto a first_opened_at dice si alguien abrió su enlace antes de que se lo mandaran (enlace cruzado).
alter table public.invitations add column if not exists sent_at timestamptz;
