-- Quita la regla "una invitación impresa no puede tener teléfono" (check guests_check, de la primera migración).
-- Nadie la pidió: impedía cambiar una invitación de digital a impresa sin borrar su teléfono (Ivan, 24 nov 2026).
-- El teléfono de la invitación vale para cualquier canal. `if exists`: en la base de Ivan ya se quitó a mano.
alter table public.invitations drop constraint if exists guests_check;
