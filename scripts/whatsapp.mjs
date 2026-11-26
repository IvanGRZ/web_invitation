// Lista de envío por WhatsApp (docs/invitaciones.md, tareas 2, 3 y 6): prepara las siguientes invitaciones digitales
// pendientes y abre una página local con una fila por invitación, su botón "Abrir en WhatsApp" (wa.me con el mensaje
// ya escrito) y "Marcar enviada". NO envía nada: Ivan manda cada mensaje a mano (WhatsApp puede bloquear el número).
//
// Uso:
//   npm run whatsapp -- <n>                         las siguientes n pendientes (n desde 1)
//   npm run whatsapp -- --codigos K7M2PQ9X,BGD7F9AN  invitaciones específicas (con o sin guion)
//   npm run whatsapp -- <n> --reenviar              incluye las ya enviadas
//
// Datos: lee Supabase con la service key de .env.local (nunca se imprime). La única escritura es `sent_at` de la
// invitación al tocar "Marcar enviada" (migración 20261125000000_envio_whatsapp.sql; Ivan, 25 nov 2026).
// La página lleva teléfonos: se sirve sólo en 127.0.0.1 y su copia va a scripts/salida/ (ignorada), nunca al repo.
import { createServer } from 'node:http';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { evento } from '../src/config/evento.js';
import { fechaLarga } from '../src/lib/fechas.js';
import { normalizarCodigo, tieneFormatoDeCodigo } from '../src/server/domain/codigo.js';
import { paraQuien } from '../src/server/domain/confirmacion.js';

const DOMINIO = 'https://ivanyemma.love';
const HOST = '127.0.0.1';
const PUERTO = 4500;
const ORIGEN = `http://${HOST}:${PUERTO}`;
const COPIA = 'scripts/salida/whatsapp.html';

// ─── Argumentos ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const reenviar = args.includes('--reenviar');
const iCodigos = args.indexOf('--codigos');
const codigosPedidos =
  iCodigos >= 0 ? (args[iCodigos + 1] ?? '').split(',').map(normalizarCodigo).filter(Boolean) : null;
const textoN = args.find((a, i) => !a.startsWith('--') && !(iCodigos >= 0 && i === iCodigos + 1));
const n = textoN === undefined ? null : Number(textoN);

function salir(mensaje) {
  console.error(mensaje);
  process.exit(1);
}
const USO = 'Uso: npm run whatsapp -- <n> [--reenviar]   o   npm run whatsapp -- --codigos K7M2PQ9X,BGD7F9AN [--reenviar]';
if (n !== null && !(Number.isInteger(n) && n >= 1)) salir(`El número de invitaciones debe ser 1 o más.\n${USO}`);
if (n === null && !codigosPedidos) salir(USO);
if (codigosPedidos) {
  if (!codigosPedidos.length) salir(`--codigos necesita al menos un código.\n${USO}`);
  const malos = codigosPedidos.filter((c) => !tieneFormatoDeCodigo(c));
  if (malos.length) salir(`Estos códigos no tienen el formato de 8 caracteres: ${malos.join(', ')}`);
}

// ─── Supabase ───────────────────────────────────────────────────────────
try {
  process.loadEnvFile('.env.local');
} catch {
  salir('No encontré .env.local (con SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY).');
}
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) salir('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local.');
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

function errorDeSupabase(error) {
  if (error.code === '42703' || /sent_at/.test(error.message ?? '')) {
    return 'La columna invitations.sent_at no existe todavía: corre primero en el SQL Editor de Supabase\n  supabase/migrations/20261125000000_envio_whatsapp.sql';
  }
  return `Supabase respondió con un error: ${error.message}`;
}

/** Invitaciones digitales con sus personas en orden de silla, en el orden en que se importaron. */
async function leerDigitales() {
  const { data, error } = await supabase
    .from('invitations')
    .select(
      'code, label, phone, first_opened_at, sent_at, created_at, invitation_members(position, person(name, first_last_name, phone))',
    )
    .eq('channel', 'digital')
    .order('created_at')
    .order('label');
  if (error) throw new Error(errorDeSupabase(error));
  return data.map(preparar);
}

// ─── Mensaje ────────────────────────────────────────────────────────────
const fechaBoda = fechaLarga(evento.ceremonia.inicio); // "sábado 20 de febrero de 2027"
const fechaLimite = fechaLarga(evento.fechaLimiteRsvp, { diaSemana: false, anio: false }); // "15 de enero"
const firma = `${evento.novios.el.nombre} y ${evento.novios.ella.nombre}`;
const tituloVistaPrevia = (label) => `${evento.novios.el.nombre} & ${evento.novios.ella.nombre} · Invitación para ${paraQuien(label)}`;

