# Invitación web · Boda de Ivan y Emma

Invitación digital para la boda de **Ivan Guerrero Ruiz y Emma Ascencio López** (sábado 20 de febrero de 2027, Guadalajara). La web va de la mano de una invitación impresa, que lleva un QR personalizado por familia hacia esta web.

Este archivo resume todo lo decidido hasta el **10 de noviembre de 2026** en la conversación de diseño (Claude Cowork) y en las sesiones de desarrollo (Claude Code). Léelo completo antes de escribir código.

---

## 1. Reglas que no se rompen

1. **Repositorio personal.** Este proyecto vive en `github.com/IvanGRZ/web_invitation` (cuenta personal de Ivan, por SSH). **Nunca** lo subas, enlaces ni menciones en la organización de GitHub de su empresa. Antes del primer commit verifica la identidad local:
   ```bash
   git config user.name    # debe ser la identidad personal de Ivan
   git config user.email   # debe ser su correo personal, NO @compusoluciones.com
   ```
   Si no están configurados localmente, pregúntale a Ivan qué correo personal usar y configúralo **sólo en este repo** (`git config user.email ...`, sin `--global`). No hagas push sin confirmarlo con él.
2. **No inventes datos del evento.** Lo que no está en la sección 3 se muestra como "Horario por confirmar" o similar. Nunca inventes horas, direcciones, nombres ni fotos.
3. **Nombres:** siempre el novio primero (**Ivan y Emma**, **Ivan & Emma**, monograma **I & E**). **"Ivan" va sin acento** (así está en su acta); no lo "corrijas" a Iván.
4. **El sistema de diseño es la fuente de verdad visual.** Colores, tipografía, radios, sombras y movimiento salen de `design/tokens.css` / `design/tokens.json`. No inventes colores ni tamaños nuevos; si algo falta, se define primero en el sistema de diseño (ver sección 9).
5. **Accesibilidad mínima:** contraste 4.5:1 en texto, `prefers-reduced-motion` respetado en TODA animación, botones y enlaces reales (`<button>`, `<a href>`), objetivos táctiles ≥ 44px.
6. **Mobile first.** Casi todos los invitados abrirán la invitación desde WhatsApp en el celular.

---

## 2. Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Sistema de diseño (vivo, se edita en Cowork) | https://claude.ai/artifact/XvXyzdcW38mfJVPBEeqhuv |
| Lienzo con las exploraciones de portada (la aprobada es **D · Velas + medallón**) | https://claude.ai/artifact/9N3HSZEEEi8vRKz4MpSq8v |
| Copia local del sistema para este repo | `design/` (ver `design/README.md`) |
| Manual de marca completo (voz, color, forma, movimiento, impresión) | `design/sistema-de-diseno.md` |
| Tokens | `design/tokens.json` (fuente) y `design/tokens.css` (variables CSS + `@font-face`) |
| Fuentes (woff2, licencia OFL) | `design/fonts/` |
| Monograma, patrón ikat, ornamentos (SVG) | `design/assets/` |
| **Portada aprobada, HTML de referencia exacta a 390×844** | `design/reference/portada.html` (ábrelo en el navegador) |
| Componentes de referencia del sistema (React sin JSX, global `window.IvanEmma`) | `design/reference/bundle.js`, `bundle.css`, `componentes.d.ts` |

Los links de claude.ai son privados de Ivan. Si no puedes abrirlos, todo lo necesario está copiado en `design/`.

---

## 3. Datos del evento

| Dato | Valor |
|---|---|
| Novios | Ivan Guerrero Ruiz y Emma Ascencio López |
| Fecha | Sábado 20 de febrero de 2027 |
| Ceremonia religiosa | Templo Expiatorio Eucarístico de Guadalajara · Calle M. López Cotilla 935, Col. Americana · **18:00 hrs** |
| Recepción | Mansión Magnolia (antigua mansión) · Calle Francisco I. Madero 636, Col. Centro · a continuación de la ceremonia |
| Código de vestimenta | Etiqueta rigurosa |
| Edad | Evento exclusivo para mayores de 18 años (sin niños) |
| Fecha límite para confirmar | Sábado 23 de enero de 2027 (4 semanas antes) |
| Envío de invitaciones (impresas + enlace) | 7 al 12 de diciembre de 2026 |
| Pases | Cada invitación es para una familia con un número fijo de lugares |
| Zona horaria | America/Mexico_City (UTC-6) |

