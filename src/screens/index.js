// Registro del recorrido: qué pantallas hay, en qué orden y en qué ruta vive cada una
// (CLAUDE.md § 7 › Rutas y › Recorrido de pantallas). Agregar una pantalla = importarla y sumarla aquí.
//
// Cada pantalla tiene su propia dirección, como una página: `/portada`, `/bienvenida`…
// (en las personalizadas `/i/<codigo>/portada`…). La ruta base (`/` o `/i/<codigo>`) abre la
// primera pantalla y la barra muestra su dirección.
import { evento } from '@/config/evento.js';
import Portada from './portada/Portada.astro';
import Bienvenida from './bienvenida/Bienvenida.astro';
import Ceremonia from './ceremonia/Ceremonia.astro';
import Itinerario from './itinerario/Itinerario.astro';
import Vestimenta from './vestimenta/Vestimenta.astro';
import Galeria from './galeria/Galeria.astro';
import Cierre from './cierre/Cierre.astro';
import Confirmacion from './confirmacion/Confirmacion.astro';
import GaleriaBoda from './galeria-boda/GaleriaBoda.astro';
import Historias from './galeria-boda/Historias.astro';
import NoEncontrada from './no-encontrada/NoEncontrada.astro';

const nombres = `${evento.novios.el.nombre} & ${evento.novios.ella.nombre}`;

/**
 * @typedef {Object} Pantalla
 * @property {string} id ancla HTML de la pantalla
 * @property {string} slug segmento de la ruta
 * @property {string | null} titulo encabezado de la pantalla para el título de la pestaña (null = sólo los nombres)
 * @property {any} Componente módulo de src/screens/<pantalla>/
 */

/** @type {Pantalla[]} */
export const pantallas = [
  { id: 'portada', slug: 'portada', titulo: null, Componente: Portada },
  { id: 'bienvenida', slug: 'bienvenida', titulo: 'Nuestra historia', Componente: Bienvenida },
  { id: 'ceremonia', slug: 'ceremonia', titulo: 'Ceremonia y recepción', Componente: Ceremonia },
  { id: 'itinerario', slug: 'itinerario', titulo: 'Programa de la noche', Componente: Itinerario },
  { id: 'vestimenta', slug: 'vestimenta', titulo: 'Código de vestimenta', Componente: Vestimenta },
  { id: 'galeria', slug: 'galeria', titulo: 'Un paso a la vez', Componente: Galeria },
  { id: 'cierre', slug: 'cierre', titulo: 'Tu invitación', Componente: Cierre },
];

/**
 * Pantalla aparte de la confirmación (de día, fuera del recorrido; docs/pantallas.md § 6.7).
 * Vive en su propia página: `/confirmar` (o `/i/<codigo>/confirmar`), que la arma con su estado.
 * @type {Pantalla}
 */
export const confirmacion = { id: 'confirmar', slug: 'confirmar', titulo: 'Confirma tu asistencia', Componente: Confirmacion };

/**
 * Pantallas aparte de la galería de la boda (de noche, fuera del recorrido; docs/pantallas.md § 6.9): subir fotos
 * (o el rollo, antes de abrir y después de cerrar) y las historias de la noche. Las lleva "Compartir mis fotos"
 * de la galería. Cada una vive en su página bajo demanda: su estado depende de la hora de la visita.
 * @type {Pantalla}
 */
export const galeriaBoda = { id: 'galeria-de-la-boda', slug: 'galeria-de-la-boda', titulo: 'Galería de la boda', Componente: GaleriaBoda };
/** @type {Pantalla} */
export const historias = { id: 'historias', slug: 'galeria-de-la-boda/historias', titulo: 'Historias de la noche', Componente: Historias };

/**
 * Pantalla general del 404 (de noche, fuera del recorrido; docs/pantallas.md § 6.8): un `/i/<codigo>` inexistente
 * o cualquier ruta que no exista. La arma `pages/404.astro`; la dirección no cambia (se queda la que se pidió).
 * @type {Pantalla}
 */
export const noEncontrada = { id: 'no-encontrada', slug: '404', titulo: 'No encontramos esta invitación', Componente: NoEncontrada };

/**
 * Dirección de una pantalla.
 * @param {string} base ruta base del recorrido ('' para la invitación general, '/i/<codigo>' para una familia)
 * @param {string} slug
 */
export function rutaDe(base, slug) {
  return `${base}/${slug}`;
}

/**
 * Dirección de la pantalla de confirmación (aparte del recorrido, de día; docs/pantallas.md § 6.7).
 * La llevan el botón de la portada y el sello del cierre.
 * @param {string} base
 */
export function confirmacionDe(base) {
  return rutaDe(base, confirmacion.slug);
}

/**
 * Dirección de la galería de la boda (subir fotos). La lleva "Compartir mis fotos" de la galería.
 * @param {string} base
 */
export function galeriaBodaDe(base) {
  return rutaDe(base, galeriaBoda.slug);
}

/**
 * Dirección de las historias de la noche.
 * @param {string} base
 */
export function historiasDe(base) {
  return rutaDe(base, historias.slug);
}

/**
 * Enlace a una pantalla: su dirección más el #ancla, que sirve de respaldo sin JS
 * (con JS, scripts/pantallas.js desplaza hasta ella y deja sólo la dirección).
 * @param {string} base
 * @param {Pantalla} pantalla
 */
export function enlaceDe(base, pantalla) {
  return `${rutaDe(base, pantalla.slug)}#${pantalla.id}`;
}

/**
 * Título de la pestaña para una pantalla.
 * @param {Pantalla} pantalla
 */
export function tituloDe(pantalla) {
  return pantalla.titulo ? `${pantalla.titulo} · ${nombres}` : nombres;
}