const conGuion = (codigo) => `${codigo.slice(0, 4)}-${codigo.slice(4)}`;
/** "Ana" · "Ana y Luis" · "Ana, Luis y Pepe" */
const enLista = (nombres) =>
  nombres.length <= 1 ? (nombres[0] ?? '') : `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`;

/** Saludo y número gramatical: "familia X" (plural), una persona (singular) o sus nombres (plural). */
function saludoDe(label, personas) {
  if (/^familia\s/i.test(label)) return { saludo: `familia ${label.replace(/^familia\s+/i, '')}`, plural: true };
  if (personas.length === 1) return { saludo: personas[0].name, plural: false };
  return { saludo: enLista(personas.map((p) => p.name)), plural: true };
}

function mensajeDe({ saludo, plural, enlace, codigo }) {
  const t = plural
    ? { sin: 'ustedes', espera: 'les espera su', confirma: 'nos confirmen su', pide: 'les pide' }
    : { sin: 'ti', espera: 'te espera tu', confirma: 'nos confirmes tu', pide: 'te pide' };
  return [
    `¡Hola, ${saludo}! Hay días que se esperan toda una vida, y el nuestro ya tiene fecha: el ${fechaBoda}. No lo imaginamos sin ${t.sin}. Aquí ${t.espera} invitación: ${enlace}`,
    `Nos hará muy felices que ${t.confirma} asistencia antes del ${fechaLimite}. Si en algún momento ${t.pide} un código, es ${conGuion(codigo)}.`,
    `Con cariño, ${firma}`,
  ].join('\n\n');
}

/** Fila de la base → lo que necesita la página. */
function preparar(fila) {
  const personas = [...fila.invitation_members]
    .sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
    .map((m) => m.person)
    .filter(Boolean);
  // Teléfono de la invitación; si no tiene, el del primer integrante (por silla) que tenga celular.
  const respaldo = fila.phone ? null : personas.find((p) => p.phone);
  const telefono = fila.phone ?? respaldo?.phone ?? null;
  const enlace = `${DOMINIO}/i/${fila.code}`;
  const { saludo, plural } = saludoDe(fila.label, personas);
  const mensaje = mensajeDe({ saludo, plural, enlace, codigo: fila.code });
  return {
    codigo: fila.code,
    label: fila.label,
    personas,
    telefono,
    telefonoDe: respaldo ? [respaldo.name, respaldo.first_last_name].filter(Boolean).join(' ') : null,
    enlace,
    saludo,
    mensaje,
    // Directo al chat, sin la página intermedia de wa.me (api.whatsapp.com): la aplicación de escritorio o WhatsApp Web.
    waApp: telefono ? `whatsapp://send?phone=${telefono}&text=${encodeURIComponent(mensaje)}` : null,
    waWeb: telefono ? `https://web.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}` : null,
    abierta: fila.first_opened_at,
    enviada: fila.sent_at,
    // Abierta antes de mandarla (o abierta sin haberla mandado): algo se cruzó.
    cruzada: Boolean(fila.first_opened_at && (!fila.sent_at || Date.parse(fila.first_opened_at) < Date.parse(fila.sent_at))),
  };
}

// ─── Selección de la tanda (una vez, al arrancar) ───────────────────────
let digitales;
try {
  digitales = await leerDigitales();
} catch (e) {
  salir(e.message);
}
const conTelefono = digitales.filter((d) => d.telefono);
const usaRespaldo = digitales.filter((d) => d.telefonoDe);
const pendientes = conTelefono.filter((d) => !d.enviada);

let tanda;
if (codigosPedidos) {
  const porCodigo = new Map(digitales.map((d) => [d.codigo, d]));
  tanda = [];
  for (const c of codigosPedidos) {
    const d = porCodigo.get(c);
    if (!d) console.warn(`· ${conGuion(c)}: no es una invitación digital (no existe o es impresa).`);
    else if (!d.telefono) console.warn(`· ${conGuion(c)} (${d.label}): no tiene teléfono; va en la lista de abajo.`);
    else if (d.enviada && !reenviar) console.warn(`· ${conGuion(c)} (${d.label}): ya se envió; usa --reenviar para incluirla.`);
    else if (!tanda.includes(d)) tanda.push(d);
  }
  if (n !== null) tanda = tanda.slice(0, n);
} else {
  tanda = (reenviar ? conTelefono : pendientes).slice(0, n);
}
const codigosTanda = new Set(tanda.map((d) => d.codigo));

// ─── Página ─────────────────────────────────────────────────────────────
const fechaHora = new Intl.DateTimeFormat('es-MX', {
  timeZone: evento.zonaHoraria,
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});
const cuando = (iso) => (iso ? fechaHora.format(new Date(iso)) : '');
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const telefonoVisible = (t) => `+${t}`;
const nombreCompleto = (p) => [p.name, p.first_last_name].filter(Boolean).join(' ');

