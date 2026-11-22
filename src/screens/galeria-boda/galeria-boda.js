// Lo que las páginas de la galería de la boda necesitan saber en cada visita (docs/pantallas.md § 6.9).
// Las páginas no leen config/ (CLAUDE.md § 7 › Capas de UI): la pantalla se lo da.
import { evento } from '@/config/evento.js';
import { estadoDe } from './galeria-boda.data.js';

/**
 * Estado de la galería a esta hora: antes de abrir (el rollo sin revelar), abierta o cerrada (el rollo completo).
 * El servidor valida las mismas dos horas al recibir una foto (TODO(backend)).
 * @param {number} [ahoraMs]
 */
export function estadoGaleria(ahoraMs = Date.now()) {
  return estadoDe(ahoraMs, evento.galeriaBoda);
}

/**
 * Fotos compartidas, por orden de llegada.
 * TODO(backend): leerlas de Supabase (con la URL pública de la foto y su miniatura, y la familia o null).
 * @returns {Promise<{ total: number, fotos: import('./galeria-boda.data.js').Foto[] }>}
 */
export async function fotosCompartidas() {
  return { total: 0, fotos: [] };
}
