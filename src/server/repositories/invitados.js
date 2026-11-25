// Única capa que conoce las tablas de Supabase (invitations, invitation_members, person, rsvps,
// invitation_responses, code_attempts): consultas y mapeo de filas.
// Devuelve objetos del dominio (en español) y lanza Error si Supabase falla.
import { supabase } from '@/server/db/supabase.js';

/**
 * @typedef {import('@/server/domain/confirmacion.js').Respuesta} Respuesta
 * @typedef {import('@/server/domain/confirmacion.js').Persona} Persona
 * @typedef {{ id: string, codigo: string, etiqueta: string, personas: Persona[], respuesta: Respuesta | null }} Invitacion
 */

/** @param {{ message: string } | null} error @param {string} que */
function revisar(error, que) {
  if (error) throw new Error(`Supabase (${que}): ${error.message}`);
}

/** Uno a uno de PostgREST: objeto, arreglo o null. @param {any} valor */
const uno = (valor) => (Array.isArray(valor) ? valor[0] : valor) ?? null;

export const repositorioInvitados = {
  /**
   * La invitación de un código, con sus personas en orden y la respuesta (si ya respondieron).
   * @param {string} codigo normalizado
   * @returns {Promise<Invitacion | null>}
   */
  async buscarPorCodigo(codigo) {
    const { data, error } = await supabase
      .from('invitations')
      .select(
        `id, code, label,
         invitation_responses(message, responded_at),
         invitation_members(position, role, person(id, name, first_last_name, second_last_name, rsvps(attending)))`,
      )
      .eq('code', codigo)
      .maybeSingle();
    revisar(error, 'buscar invitación');
    if (!data) return null;

    const miembros = [...(data.invitation_members ?? [])].sort((a, b) => a.position - b.position);
    const personas = miembros.map((m) => {
      const p = uno(m.person);
      return {
        id: p.id,
        nombre: p.name,
        primerApellido: p.first_last_name ?? undefined,
        segundoApellido: p.second_last_name ?? undefined,
        rol: m.role,
        asiste: uno(p.rsvps)?.attending ?? null,
      };
    });
    const respondida = uno(data.invitation_responses);
    const asistentes = personas.filter((p) => p.asiste).map((p) => p.id);
    return {
      id: data.id,
      codigo: data.code,
      etiqueta: data.label,
      personas: personas.map(({ asiste, ...persona }) => persona),
      respuesta: respondida
        ? {
            asiste: asistentes.length > 0,
            invitados: asistentes.length,
            asistentes,
            mensaje: respondida.message ?? undefined,
            recibida: respondida.responded_at,
          }
        : null,
    };
  },

  /**
   * Guarda la respuesta de la invitación (idempotente): asisten `asistentes` y no asisten las demás personas.
   * Una sola transacción en la base (función save_rsvp).
   * @param {string} idInvitacion
   * @param {{ asistentes: string[], mensaje?: string, recibida: Date }} respuesta
   * @returns {Promise<Respuesta>}
   */
  async guardarRespuesta(idInvitacion, { asistentes, mensaje, recibida }) {
    const { error } = await supabase.rpc('save_rsvp', {
      p_invitation_id: idInvitacion,
      p_attending: asistentes,
      p_message: mensaje ?? null,
      p_at: recibida.toISOString(),
    });
    revisar(error, 'guardar respuesta');
    return {
      asiste: asistentes.length > 0,
      invitados: asistentes.length,
      asistentes,
      mensaje,
      recibida: recibida.toISOString(),
    };
  },

  /** @param {string} idInvitacion */
  async registrarApertura(idInvitacion) {
    const { error } = await supabase.rpc('register_open', { p_guest_id: idInvitacion });
    revisar(error, 'registrar apertura');
  },

  /**
   * Intentos fallidos del candado de una IP desde un instante.
   * @param {string} huella sha-256 de la IP
   * @param {Date} desde
   */
  async contarIntentos(huella, desde) {
    const { count, error } = await supabase
      .from('code_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('ip_hash', huella)
      .gte('attempted_at', desde.toISOString());
    revisar(error, 'contar intentos');
    return count ?? 0;
  },

  /** @param {string} huella sha-256 de la IP */
  async registrarIntento(huella) {
    const { error } = await supabase.rpc('register_code_attempt', { p_ip_hash: huella });
    revisar(error, 'registrar intento');
  },
};
