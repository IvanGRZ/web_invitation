// Astro Actions: operaciones que llama NUESTRA UI (CLAUDE.md § 7 › RSVP).
// Cada Action es un endpoint público (/_actions/<nombre>): valida la entrada con zod, llama al servicio y traduce
// los errores de dominio a ActionError. Sin lógica de negocio aquí.
//
// Con JS, la isla las llama como funciones (fetch por debajo). Sin JS, un <form method="POST" action={actions.x}>
// las envía a la misma página con ?_action=x; Astro corre la Action antes de pintar la página y ésta lee el
// resultado con Astro.getActionResult() (por eso las páginas que las reciben son bajo demanda).
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { ErrorDeDominio } from '@/server/domain/errores.js';
import { MENSAJE_MAX, PERSONAS_MAX } from '@/server/domain/confirmacion.js';
import { confirmarAsistencia, entrarConCodigo } from '@/server/services/confirmacion.js';
import { repositorioInvitados } from '@/server/repositories/invitados.js';

/** El candado responde igual de lento exista o no el código (docs/invitaciones.md). */
const ESPERA_CANDADO_MS = 600;

/** @type {Record<import('@/server/domain/errores.js').TipoError, import('astro:actions').ActionErrorCode>} */
const CODIGOS = {
  'codigo-inexistente': 'NOT_FOUND',
  'demasiados-intentos': 'TOO_MANY_REQUESTS',
  cerrada: 'FORBIDDEN',
  'respuesta-invalida': 'BAD_REQUEST',
};

/** @param {unknown} error */
function traducir(error) {
  if (error instanceof ErrorDeDominio) return new ActionError({ code: CODIGOS[error.tipo], message: error.message });
  return error;
}

/** sha-256 de la IP en hexadecimal: se limitan intentos sin guardar la IP. @param {string} ip */
async function huellaDe(ip) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** @param {number} hasta instante (ms) */
const esperarHasta = (hasta) => new Promise((r) => setTimeout(r, Math.max(0, hasta - Date.now())));

export const server = {
  /** El candado: busca el código en guests; si existe, da la dirección de la confirmación de esa familia. */
  entrar: defineAction({
    accept: 'form',
    input: z.object({ codigo: z.string().max(32) }),
    handler: async ({ codigo }, context) => {
      const fin = Date.now() + ESPERA_CANDADO_MS;
      try {
        const huella = await huellaDe(context.clientAddress ?? 'desconocida');
        const { codigo: limpio } = await entrarConCodigo({ codigo, huella }, { repositorio: repositorioInvitados });
        return { destino: `/i/${limpio}/confirmar` };
      } catch (error) {
        throw traducir(error);
      } finally {
        await esperarHasta(fin);
      }
    },
  }),

  /** Confirmación de asistencia: { attending, people, message } de la invitación del código. */
  rsvp: defineAction({
    accept: 'form',
    input: z.object({
      codigo: z.string().max(32),
      attending: z.boolean(),
      // Ids de las personas que asisten (un campo "people" por silla ocupada).
      people: z.array(z.string().uuid()).max(PERSONAS_MAX),
      // El límite real (500, sin \r) lo revisa el dominio; aquí sólo se corta lo absurdo.
      message: z.string().max(MENSAJE_MAX * 2).optional(),
    }),
    handler: async ({ codigo, attending, people, message }) => {
      try {
        return await confirmarAsistencia(
          { codigo, asiste: attending, asistentes: people, mensaje: message },
          { repositorio: repositorioInvitados },
        );
      } catch (error) {
        throw traducir(error);
      }
    },
  }),
};