function fila(d) {
  const accion = d.enviada && !reenviar
    ? `<span class="enviada">Enviada · ${esc(cuando(d.enviada))}</span>`
    : `<form method="post" action="/enviada"><input type="hidden" name="codigo" value="${esc(d.codigo)}">
         <button type="submit">${d.enviada ? 'Marcar reenviada' : 'Marcar enviada'}</button></form>
       ${d.enviada ? `<span class="enviada">Enviada · ${esc(cuando(d.enviada))}</span>` : ''}`;
  return `<tr id="${esc(d.codigo)}" class="${d.cruzada ? 'cruzada' : ''}">
  <td><strong>${esc(d.label)}</strong><br><span class="cod">${esc(conGuion(d.codigo))}</span>
    <div class="revisar">Saludo: «¡Hola, ${esc(d.saludo)}!»<br>Vista previa: «${esc(tituloVistaPrevia(d.label))}»</div></td>
  <td><strong>${d.personas.length}</strong> · ${esc(d.personas.map(nombreCompleto).join(', '))}</td>
  <td class="tel">${esc(telefonoVisible(d.telefono))}${d.telefonoDe ? `<br><span class="nota">de ${esc(d.telefonoDe)}</span>` : ''}</td>
  <td><a href="${esc(d.enlace)}" rel="noreferrer" class="enlace" title="Abrirla registra una apertura">${esc(d.enlace.replace('https://', ''))}</a></td>
  <td>${d.abierta ? `${esc(cuando(d.abierta))}${d.cruzada ? '<br><strong class="alerta">Antes de enviarla</strong>' : ''}` : '<span class="nota">No</span>'}</td>
  <td><details><summary>Ver</summary><pre>${esc(d.mensaje)}</pre></details></td>
  <td class="acciones"><a class="wa" href="${esc(d.waApp)}">WhatsApp escritorio</a><a class="wa" href="${esc(d.waWeb)}" target="whatsapp-web" rel="noreferrer">WhatsApp Web</a>${accion}</td>
</tr>`;
}

function pagina(lista, sinTelefono) {
  const faltan = lista.filter((d) => !d.enviada).length;
  return `<!doctype html>
<html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Envío por WhatsApp · Ivan y Emma</title>
<style>
  :root { color-scheme: light; --paper:#f7f2e8; --ink:#1f2d44; --muted:#5a6276; --indigo:#2f4a78; --gold:#9a7a45; --rose:#b98485; }
  body { margin:0; padding:24px 16px 48px; background:var(--paper); color:var(--ink); font:16px/1.45 system-ui, sans-serif; }
  h1 { font-weight:500; margin:0 0 4px; } h2 { font-weight:500; margin:40px 0 8px; }
  .resumen, .nota { color:var(--muted); }
  .aviso { background:#fff8e6; border:1px solid var(--gold); border-radius:12px; padding:10px 14px; margin:16px 0; }
  table { width:100%; border-collapse:collapse; background:#fdfaf4; border-radius:14px; overflow:hidden; }
  th, td { text-align:left; vertical-align:top; padding:12px 10px; border-bottom:1px solid rgba(31,45,68,.1); }
  th { font-size:13px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); font-weight:500; }
  tr.cruzada { background:#f6e3e3; } .alerta { color:#8c3b3d; }
  .cod, .tel { font-variant-numeric:tabular-nums; white-space:nowrap; }
  .revisar { margin-top:6px; font-size:14px; color:var(--muted); }
  .enlace { color:var(--indigo); word-break:break-all; }
  pre { white-space:pre-wrap; font:inherit; font-size:14px; max-width:380px; margin:8px 0 0; }
  .acciones { display:flex; flex-direction:column; gap:8px; min-width:170px; }
  .wa, button { display:inline-flex; align-items:center; justify-content:center; min-height:44px; padding:0 16px; border-radius:12px; font:inherit; cursor:pointer; text-decoration:none; }
  .wa { background:var(--indigo); color:var(--paper); }
  button { background:transparent; color:var(--indigo); border:1px solid var(--indigo); width:100%; }
  .enviada { color:var(--gold); font-weight:600; }
</style></head><body>
<h1>Envío por WhatsApp</h1>
<p class="resumen">${lista.length} invitaciones en esta tanda · ${faltan} por enviar · página local, nunca se publica.</p>
<div class="aviso">Antes de enviar cada una (tarea 6): el nombre del saludo, el del chat que abre WhatsApp y el de la vista previa tienen que coincidir. No abras los enlaces personales: registran una apertura.</div>
${lista.length ? `<table><thead><tr><th>Invitación</th><th>Personas</th><th>Teléfono</th><th>Enlace</th><th>Abrió su enlace</th><th>Mensaje</th><th></th></tr></thead>
<tbody>${lista.map(fila).join('\n')}</tbody></table>` : '<p>No hay invitaciones en esta tanda.</p>'}
<h2>Sin teléfono</h2>
${sinTelefono.length
    ? `<p class="nota">Ni la invitación ni sus personas tienen celular: mándalas por otro medio.</p><ul>${sinTelefono
        .map((d) => `<li><strong>${esc(d.label)}</strong> · ${d.personas.length} · ${esc(d.enlace)} · código ${esc(conGuion(d.codigo))}</li>`)
        .join('')}</ul>`
    : '<p class="nota">Todas las invitaciones digitales tienen teléfono.</p>'}
</body></html>`;
}

