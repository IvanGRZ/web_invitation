// Datos del evento: única fuente de verdad (ver CLAUDE.md § 3).
// No inventes datos: lo que no esté confirmado se deja como opcional y la UI muestra "por confirmar".
// Se valida con zod al cargar: si algo está mal, falla al arrancar y no en producción.
import { z } from 'astro/zod';

/** Instante ISO 8601 con offset explícito, p. ej. 2027-02-20T18:00:00-06:00 */
const instante = z.iso.datetime({ offset: true });

const persona = z.object({
  nombre: z.string().min(1),
  completo: z.string().min(1),
});

const lugar = z.object({
  nombre: z.string().min(1),
  direccion: z.string().min(1),
  inicio: instante.optional(),
});

const EventoSchema = z.object({
  /** Siempre el novio primero (CLAUDE.md § 1.3). "Ivan" va sin acento. */
  novios: z.object({ el: persona, ella: persona }),
  zonaHoraria: z.literal('America/Mexico_City'),
  ciudad: z.string().min(1),
  ceremonia: lugar.extend({ inicio: instante }),
  recepcion: lugar,
  vestimenta: z.string().min(1),
  soloAdultos: z.boolean(),
  /** Último instante válido para confirmar asistencia. */
  fechaLimiteRsvp: instante,
});

export const evento = EventoSchema.parse({
  novios: {
    el: { nombre: 'Ivan', completo: 'Ivan Guerrero Ruiz' },
    ella: { nombre: 'Emma', completo: 'Emma Ascencio López' },
  },
  zonaHoraria: 'America/Mexico_City',
  ciudad: 'Guadalajara',
  ceremonia: {
    nombre: 'Templo Expiatorio Eucarístico de Guadalajara',
    direccion: 'Calle M. López Cotilla 935, Col. Americana',
    inicio: '2027-02-20T18:00:00-06:00',
  },
  recepcion: {
    nombre: 'Mansión Magnolia',
    direccion: 'Calle Francisco I. Madero 636, Col. Centro',
    // inicio: pendiente de Ivan (se muestra "a continuación de la ceremonia").
  },
  vestimenta: 'Etiqueta rigurosa',
  soloAdultos: true,
  fechaLimiteRsvp: '2027-01-23T23:59:59-06:00',
});
