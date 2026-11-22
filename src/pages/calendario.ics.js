// /calendario.ics: la boda en un archivo de calendario ("Agregar al calendario" de la pantalla de ceremonia).
// Se genera estático en el build a partir de config/evento.js. Desde la ceremonia (18:00) hasta el fin
// de la fiesta (02:00), con los dos lugares en la descripción.
import { evento } from '@/config/evento.js';
import { crearIcs } from '@/lib/calendario.js';
import { hora } from '@/lib/fechas.js';

export function GET() {
  const { novios, ceremonia, recepcion, ciudad, vestimenta } = evento;
  const ceremoniaTexto = `Ceremonia · ${hora(ceremonia.inicio)} · ${ceremonia.nombre}, ${ceremonia.direccion}, ${ciudad}`;
  const recepcionTexto = `Recepción${recepcion.inicio ? ` · ${hora(recepcion.inicio)}` : ''} · ${recepcion.nombre}, ${recepcion.direccion}, ${ciudad}`;

  const ics = crearIcs({
    uid: 'boda-ivan-emma-20270220',
    titulo: `Boda de ${novios.el.nombre} y ${novios.ella.nombre}`,
    inicio: ceremonia.inicio,
    fin: recepcion.fin ?? ceremonia.inicio,
    lugar: `${ceremonia.nombre}, ${ceremonia.direccion}, ${ciudad}`,
    descripcion: [ceremoniaTexto, recepcionTexto, `Código de vestimenta: ${vestimenta}`].join('\n'),
    creado: '2026-11-21T00:00:00Z',
  });

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="boda-ivan-y-emma.ics"',
    },
  });
}