**Pendientes de Ivan:** hora exacta de la recepción (si se quiere mostrar), fotos de pareja/preboda, dominio, lista de invitados.

---

## 4. Voz y textos

- **Tono formal cercano:** elegante, en primera persona de la pareja ("queremos compartir", "nos hace felices"), tratando de *tú* al invitado.
- "y" escrito: "Ivan y Emma". El "&" sólo en monograma, portada y titulares.
- Fechas con día y en minúsculas: "sábado 20 de febrero de 2027". Horas: "19:00 hrs".
- Menos texto es más: la portada NO lleva antetítulos ("Nos casamos" se quitó a propósito).
- Sin emojis, sin humor, sin signos de admiración dobles.

Ejemplos aprobados:
> Con la bendición de Dios y la alegría de nuestras familias, queremos compartir contigo el día en que uniremos nuestras vidas.
> Te pedimos confirmar a más tardar el 23 de enero de 2027.
> Recibimos tu confirmación. Nos hace muy felices compartir este día contigo.

---

## 5. Dirección visual (resumen; el detalle está en `design/sistema-de-diseno.md`)

**Origen:** la decoración de la mesa del banquete. Mantel de lino beige, servilleta índigo con flores estilo ikat, copa de cristal palo de rosa, servilletero dorado, flores blancas con follaje, sillas de respaldo ovalado Luis XVI, piso de mármol en damero y luz de velas.

**Carácter:** elegante, moderno y fluido. Ivan rechazó explícitamente lo "cuadrado / antiguo / PowerPoint". Quiere **curvas, transparencias (vidrio) y animaciones**.

### Paleta (tokens principales)

| Token | Marfil | Noche | Uso |
|---|---|---|---|
| `paper` | #f7f2e8 | #141c2b | Fondo |
| `paper-deep` | #ece4d4 | #0f1522 | Extremo del degradado de la portada |
| `ink` | #1f2d44 | #f3ecdf | Texto |
| `ink-muted` | #5a6276 | #b8b3a8 | Texto secundario |
| `indigo` | #2f4a78 | #9fb4da | El azul de la servilleta, enlaces |
| `gold` | #9a7a45 | #c9a86e | Monograma, anillo de perlas, "&" |
| `gold-deep` | #725829 | #e8cf9c | Oro como texto (cifras de la cuenta regresiva) |
| `rose` | #b98485 | #d4a3a6 | Acento puntual (la copa) |
| `cta` / `cta-end` / `on-cta` | índigo / índigo / marfil | #f7f2e8 → #e9dcc4 / #141c2b | Botón principal |
| `glass` / `glass-border` | rgba(253,250,244,.6) / rgba(31,45,68,.1) | rgba(247,242,232,.07) / rgba(247,242,232,.16) | Vidrio esmerilado |
| `glow`, `halo`, `candle` | — | — | Luz de vela, halo índigo, destellos (decorativos) |

- **Noche** = portada y momentos emotivos (confirmación enviada). **Marfil** = secciones de información. La portada llena **toda la pantalla** en noche, sin arco inferior; la transición hacia marfil se define con el siguiente mockup.

### Tipografía
- **Cormorant Garamond** (serif): nombres a peso 300, "&" en cursiva dorada, fecha en cursiva, títulos y texto (cuerpo 20px/500 en pantalla, nunca < 17px).
- **Jost** (sans): etiquetas, botones, unidades, en mayúsculas espaciadas.
- **Pinyon Script**: sólo 2–3 palabras de adorno (p. ej. "gracias" tras confirmar).
- El "&" cursivo de Cormorant es una ligadura de "Et"; es intencional.

### Forma
- Botones y chips: píldora (`--radius-pill`). Tarjetas de vidrio: `--radius-lg` (24px). Paneles/hojas: `--radius-xl` (36px). Campos: `--radius-md` (14px). Medallón y retratos: óvalo.
- Vidrio: `background: var(--glass); border: 1px solid var(--glass-border); backdrop-filter: blur(var(--blur-glass));` siempre sobre algo que se vea detrás.

