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
  /** Destino que se manda a Maps, Waze y Uber ("Cómo llegar"). */
  destino: z.string().min(1),
  inicio: instante.optional(),
  /** Fin del evento (sólo la recepción: fin de la fiesta). */
  fin: instante.optional(),
});

const EventoSchema = z.object({
  /** Siempre el novio primero (CLAUDE.md § 1.3). "Ivan" va sin acento. */
  novios: z.object({ el: persona, ella: persona }),
  zonaHoraria: z.literal('America/Mexico_City'),
  ciudad: z.string().min(1),
  ceremonia: lugar.extend({ inicio: instante }),
  recepcion: lugar,
  /** Programa de la fiesta: sólo la hora de inicio de cada momento, en orden (CLAUDE.md § 3). */
  itinerario: z
    .array(
      z.object({
        /** Identificador estable del momento (el icono de cada uno vive en screens/itinerario). */
        clave: z.enum(['coctel', 'entrada', 'banquete', 'vals', 'pista', 'fin']),
        momento: z.string().min(1),
        inicio: instante,
      }),
    )
    .min(1),
  vestimenta: z.string().min(1),
  soloAdultos: z.boolean(),
  /** Último instante válido para confirmar asistencia. */
  fechaLimiteRsvp: instante,
  /** Galería de la boda (docs/pantallas.md § 6.9): se abre al empezar la ceremonia y deja de recibir fotos
   *  al mediodía siguiente (Ivan, 20 nov). Las historias se siguen viendo después del cierre. */
  galeriaBoda: z.object({ apertura: instante, cierre: instante }),
}).refine(
  (e) =>
    e.itinerario[0].inicio === e.recepcion.inicio &&
    e.itinerario[e.itinerario.length - 1].inicio === e.recepcion.fin,
  { message: 'El itinerario debe empezar al inicio de la recepción y terminar en su fin' },
).refine((e) => Date.parse(e.galeriaBoda.apertura) < Date.parse(e.galeriaBoda.cierre), {
  message: 'La galería de la boda debe abrirse antes de cerrarse',
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
    destino: 'Templo Expiatorio Eucarístico, Guadalajara',
    inicio: '2027-02-20T18:00:00-06:00',
  },
  recepcion: {
    nombre: 'Mansión Magnolia',
    direccion: 'Calle Francisco I. Madero 636, Col. Centro',
    destino: 'Mansión Magnolia, Francisco I. Madero 636, Guadalajara',
    inicio: '2027-02-20T19:30:00-06:00',
    // 02:00 "Fin de la fiesta" del itinerario (confirmado por Ivan, CLAUDE.md § 3).
    fin: '2027-02-21T02:00:00-06:00',
  },
  itinerario: [
    { clave: 'coctel', momento: 'Cóctel de bienvenida', inicio: '2027-02-20T19:30:00-06:00' },
    { clave: 'entrada', momento: 'Entrada de los novios', inicio: '2027-02-20T21:20:00-06:00' },
    { clave: 'banquete', momento: 'Banquete', inicio: '2027-02-20T21:30:00-06:00' },
    { clave: 'vals', momento: 'El vals', inicio: '2027-02-20T22:30:00-06:00' },
    { clave: 'pista', momento: 'Abrimos la pista', inicio: '2027-02-20T22:55:00-06:00' },
    { clave: 'fin', momento: 'Fin de la fiesta', inicio: '2027-02-21T02:00:00-06:00' },
  ],
  vestimenta: 'Etiqueta rigurosa',
  soloAdultos: true,
  fechaLimiteRsvp: '2027-01-15T23:59:59-06:00',
  galeriaBoda: {
    apertura: '2027-02-20T18:00:00-06:00',
    cierre: '2027-02-21T12:00:00-06:00',
  },
});
