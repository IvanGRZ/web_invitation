// Importa invitados desde un CSV (la lista de Excel exportada) y genera el SQL para correrlo en el SQL Editor de
// Supabase. No se conecta a la base ni usa llaves: Ivan revisa el SQL y lo corre él.
//
// Uso:
//   node scripts/importar-invitados.mjs <lista.csv> [--salida scripts/salida/importar-invitados.sql]
//   (o npm run importar:invitados -- <lista.csv>)
//
// Reglas (Ivan, 24 nov 2026):
// - Columnas que se leen: NOMBRE, APELLIDOS, CELULAR, INVITACION LABEL. Las demás (CONFIRMADO, MENÚ, DIRECCIÓN,
//   C.P., POBLACIÓN, ESTADO, MESA, SEXO y las vacías) se ignoran.
// - Sólo se importan las filas con INVITACION LABEL. Una invitación = las filas con el mismo label.
// - Acompañantes: su label es "Acompañante [de] <nombre de la persona principal>" (completo o sólo nombre y primer
//   apellido). Van en la invitación de esa persona, justo después de ella, con rol 'acompañante'. Si el nombre
//   tiene un error de dedo (una o dos letras), se empareja igual y se avisa.
// - Dos invitaciones pueden llamarse igual (p. ej. dos "Familia García" distintas): cada label del CSV es una
//   invitación nueva. El SQL se detiene si alguna de las personas ya existe en la base (con el mismo nombre y
//   apellidos), para no importar dos veces.
// - APELLIDOS se parte en primer y segundo apellido ("Mares Ruiz" → Mares / Ruiz; "De la Cruz López" → De la Cruz
//   / López). Sin apellidos, la persona se importa sólo con su nombre.
// - Celular: sólo dígitos. Si empieza con 1 es de EE. UU./Canadá (+1, 11 dígitos); con 10 dígitos es de México
//   (+52); con 11 a 15 dígitos ya trae su clave de país (p. ej. 49 de Alemania) y se guarda tal cual, con aviso.
//   Se guarda en cada persona; la invitación toma el del titular (el primero que tenga).
// - Todas las invitaciones se crean como 'digital' (Ivan cambia después las impresas).
// - Cada invitación recibe un código aleatorio de 8 caracteres (alfabeto de 31 sin ambiguos).
//
// La lista y el SQL generado llevan datos privados: van en carpetas ignoradas por git (scripts/salida/), nunca al repo.
import { randomInt, randomUUID } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const ALFABETO = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const PERSONAS_MAX = 12;
const SILLAS_EN_PANTALLA = 6;
const PARTICULAS = new Set(['de', 'del', 'la', 'las', 'los', 'y', 'san', 'van', 'von']);

// ─── Argumentos ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const entrada = args.find((a) => !a.startsWith('--'));
const iSalida = args.indexOf('--salida');
const salida = iSalida >= 0 ? args[iSalida + 1] : 'scripts/salida/importar-invitados.sql';
if (!entrada) {
  console.error('Uso: node scripts/importar-invitados.mjs <lista.csv> [--salida archivo.sql]');
  process.exit(1);
}

// ─── Utilidades ─────────────────────────────────────────────────────────
/** Sin acentos, minúsculas y espacios simples: para comparar nombres y encabezados. */
const normalizar = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
/** Espacios de más fuera. */
const limpiar = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

/** CSV con comillas; detecta si el separador es coma o punto y coma (Excel en español usa ";"). */
function leerCsv(texto) {
  texto = texto.replace(/^﻿/, '');
  const primera = texto.slice(0, texto.indexOf('\n') >>> 0);
  const sep = (primera.match(/;/g) ?? []).length > (primera.match(/,/g) ?? []).length ? ';' : ',';
  const filas = [];
  let fila = [];
  let celda = '';
  let comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (comillas) {
      if (c === '"' && texto[i + 1] === '"') { celda += '"'; i++; }
      else if (c === '"') comillas = false;
      else celda += c;
    } else if (c === '"') comillas = true;
    else if (c === sep) { fila.push(celda); celda = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++;
      fila.push(celda); filas.push(fila); fila = []; celda = '';
    } else celda += c;
  }
  if (celda || fila.length) { fila.push(celda); filas.push(fila); }
  return filas.filter((f) => f.some((x) => x.trim()));
}