/** Vuelve a leer la base (aperturas y envíos al día) y arma la página de la tanda. */
async function render() {
  const actuales = await leerDigitales();
  const porCodigo = new Map(actuales.map((d) => [d.codigo, d]));
  const lista = [...codigosTanda].map((c) => porCodigo.get(c)).filter(Boolean);
  const sinTelefono = actuales.filter((d) => !d.telefono && (reenviar || !d.enviada));
  const html = pagina(lista, sinTelefono);
  mkdirSync('scripts/salida', { recursive: true });
  writeFileSync(COPIA, html);
  return html;
}

// ─── Servidor local ─────────────────────────────────────────────────────
const CABECERAS = {
  'Cache-Control': 'no-store',
  // same-origin, no no-referrer: con no-referrer Chrome manda "Origin: null" en el formulario y se rechazaba.
  // Hacia fuera (wa.me, el sitio) no sale nada: same-origin no manda referer y los enlaces llevan rel="noreferrer".
  'Referrer-Policy': 'same-origin',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'",
};

function responder(res, status, cuerpo, extra = {}) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', ...CABECERAS, ...extra });
  res.end(cuerpo);
}

async function leerCuerpo(req) {
  let cuerpo = '';
  for await (const parte of req) {
    cuerpo += parte;
    if (cuerpo.length > 1000) throw new Error('Cuerpo demasiado grande');
  }
  return new URLSearchParams(cuerpo);
}

const servidor = createServer(async (req, res) => {
  try {
    // Sólo desde esta misma página: otro sitio no puede marcar envíos (Host contra DNS rebinding, Origin contra CSRF).
    if (req.headers.host !== `${HOST}:${PUERTO}`) return responder(res, 421, 'Host no válido');
    const ruta = new URL(req.url ?? '/', ORIGEN).pathname;

    if (req.method === 'GET' && ruta === '/') return responder(res, 200, await render());

    if (req.method === 'POST' && ruta === '/enviada') {
      const mismoSitio = req.headers.origin === ORIGEN || req.headers['sec-fetch-site'] === 'same-origin';
      if (!mismoSitio) return responder(res, 403, 'Origen no válido');
      const codigo = normalizarCodigo((await leerCuerpo(req)).get('codigo'));
      if (!codigosTanda.has(codigo)) return responder(res, 400, 'Ese código no está en esta tanda');
      let consulta = supabase
        .from('invitations')
        .update({ sent_at: new Date().toISOString() })
        .eq('code', codigo)
        .eq('channel', 'digital');
      if (!reenviar) consulta = consulta.is('sent_at', null); // la primera fecha de envío no se pisa
      const { error } = await consulta;
      if (error) return responder(res, 500, esc(errorDeSupabase(error)));
      console.log(`✓ ${conGuion(codigo)} marcada como enviada`);
      return responder(res, 303, '', { Location: `/#${codigo}` });
    }

    responder(res, 404, 'No encontrada');
  } catch (e) {
    responder(res, 500, esc(e.message));
  }
});

servidor.on('error', (e) =>
  salir(e.code === 'EADDRINUSE' ? `El puerto ${PUERTO} está ocupado: ¿ya hay otra lista abierta?` : e.message),
);
servidor.listen(PUERTO, HOST, async () => {
  await render().catch((e) => salir(e.message));
  const enTanda = tanda.filter((d) => d.telefonoDe).length;
  console.log(`Tanda: ${tanda.length} invitaciones (${pendientes.length} digitales pendientes de enviar en total).`);
  console.log(`Teléfono de un integrante (la invitación no tiene): ${usaRespaldo.length} en total, ${enTanda} en esta tanda.`);
  console.log(`Sin ningún teléfono: ${digitales.filter((d) => !d.telefono).length}.`);
  console.log(`Abre ${ORIGEN}  (copia en ${COPIA}) · Ctrl+C para cerrar.`);
});
