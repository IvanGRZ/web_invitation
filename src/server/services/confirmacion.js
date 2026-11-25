// Casos de uso de la confirmación (CLAUDE.md § 7 › Capas de lógica): orquestan dominio y repositorio.
// No saben de HTTP ni de SQL. El repositorio y `ahora` llegan inyectados para poder probarlos sin Supabase.
import { evento } from '@/config/evento.js';
import { tieneFormatoDeCodigo, normalizarCodigo } from '@/server/domain/codigo.js';
import { estaAbierta, estadoDeConfirmacion, validarRespuesta } from '@/server/domain/confirmacion.js';
import { cuentaComoApertura, INTENTOS_MAX, VENTANA_INTENTOS_MS } from '@/server/domain/aperturas.js';
import { ErrorDeDominio } from '@/server/domain/errores.js';

/**
 * @typedef {import('@/server/repositories/invitados.js').Invitacion} Invitacion
 * @typedef {typeof import('@/server/repositories/invitados.js').repositorioInvitados} Repositorio
 * @typedef {{ repositorio: Repositorio, ahora?: Date, limite?: string }} Dependencias
 */

/**
 * Una invitación con personas, o null si el código no existe o la invitación se quedó sin nadie (a quien abra
 * ese enlace se le responde con el 404).
 * @param {Repositorio} repositorio
 * @param {string} codigo normalizado
 */
async function buscarConPersonas(repositorio, codigo) {
  if (!tieneFormatoDeCodigo(codigo)) return null;
  const invitacion = await repositorio.buscarPorCodigo(codigo);
  return invitacion && invitacion.personas.length > 0 ? invitacion : null;
}

/**
 * Invitación por su código (ya validado con CodigoSchema), con el estado con el que abre su confirmación.
 * null si no existe o no tiene personas (la página responde con el 404).
 * @param {string} codigo
 * @param {Dependencias} deps
 */
export async function abrirInvitacion(codigo, { repositorio, ahora = new Date(), limite = evento.fechaLimiteRsvp }) {
  const invitacion = await buscarConPersonas(repositorio, codigo);
  if (!invitacion) return null;
  return { invitacion, estado: estadoDeConfirmacion({ respuesta: invitacion.respuesta, ahora, limite }) };
}

/**
 * Registra que abrieron el enlace de una invitación, salvo vistas previas y robots. Nunca lanza: el registro no debe
 * tumbar la página. Devuelve la promesa (para `waitUntil`) o null si no cuenta.
 * @param {Invitacion} invitacion
 * @param {{ metodo: string, userAgent: string | null }} visita
 * @param {{ repositorio: Repositorio }} deps
 */
export function registrarApertura(invitacion, visita, { repositorio }) {
  if (!cuentaComoApertura(visita)) return null;
  return repositorio.registrarApertura(invitacion.id).catch((e) => {
    console.error('No se pudo registrar la apertura', e);
  });
}

/**
 * El candado: ¿existe una invitación con este código? Limita los intentos fallidos por IP.
 * @param {{ codigo: string, huella: string }} entrada código tal como lo escribieron y sha-256 de la IP
 * @param {Dependencias} deps
 * @returns {Promise<{ codigo: string }>} el código normalizado
 */
export async function entrarConCodigo({ codigo, huella }, { repositorio, ahora = new Date() }) {
  const desde = new Date(ahora.getTime() - VENTANA_INTENTOS_MS);
  if ((await repositorio.contarIntentos(huella, desde)) >= INTENTOS_MAX) {
    throw new ErrorDeDominio('demasiados-intentos', 'Demasiados intentos con códigos que no existen');
  }
  const invitacion = await buscarConPersonas(repositorio, normalizarCodigo(codigo));
  if (!invitacion) {
    await repositorio.registrarIntento(huella);
    throw new ErrorDeDominio('codigo-inexistente', 'No existe una invitación con ese código');
  }
  return { codigo: invitacion.codigo };
}

/**
 * Guarda la respuesta de una invitación (o la cambia) hasta la fecha límite: quiénes van (por su id) y el
 * mensaje. Las demás personas de la invitación quedan como que no asisten.
 * @param {{ codigo: string, asiste: boolean, asistentes: string[], mensaje?: string | null }} entrada
 * @param {Dependencias} deps
 */
export async function confirmarAsistencia(
  { codigo, asiste, asistentes, mensaje },
  { repositorio, ahora = new Date(), limite = evento.fechaLimiteRsvp },
) {
  const invitacion = await buscarConPersonas(repositorio, normalizarCodigo(codigo));
  if (!invitacion) throw new ErrorDeDominio('codigo-inexistente', 'No existe una invitación con ese código');
  if (!estaAbierta(ahora, limite)) throw new ErrorDeDominio('cerrada', 'Las confirmaciones cerraron');
  const respuesta = validarRespuesta({ asiste, asistentes, mensaje }, invitacion);
  return repositorio.guardarRespuesta(invitacion.id, { ...respuesta, recibida: ahora });
}