### Movimiento
- Entradas: 1–1.4 s con `cubic-bezier(.2,.7,.2,1)`, desplazamientos de 14–28px. Trazos que se dibujan: `cubic-bezier(.65,0,.35,1)`.
- Ambiente en bucle lento: luz que respira (7 s), destellos (9–14 s), ikat que se desliza (60 s), anillo de perlas (30 s por vuelta).
- Al hacer scroll: cada bloque aparece una vez (fade + 16px hacia arriba) con IntersectionObserver.
- Hover/tap en píldoras: sube 2px + `--shadow-glow`.
- `prefers-reduced-motion: reduce` → todo visible y quieto. Obligatorio.

---

## 6. Portada aprobada (propuesta D · Velas + medallón)

Referencia exacta: `design/reference/portada.html`. Medidas a 390×844:

| Elemento | Especificación |
|---|---|
| Fondo | Degradado radial índigo (#1f2d44 → #141c2b → #0f1522), resplandor dorado de vela arriba que respira, halo índigo abajo-izquierda, 5 destellos flotantes, ikat marfil al 5 % deslizándose |
| Medallón | Óvalo de vidrio 240×314 px a 68px del borde superior; anillo de perlas doradas (punto de 3px cada 9px) que gira; dentro, el monograma I & E (150×187) en `gold` que **se dibuja trazo a trazo** |
| Nombres | "Ivan" alineado a la izquierda y "& Emma" a la derecha (desfasados), Cormorant 300 a 66px, margen lateral 40px; entran deslizándose cada uno desde su lado |
| Fecha | "Sábado 20 de febrero de 2027", cursiva 20px, centrada |
| Cuenta regresiva | Tarjeta de vidrio, margen lateral 44px; días : horas : min : seg en vivo, cifras 32px en `gold-deep`, ":" que parpadean |
| Botón | "Confirmar asistencia", píldora marfil con degradado, 52px de alto, margen lateral 44px |
| Cierre | Sólo el gesto de desplazamiento (`ScrollCue`): línea dorada de 32px por la que cae una estela de luz hacia una flecha de 30px que rebota, a 12px del borde inferior. **Sin arco marfil**: el fondo noche ocupa toda la pantalla |

Secuencia (~4 s): medallón 0.1 s → monograma se dibuja 0.4–2.6 s → letras se enfocan 1.3 s → anillo 1.6 s → "Ivan" 2.2 s / "& Emma" 2.45 s → fecha 2.8 s → cuenta regresiva 3.05 s → botón 3.3 s → gesto de desplazamiento 3.6 s (bucle de 2.4 s).

**Responsivo:** en la web real el medallón NO es fijo: escálalo con la altura de pantalla (p. ej. `width: min(240px, 29svh)`) para que en teléfonos cortos (iPhone SE) el botón de confirmar quede visible sin hacer scroll. En escritorio, la portada se centra como una columna con el fondo noche a pantalla completa.

---

## 7. Stack y arquitectura

**Decidido:** Astro 7 + islas de React 19 + Supabase, desplegado en Netlify (adaptador `@astrojs/netlify`, funciones serverless, sin Edge middleware). Node 26 (`.nvmrc`). (Ivan conoce Next.js, no Astro: explica las decisiones de Astro cuando no sean obvias.)

**Lenguaje: JavaScript, no TypeScript.** Archivos `.js` / `.jsx` / `.astro` con JS en el frontmatter; nunca sintaxis de TS (`interface`, anotaciones de tipo, `as`). `tsconfig.json` usa `astro/tsconfigs/base` con `checkJs: true` para que el editor avise errores con tipos inferidos (excluye `design/`). JSDoc sólo en las props de `components/ui/`. La seguridad de los datos la da **zod** en las fronteras (formularios, endpoints, variables de entorno). Alias `@/` → `src/`.

**Renderizado:** `output: 'static'` (por defecto). Sólo las rutas que lo necesitan llevan `export const prerender = false`.

### Rutas
| Ruta | Qué muestra |
|---|---|
| `/` | Invitación general: portada + secciones (detalles, itinerario, vestimenta, galería). Sin formulario de confirmación nominal. |
| `/i/[codigo]` | Invitación personalizada de una familia: la misma invitación + `PassBadge` ("Familia X · Válido para N personas") + `RsvpForm`. Renderizado bajo demanda (SSR); el resto, estático. |

El QR impreso de cada familia apunta a `https://<dominio>/i/<codigo>`.

`/i/[codigo]`: valida el formato del código con zod antes de consultar; si no existe → `return Astro.rewrite('/404')`; headers `Cache-Control: private, no-store` y `X-Robots-Tag: noindex` (nunca en caché de CDN ni indexada; no usar `cacheOnDemandPages`). Página completa bajo demanda, **no** server islands (el código va en la ruta, el pase no debe parpadear y el formulario sin JS necesita página bajo demanda).

### Estructura
```
src/
├─ actions/index.js          # entrada: operaciones que llama NUESTRA UI (RSVP)
├─ assets/{fonts,images}/    # fuentes (copias exactas de design/fonts) y futuras fotos (<Picture>)
├─ components/
│  ├─ ui/                    # primitivos del sistema: Button, GlassCard, Field, Heading, Ornament, Monogram, Icon
│  └─ patterns/              # compuestos: Medallion, Countdown, ScrollCue, CandleBackdrop, EventCard, PassBadge, RsvpForm
├─ sections/                 # bloques de página: Portada, Detalles, Itinerario, Vestimenta, Galeria, Confirmacion
├─ config/evento.js          # datos del evento, validados con zod al cargar
├─ layouts/BaseLayout.astro  # <head>, meta OG/WhatsApp, theme-color, precarga de fuente, estilos globales
├─ lib/                      # utilidades puras compartidas cliente/servidor (fechas es-MX, cuenta regresiva)
├─ server/
│  ├─ services/              # casos de uso (p. ej. confirmarAsistencia): no saben de HTTP ni de SQL
│  ├─ domain/                # reglas de negocio puras + errores de dominio: sin I/O
│  ├─ repositories/          # única capa que conoce las tablas de Supabase
│  └─ db/supabase.js         # cliente con la service key (astro:env/server)
├─ middleware.js             # transversal (auth de endpoints, logging); se crea cuando haga falta
├─ pages/                    # index.astro · i/[codigo].astro · 404.astro · _catalogo.astro (sólo dev) · api/ (cuando haya consumidor)
└─ styles/                   # fonts.css · tokens.css (copias de design/) · global.css · ui/*.css
supabase/migrations/         # esquema versionado (sin datos)
scripts/                     # generación de códigos/QR desde un CSV local ignorado
netlify.toml                 # headers de seguridad
```

### Capas de UI: `ui ← patterns ← sections ← pages`
Ninguna capa importa de una superior.
- **`ui/`** no sabe nada de la boda: sólo props y tokens.
- **`patterns/`** se arman con `ui/`, reciben datos por props y **nunca** importan `config/` ni `server/`.
- **`sections/`** son las únicas que leen `config/evento.js` y pasan datos hacia abajo.
- **`pages/`** son delgadas: obtienen datos y ordenan secciones. `sections/` evita duplicar la invitación entre `/` y `/i/[codigo]`.

**Primitivos compartidos Astro/React:** un `.astro` no se puede usar dentro de una isla. El estilo de cada primitivo vive **una sola vez** en `styles/ui/*.css` (clases construidas sólo con tokens, p. ej. `.btn`, `.btn--primary`) y hay dos capas delgadas con la misma API de props (`Button.astro` / `Button.jsx`). Sólo tienen versión `.jsx` los que se usan dentro de islas (hoy `Button`, `Field`, `GlassCard`).

**Convenciones:** variantes como uniones de valores (`variant: 'primary' | 'secondary' | 'link'`, contrato en `design/reference/componentes.d.ts`); pasar atributos nativos con `...rest` + `class:list`; composición con slots; `Heading` con `as="h1|h2|h3"`; sólo `var(--token)`; cada componente que anima resuelve su `prefers-reduced-motion`; PascalCase, un componente por archivo, pruebas junto al componente. Los datos pendientes se modelan como opcionales y el componente muestra "Horario por confirmar".

Los componentes de `design/reference/bundle.js` son la referencia de comportamiento y markup; **reescríbelos** como componentes `.astro`/`.jsx` limpios (no copies el bundle tal cual).

### Islas de React
- `Countdown` → `client:visible` (renderiza un marcador estable en servidor para evitar *hydration mismatch*).
- `RsvpForm` → `client:load`.
- **`Medallion` es `.astro` con SVG inline y CSS, sin React**: trazo con `stroke-dashoffset`, anillo y secuencia son animaciones declarativas; así no se descarga React para lo primero que se ve.
- `ScrollCue`, `CandleBackdrop` y todo lo demás: `.astro` estáticos.

### Capas de lógica
`Action / Endpoint (transporte) → Servicio (caso de uso) → Dominio (reglas puras) + Repositorio → Supabase`
- **Action / Endpoint:** valida entrada con zod, llama al servicio, traduce errores de dominio a `ActionError` o a status HTTP. Sin lógica de negocio.
- **Servicio:** orquesta (busca invitado, aplica reglas, guarda). Recibe `ahora` inyectable para probar la fecha límite.
- **Dominio:** reglas puras (lugares, fecha límite, consistencia), testeables sin mocks.
- **Repositorio:** consultas y mapeo de filas.
- **Action** cuando la operación la dispara nuestra UI (type-safe, funciona sin JS, CSRF por `checkOrigin`). **Endpoint** en `pages/api/` cuando lo consume alguien más o se necesita control del protocolo (CSV, health check, webhook); los que exponen datos se protegen con token en el middleware.

### RSVP
- `defineAction({ accept: 'form', input: z.object(...) })`; `z` se importa de `astro/zod` (zod 4).
- Funciona sin JS: `<form method="POST" action={actions.rsvp}>` real + `withState()` de `@astrojs/react/actions` con `useActionState()`; sin JS la página lee `Astro.getActionResult()`.
- Los actions son endpoints públicos (`/_actions/rsvp`): el handler revalida todo.
- Guardado idempotente (`upsert` por `guest_id`): reenviar deja la última respuesta. Por eso no hay Post/Redirect/Get con sesiones y se configura `session: false`.

### Datos (propuesta inicial, confirmar con Ivan)
```sql
-- invitados: una fila por familia/invitación
create table guests (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,      -- aleatorio, 8 caracteres de un alfabeto de 31 sin ambiguos (sin 0/O, 1/l/I), NO secuencial ni adivinable
  family_name text not null,      -- "Familia Guerrero Ruiz"
  seats int not null check (seats > 0),
  created_at timestamptz default now()
);
-- confirmaciones: la última respuesta de cada familia
create table rsvps (
  guest_id uuid primary key references guests(id) on delete cascade,
  attending boolean not null,
  guests_count int not null default 0,
  message text,
  responded_at timestamptz default now()
);
```
- Lectura y escritura **sólo desde el servidor** (Astro Actions / endpoints con la service key en variables de entorno de Netlify). RLS activado sin políticas públicas: el navegador nunca habla directo con Supabase.
- Variables con `astro:env` (`envField` en `astro.config.mjs`): `SUPABASE_URL` (server) y `SUPABASE_SERVICE_ROLE_KEY` (server, **secret**), con `validateSecrets: true`.
- Validar en servidor: el código existe, `guests_count <= seats`, si no asisten el conteo es 0, fecha límite (`2027-01-23T23:59:59-06:00`; México no tiene horario de verano, el offset fijo es correcto), longitud máxima del mensaje.
- Migraciones en `supabase/migrations/` (el esquema puede ser público). **Los datos de invitados nunca entran al repo.**
- Ivan puede ver/exportar confirmaciones desde el editor de tablas de Supabase; un `/admin` es opcional.

### Seguridad
- `security.checkOrigin` (activo por defecto) se mantiene.
- `security.csp` (hashes) + `staticHeaders: true` en el adaptador de Netlify para que las páginas estáticas también lo reciban como header. Incompatible con `<ClientRouter />`, que no se usa.
- `netlify.toml`: HSTS, `X-Content-Type-Options`, `Permissions-Policy` y `Referrer-Policy: strict-origin-when-cross-origin` (los enlaces a mapas desde `/i/[codigo]` no deben filtrar el código en el `Referer`).

### Fuentes y assets
- **`design/` es privado y está ignorado en git** (el repo es público). Netlify construye desde el repo, así que la web nunca depende de `design/`: usa copias versionadas en `src/` y `public/`.
- Fuentes: los 9 woff2 de `design/tokens.css` (y sus licencias OFL) copiados **tal cual** a `src/assets/fonts/`; `src/styles/fonts.css` repite sus `@font-face` cambiando sólo las rutas. Deben coincidir byte a byte con `design/fonts/` (verificado con `cmp`), por eso **no** se usan `@fontsource/*` ni la Fonts API de Astro. Precarga manual de Cormorant 300 (nombres) en `BaseLayout` con `?url`.
- `src/styles/tokens.css`: las variables de `design/tokens.css` sin cambios. Si cambian en Cowork, se recopian.
- Copia lo que la web necesite de `design/assets/` a `public/` (p. ej. `ikat-textura-marfil.svg`). El monograma animado va como SVG inline en `Medallion.astro` (ver `design/reference/bundle.js` y `design/reference/portada.html`).

### Calidad y pruebas
- Vitest (`getViteConfig`) para dominio y utilidades; Playwright + axe contra el preview para el flujo QR → `/i/[codigo]` → confirmación. No usar la Container API (experimental).
- Catálogo `/_catalogo` sólo en desarrollo (404 en producción) con cada primitivo y patrón en marfil y noche.
- Ni `astro dev` ni `astro build` revisan tipos; `astro check` requiere `@astrojs/check` + `typescript` (instalar sólo con autorización de Ivan).

### Particularidades de Astro 7
- `compressHTML` es `'jsx'` por defecto: puede quitar espacios entre elementos en línea (vigilar "Ivan" / "& Emma" y la fecha; si falla, `true`).
- El compilador en Rust falla con HTML mal anidado en vez de corregirlo.
- `src/fetch.ts` está reservado por el enrutamiento avanzado (opción `fetchFile`): no usar ese nombre (tampoco `fetch.js`).
- Fuera de alcance: `<ClientRouter />`, Edge middleware, `cacheOnDemandPages`.

---

## 8. Plan y calendario

| Cuándo | Diseño (Cowork) | Desarrollo (aquí) |
|---|---|---|
| Semana del 16 oct | Sistema de diseño actualizado ✅ | Crear proyecto Astro, tokens, fuentes, **portada** fiel a la referencia; primer deploy en Netlify |
| Finales de octubre | Mockups: detalles del evento y confirmación | Supabase (tablas, Actions), `/i/[codigo]`, `RsvpForm` funcionando |
| Inicios de noviembre | Diseño de la invitación impresa | Construir secciones conforme se aprueban; **comprar dominio** |
| Mediados de noviembre | Cerrar impresa con el QR real | Prueba de punta a punta: QR → `/i/[codigo]` → confirmación guardada |
| Finales de noviembre | Imprenta | Cargar invitados, horarios, fotos; pruebas con familia |
| 7–12 diciembre 2026 | — | Envío de invitaciones y enlace |

**Hecho (10 nov):** proyecto Astro creado (JavaScript con `checkJs`, React y adaptador de Netlify), fuentes y tokens copiados a `src/` (ver sección 7).

**Siguiente paso:** crear la base de la arquitectura (carpetas, `BaseLayout`, `global.css`, `config/evento.js` con su esquema) y después construir la portada de `/` idéntica a `design/reference/portada.html`, con el ajuste responsivo de la sección 6.

---

## 9. Cómo trabajamos (Cowork ↔ Code)

- **Cowork (claude.ai, celular/escritorio):** diseño. Mockups, sistema de diseño, invitación impresa. Cada sección se aprueba ahí primero.
- **Claude Code (esta carpeta, PC):** desarrollo. Construye lo aprobado.
- Cuando cambie algo visual: se actualiza primero el **sistema de diseño** en Cowork; después se actualizan `design/` y este `CLAUDE.md` en el repo. Ivan pidió explícitamente mantener el sistema de diseño siempre al día: **no se debe perder nada**.
- Si durante el desarrollo surge una decisión visual nueva (un componente o un color que no existe), anótala en la sección 10 para llevarla a Cowork; no la inventes en silencio.

---

## 10. Bitácora de decisiones y notas para Cowork

- 2026-10-15: Paleta tomada de la mesa (lino, índigo ikat, palo de rosa, oro, follaje). Estilo clásico elegante + invernal.
- 2026-10-15: Stack Astro + React + Supabase + Netlify; repo personal.
- 2026-10-16: Ivan rechaza lo cuadrado; nuevo lenguaje de curvas, vidrio, luz y movimiento.
- 2026-10-16: De tres exploraciones (A luz de velas, B arco, C ikat vivo) se aprueba **D**: fondo y entrada de A, nombres desfasados de B, medallón y cuenta regresiva de C. Sin "Nos casamos". Medallón ajustado a 240×314.
- 2026-10-16: Sistema de diseño actualizado (tokens de vidrio/luz, radios curvos, componentes `CandleBackdrop` y `Medallion`, página de referencia de la portada).
- 2026-10-16: Portada sin el arco marfil inferior: ocupa toda la pantalla y cierra sólo con el gesto de desplazamiento (estela dorada + flecha, componente `ScrollCue`). Elementos redistribuidos (medallón a 68px).
- 2026-11-02: Invitación impresa: se elige la propuesta 1 (clásica marfil) y se rediseña el frente al estilo de papelería tradicional: nombres completos en Pinyon Script (novia primero), texto en Cormorant SC, una sola tinta, fecha y hora en palabras. Ceremonia 18:00 hrs; direcciones de iglesia y Mansión Magnolia confirmadas.
- 2026-11-02: Invitación impresa aprobada (Clásica marfil). Frente: nombres en Pinyon Script engrosada con "&" dorado, voz en Cormorant cursiva gris (`ink-muted`) con "C" inicial caligráfica, datos en versalitas, dos filetes dorados. Reverso nuevo por familia: dedicatoria, "Familia [Apellido]", "Válido para N personas", etiqueta rigurosa, frase de niños elegida por Ivan, sólo mayores de 18, QR 2 × 2 cm con esquinas doradas, confirmar antes del 23 de enero de 2027. Detalle en `design/sistema-de-diseno.md` § Impresión. Sobre pendiente.
- 2026-11-02: Frente impreso ajustado para respirar más: voz a 18px (después también en el reverso, para que las dos caras coincidan), fecha en palabras con interlineado más justo y filetes dorados pegados a ella. Se probó la fecha en números ("20 de Febrero de 2027 a las 6:00 PM") y se descartó: el frente va en palabras y el reverso en números.
- 2026-11-10: Proyecto creado con Astro 7.4, React 19 y adaptador de Netlify; Node 26. `design/` queda fuera del repo (ignorado) porque el repo es público; la web usa copias en `src/`. Fuentes copiadas tal cual desde `design/fonts/` (idénticas byte a byte, verificado) en lugar de `@fontsource` o la Fonts API; tokens copiados sin cambios a `src/styles/tokens.css`.
- 2026-11-10: Arquitectura aprobada (detalle en la sección 7): JavaScript con `checkJs` en lugar de TypeScript; capas de UI `ui ← patterns ← sections ← pages` con primitivos de estilo compartido Astro/React; capas de lógica action/endpoint → servicio → dominio + repositorio; **`Medallion` como `.astro` con CSS/SVG, sin React** (antes `client:load`); RSVP idempotente sin sesiones (`session: false`); códigos de 8 caracteres sin ambiguos; CSP + headers de seguridad; `/i/[codigo]` con `no-store` y `noindex`. Sin impacto visual: nada que llevar a Cowork.
- 2026-11-10: **Para Cowork: valores de la portada que no existen como token.** Ivan decidió usar los valores exactos de `design/reference/portada.html` como variables locales de `src/sections/Portada.astro` (los componentes usan tokens por defecto y la portada los ajusta). Falta crear o alinear en el sistema de diseño: inicio del degradado noche `#1f2d44` (el sistema usa `--linen` `#232e44`); borde del vidrio del medallón `rgba(247,242,232,.20)` e inset de 12px (sistema: `--glass-border` .16, inset 5%); vidrio de la tarjeta de la cuenta regresiva `rgba(247,242,232,.06)`, borde `.14`, desenfoque `18px` (sistema: `--glass` .07, `--glass-border` .16, `--blur-glass` 16px); color de los nombres `#f7f2e8` (sistema: `--ink` noche `#f3ecdf`); sombra de los nombres `0 2px 24px rgba(15,21,34,.6)`; parada intermedia del resplandor `rgba(201,168,110,.12)` al 38%. También: la cuenta regresiva de la referencia apunta a las 00:00 del 20 de febrero; la web usa la hora de la ceremonia (18:00), confirmada por Ivan.
