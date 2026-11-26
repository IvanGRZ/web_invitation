// Carga común de las páginas personalizadas (/i/<codigo>/…). El guion bajo hace que Astro no la tome como ruta.
// Valida el código con zod antes de consultar, busca la familia, pone los headers privados y registra la apertura
// sin hacer esperar a la página (CLAUDE.md § 7 › Rutas; docs/invitaciones.md, tarea 4).
import { evento } from '@/config/evento.js';
import { esVistaPreviaDeEnlace } from '@/server/domain/aperturas.js';
import { CodigoSchema } from '@/server/domain/codigo.js';
import { paraQuien } from '@/server/domain/confirmacion.js';
import { abrirInvitacion, registrarApertura } from '@/server/services/confirmacion.js';
import { repositorioInvitados } from '@/server/repositories/invitados.js';

const nombres = `${evento.novios.el.nombre} & ${evento.novios.ella.nombre}`;

/**
 * @param {import('astro').AstroGlobal} Astro
 * @returns {Promise<null | (NonNullable<Awaited<ReturnType<typeof abrirInvitacion>>> & { base: string, ogTitle: string, canonica: boolean, noindex: boolean })>}
 *   null si el código no existe o la invitación no tiene personas (la página responde con el 404); `canonica` false si la ruta trae el código
 *   en minúsculas o con guion (la página redirige a la dirección limpia); `noindex` false sólo para la vista previa de un enlace.
 */
export async function cargarInvitacion(Astro) {
  // Nunca en caché de la CDN ni indexada: cada código es privado (también en su 404).
  Astro.response.headers.set('Cache-Control', 'private, no-store');
  Astro.response.headers.set('X-Robots-Tag', 'noindex');

  const codigo = CodigoSchema.safeParse(Astro.params.codigo);
  if (!codigo.success) return null;
  const abierta = await abrirInvitacion(codigo.data, { repositorio: repositorioInvitados });
  if (!abierta) return null;

  // Con `noindex` WhatsApp no muestra la imagen de la vista previa: a las apps de mensajería no se les manda (ni
  // header ni <meta>). Buscadores y personas lo siguen recibiendo, y la página nunca entra en la caché de la CDN.
  const noindex = !esVistaPreviaDeEnlace(Astro.request.headers.get('user-agent'));
  if (!noindex) Astro.response.headers.delete('X-Robots-Tag');

  // Sin esperar respuesta: en Netlify, waitUntil mantiene viva la función hasta que termine la escritura.
  const tarea = registrarApertura(
    abierta.invitacion,
    { metodo: Astro.request.method, userAgent: Astro.request.headers.get('user-agent') },
    { repositorio: repositorioInvitados },
  );
  if (tarea) /** @type {any} */ (Astro.locals).netlify?.context?.waitUntil?.(tarea);

  return {
    ...abierta,
    base: `/i/${abierta.invitacion.codigo}`,
    ogTitle: `${nombres} · Invitación para ${paraQuien(abierta.invitacion.etiqueta)}`,
    canonica: codigo.data === Astro.params.codigo,
    noindex,
  };
}