/** Distancia de edición (para errores de dedo en el nombre del principal). */
function distancia(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

/** "De la Cruz López" → ['De la Cruz', 'López']: las partículas se pegan a la palabra que sigue. */
function partirApellidos(texto) {
  const palabras = limpiar(texto).split(' ').filter(Boolean);
  const apellidos = [];
  let pegado = [];
  for (const p of palabras) {
    pegado.push(p);
    if (!PARTICULAS.has(p.toLowerCase())) { apellidos.push(pegado.join(' ')); pegado = []; }
  }
  if (pegado.length) apellidos.push(pegado.join(' '));
  return { primero: apellidos[0] ?? null, segundo: apellidos.slice(1).join(' ') || null, partes: apellidos.length };
}

/** Celular internacional sin "+": empieza con 1 → +1; si no → +52. null si no tiene la forma esperada. */
function celularInternacional(texto) {
  const d = String(texto ?? '').replace(/\D/g, '');
  if (!d) return { numero: null };
  if (d.startsWith('1')) return d.length === 11 ? { numero: d } : { numero: null, raro: true };
  if (d.length === 10) return { numero: '52' + d };
  if (d.length === 12 && d.startsWith('52')) return { numero: d };
  // Otro país: el número ya trae su clave (49… Alemania). Se guarda tal cual y se avisa para revisarlo.
  if (d.length >= 11 && d.length <= 15) return { numero: d, extranjero: true };
  return { numero: null, raro: true };
}

const codigosUsados = new Set();
function codigoNuevo() {
  let c;
  do c = Array.from({ length: 8 }, () => ALFABETO[randomInt(ALFABETO.length)]).join('');
  while (codigosUsados.has(c));
  codigosUsados.add(c);
  return c;
}

const sql = (v) => (v == null ? 'null' : `'${String(v).replace(/'/g, "''")}'`);

// ─── Lectura ────────────────────────────────────────────────────────────
// Excel guarda "CSV UTF-8" en UTF-8, pero "CSV (delimitado por comas)" en Windows-1252: si los acentos no se
// leen como UTF-8, se lee como latin1.
const bytes = readFileSync(entrada);
const comoUtf8 = bytes.toString('utf8');
const [encabezados, ...filas] = leerCsv(comoUtf8.includes('�') ? bytes.toString('latin1') : comoUtf8);
const columna = (nombre) => encabezados.findIndex((h) => normalizar(h) === nombre);
const COL = { nombre: columna('nombre'), apellidos: columna('apellidos'), celular: columna('celular'), label: columna('invitacion label') };
const faltan = Object.entries(COL).filter(([, i]) => i < 0).map(([k]) => k);
if (faltan.length) {
  console.error(`Faltan columnas en el CSV: ${faltan.join(', ')}. Encabezados: ${encabezados.join(' | ')}`);
  process.exit(1);
}

const avisos = [];
const errores = [];
const personas = filas
  .map((f, i) => ({ fila: i + 2, nombre: limpiar(f[COL.nombre]), apellidos: limpiar(f[COL.apellidos]), celular: f[COL.celular], label: limpiar(f[COL.label]) }))
  .filter((p) => p.label);
const sinLabel = filas.length - personas.length;

const RE_ACOMPANANTE = /^acompa[ñn]ante\s+(?:de\s+)?(.+)$/i;
const principales = personas.filter((p) => !RE_ACOMPANANTE.test(p.label));
const acompanantes = personas.filter((p) => RE_ACOMPANANTE.test(p.label));

// Invitaciones en el orden del CSV, con sus principales.
/** @type {Map<string, { label: string, miembros: { p: any, rol: string }[] }>} */
const invitaciones = new Map();
for (const p of principales) {
  const clave = normalizar(p.label);
  if (!invitaciones.has(clave)) invitaciones.set(clave, { label: p.label, miembros: [] });
  invitaciones.get(clave).miembros.push({ p, rol: 'titular' });
}

// Cada acompañante, justo después de su principal.
const nombreCompleto = (p) => normalizar(`${p.nombre} ${p.apellidos}`);
for (const a of acompanantes) {
  const referido = normalizar(a.label.match(RE_ACOMPANANTE)[1]);
  let principal = principales.find((p) => nombreCompleto(p) === referido);
  if (!principal) {
    // "Acompañante de Miriam López": basta con el nombre y el primer apellido, si sólo hay una persona así.
    const porInicio = principales.filter((p) => nombreCompleto(p).startsWith(referido + ' '));
    if (porInicio.length === 1) principal = porInicio[0];
  }
  if (!principal) {
    const cercanos = principales.filter((p) => distancia(nombreCompleto(p), referido) <= 2);
    if (cercanos.length === 1) {
      principal = cercanos[0];
      avisos.push(`Fila ${a.fila}: "${a.label}" no coincide exacto; se emparejó con ${principal.nombre} ${principal.apellidos} (fila ${principal.fila}).`);
    } else {
      errores.push(`Fila ${a.fila}: no encontré a la persona principal de "${a.label}"${cercanos.length ? ' (hay varias parecidas)' : ''}. No se importa.`);
      continue;
    }
  }
  const inv = invitaciones.get(normalizar(principal.label));
  const despues = inv.miembros.findLastIndex((m) => m.p === principal || (m.rol === 'acompañante' && m.de === principal));
  inv.miembros.splice(despues + 1, 0, { p: a, rol: 'acompañante', de: principal });
}

// ─── Validación y armado ────────────────────────────────────────────────
const celulares = new Map();
/** Personas del archivo, para el candado del SQL (que ninguna exista ya en la base). */
const yaImportadas = [];
const bloques = [];
let totalPersonas = 0;
for (const inv of invitaciones.values()) {
  if (inv.miembros.length > PERSONAS_MAX) {
    errores.push(`"${inv.label}" tiene ${inv.miembros.length} personas (máximo ${PERSONAS_MAX}). No se importa.`);
    continue;
  }
  if (inv.miembros.length > SILLAS_EN_PANTALLA) {
    avisos.push(`"${inv.label}" tiene ${inv.miembros.length} personas: la confirmación sólo dibuja ${SILLAS_EN_PANTALLA} sillas hasta que Cowork diseñe los pases grandes.`);
  }
  const idInvitacion = randomUUID();
  const filasPersona = [];
  const filasMiembro = [];
  let celularInvitacion = null;
  inv.miembros.forEach(({ p, rol }, k) => {
    const id = randomUUID();
    const { primero, segundo, partes } = partirApellidos(p.apellidos);
    yaImportadas.push(`(${sql(p.nombre)}, ${sql(primero)}, ${sql(segundo)})`);
    if (!primero) avisos.push(`Fila ${p.fila}: ${p.nombre} no tiene apellidos; se importa sólo con su nombre.`);
    if (partes > 2) avisos.push(`Fila ${p.fila}: "${p.apellidos}" tiene más de dos apellidos; revisa cómo quedó (${primero} / ${segundo}).`);
    const { numero, raro, extranjero } = celularInternacional(p.celular);
    if (raro) avisos.push(`Fila ${p.fila}: el celular de ${p.nombre} ${p.apellidos} no tiene forma de celular (10 dígitos de México, 11 con 1, u 11–15 con clave de país): no se importa.`);
    if (extranjero) avisos.push(`Fila ${p.fila}: el celular de ${p.nombre} ${p.apellidos} se tomó como de otro país (+${numero.slice(0, 2)}…); revisa que sea correcto.`);
    if (numero) {
      if (celulares.has(numero)) avisos.push(`Fila ${p.fila}: el celular de ${p.nombre} se repite con la fila ${celulares.get(numero)}.`);
      else celulares.set(numero, p.fila);
      if (!celularInvitacion && rol === 'titular') celularInvitacion = numero;
    }
    filasPersona.push(`  (${sql(id)}, ${sql(p.nombre)}, ${sql(primero)}, ${sql(segundo)}, ${sql(numero)})`);
    filasMiembro.push(`  (${sql(id)}, ${sql(idInvitacion)}, ${sql(rol)}, ${k + 1})`);
  });
  const codigo = codigoNuevo();
  totalPersonas += inv.miembros.length;
  bloques.push({
    label: inv.label,
    codigo,
    sql: [
      `-- ${inv.label} · ${codigo.slice(0, 4)}-${codigo.slice(4)} · ${inv.miembros.length} ${inv.miembros.length === 1 ? 'persona' : 'personas'}`,
      `insert into public.invitations (id, code, label, channel, phone) values (${sql(idInvitacion)}, ${sql(codigo)}, ${sql(inv.label)}, 'digital', ${sql(celularInvitacion)});`,
      `insert into public.person (id, name, first_last_name, second_last_name, phone) values\n${filasPersona.join(',\n')};`,
      `insert into public.invitation_members (person_id, invitation_id, role, position) values\n${filasMiembro.join(',\n')};`,
    ].join('\n'),
  });
}

// ─── SQL ────────────────────────────────────────────────────────────────
const texto = `-- Importación de invitados generada por scripts/importar-invitados.mjs el ${new Date().toISOString()}
-- ${bloques.length} invitaciones · ${totalPersonas} personas. Datos privados: no subir al repo.
-- Todo en una transacción: si algo falla, no se guarda nada. Si alguna de estas personas ya existe, se detiene.
begin;

do $$
declare repetidas text;
begin
  select string_agg(p.name || ' ' || coalesce(p.first_last_name, ''), ', ') into repetidas
    from public.person p
    join (values
      ${yaImportadas.join(',\n      ')}
    ) as nuevas(name, first_last_name, second_last_name)
      on p.name = nuevas.name
     and p.first_last_name is not distinct from nuevas.first_last_name
     and p.second_last_name is not distinct from nuevas.second_last_name;
  if repetidas is not null then
    raise exception 'Estas personas ya existen en la base, no se importa nada (¿ya se corrió este archivo?): %', repetidas;
  end if;
end $$;

${bloques.map((b) => b.sql).join('\n\n')}

commit;
`;
mkdirSync(dirname(salida), { recursive: true });
writeFileSync(salida, texto);

// ─── Resumen ────────────────────────────────────────────────────────────
console.log(`Filas leídas: ${filas.length} · sin INVITACION LABEL (no se importan): ${sinLabel}`);
console.log(`Invitaciones: ${bloques.length} · personas: ${totalPersonas} (acompañantes: ${acompanantes.length})`);
if (avisos.length) console.log(`\nAvisos (${avisos.length}):\n- ${avisos.join('\n- ')}`);
if (errores.length) console.log(`\nNo se importan (${errores.length}):\n- ${errores.join('\n- ')}`);
console.log(`\nSQL en ${salida}. Revísalo y córrelo en el SQL Editor de Supabase.`);
