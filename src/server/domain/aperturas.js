// Registro de aperturas (docs/invitaciones.md, tarea 4) y límite de intentos del candado.

/** Intentos fallidos del candado por IP en una hora (docs/invitaciones.md: "p. ej. 10 por hora"). */
export const INTENTOS_MAX = 10;
export const VENTANA_INTENTOS_MS = 60 * 60 * 1000;

// Vistas previas y robots: WhatsApp pide la página al escribir el mensaje, antes de enviarlo.
const VISTA_PREVIA =
  /whatsapp|facebookexternalhit|facebot|meta-externalagent|telegrambot|twitterbot|slackbot|discordbot|linkedinbot|skypeuripreview|applebot|googlebot|bingbot|embedly|preview|bot\b|crawler|spider/i;

/**
 * ¿La petición viene de una vista previa o de un robot? Sin User-Agent también cuenta como robot.
 * @param {string | null | undefined} userAgent
 */
export function esVistaPrevia(userAgent) {
  return !userAgent || VISTA_PREVIA.test(userAgent);
}

/**
 * ¿Cuenta esta visita como apertura del enlace? Sólo GET de una persona (HEAD lo usan los robots).
 * @param {{ metodo: string, userAgent: string | null | undefined }} visita
 */
export function cuentaComoApertura({ metodo, userAgent }) {
  return metodo === 'GET' && !esVistaPrevia(userAgent);
}

// Sólo quienes arman la vista previa de un enlace en un chat, NUNCA buscadores (Googlebot, Bingbot, Applebot): con
// `noindex` WhatsApp muestra el título pero no la imagen (26 nov 2026), y a ellos no se les manda.
// iMessage se presenta como "facebookexternalhit … Facebot Twitterbot".
const VISTA_PREVIA_DE_ENLACE =
  /whatsapp|facebookexternalhit|facebot|telegrambot|twitterbot|slackbot|discordbot|linkedinbot|skypeuripreview/i;

/**
 * ¿Pide la página una app de mensajería para armar la vista previa del enlace? Sin User-Agent: no.
 * @param {string | null | undefined} userAgent
 */
export function esVistaPreviaDeEnlace(userAgent) {
  return Boolean(userAgent) && VISTA_PREVIA_DE_ENLACE.test(/** @type {string} */ (userAgent));
}
