// Reglas puras de la confirmación (CLAUDE.md § 7 › RSVP): quiénes asisten, fecha límite, consistencia y mensaje.
// La respuesta es por persona: de cada invitación, quiénes van y quiénes no. Sin I/O: `ahora` siempre llega de fuera.
import { ErrorDeDominio } from './errores.js';

/** Personas por invitación (la base lo revisa también con un trigger). */
export const PERSONAS_MAX = 12;
/** Longitud máxima del mensaje (la misma del campo de la pantalla y del check de la tabla). */
export const MENSAJE_MAX = 500;

/**
 * @typedef {{ id: string, nombre: string, primerApellido?: string, segundoApellido?: string, rol: 'titular' | 'acompañante' }} Persona
 * @typedef {{ asiste: boolean, invitados: number, asistentes: string[], mensaje?: string, recibida: string }} Respuesta
 *   asistentes: ids de las personas que van; invitados: cuántas son
 * @typedef {'pasos' | 'regreso' | 'cerrada'} EstadoConfirmacion
 */

/**
 * ¿Todavía se puede confirmar o cambiar la respuesta? El último instante válido es la fecha límite.
 * @param {Date} ahora
 * @param {string} limite instante ISO con offset (evento.fechaLimiteRsvp)
 */
export function estaAbierta(ahora, limite) {
  return ahora.getTime() <= Date.parse(limite);
}

/**
 * Con qué abre la pantalla de confirmación de una invitación.
 * @param {{ respuesta: Respuesta | null, ahora: Date, limite: string }} datos
 * @returns {EstadoConfirmacion}
 */
export function estadoDeConfirmacion({ respuesta, ahora, limite }) {
  if (!estaAbierta(ahora, limite)) return 'cerrada';
  return respuesta ? 'regreso' : 'pasos';
}

/**
 * Limpia el mensaje: sin espacios a los lados y con saltos de línea \n (el navegador los envía como \r\n,
 * que contarían doble contra el máximo). Vacío → undefined.
 * @param {string | undefined | null} mensaje
 */
export function limpiarMensaje(mensaje) {
  const limpio = String(mensaje ?? '')
    .replace(/\r\n?/g, '\n')
    .trim();
  return limpio || undefined;
}

/**
 * Valida una respuesta contra las personas de la invitación y la deja consistente.
 * Si no asisten, nadie va (se ignoran las personas marcadas). Si asisten, al menos una, y todas deben ser de
 * esta invitación.
 * @param {{ asiste: boolean, asistentes: string[], mensaje?: string | null }} respuesta
 * @param {{ personas: { id: string }[] }} invitacion
 * @returns {{ asistentes: string[], mensaje: string | undefined }}
 */
export function validarRespuesta({ asiste, asistentes, mensaje }, { personas }) {
  const texto = limpiarMensaje(mensaje);
  if (texto && texto.length > MENSAJE_MAX) {
    throw new ErrorDeDominio('respuesta-invalida', `El mensaje pasa de ${MENSAJE_MAX} caracteres`);
  }
  if (!asiste) return { asistentes: [], mensaje: texto };
  const deLaInvitacion = new Set(personas.map((p) => p.id));
  const unicos = [...new Set(asistentes)];
  if (unicos.some((id) => !deLaInvitacion.has(id))) {
    throw new ErrorDeDominio('respuesta-invalida', 'Hay personas que no son de esta invitación');
  }
  if (unicos.length === 0) throw new ErrorDeDominio('respuesta-invalida', 'Si asisten, al menos una persona');
  return { asistentes: unicos, mensaje: texto };
}

/**
 * Nombre de una persona como va bajo su silla: nombre y primer apellido (sólo el nombre si no tiene apellido).
 * @param {Pick<Persona, 'nombre' | 'primerApellido'>} persona
 */
export function nombreCorto({ nombre, primerApellido }) {
  return primerApellido ? `${nombre} ${primerApellido}` : nombre;
}

/**
 * Para quién es la invitación, en el título de la vista previa de WhatsApp:
 * "la Familia García" o, si no es una familia, el nombre tal cual ("Juan Pérez y Ana Ruiz").
 * @param {string} etiqueta
 */
export function paraQuien(etiqueta) {
  return /^familia\s/i.test(etiqueta) ? `la ${etiqueta}` : etiqueta;
}
