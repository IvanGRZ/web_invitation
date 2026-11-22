# Invitación web · Boda de Ivan y Emma

Invitación digital para la boda de **Ivan Guerrero Ruiz y Emma Ascencio López** (sábado 20 de febrero de 2027, Guadalajara). La web va de la mano de una invitación impresa, que lleva un QR personalizado por familia hacia esta web.

Este archivo resume todo lo decidido hasta el **19 de noviembre de 2026** en la conversación de diseño (Claude Cowork) y en las sesiones de desarrollo (Claude Code). Léelo completo antes de escribir código.

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
| Sistema de diseño (vivo, se edita en Cowork) | https://claude.ai/artifact/9R5B4A8DqZygmuGPDz8BVd |
| Lienzo con las exploraciones de portada (la aprobada es **D · Velas + medallón**) | https://claude.ai/artifact/EidWWMeT1B8Uw3KCSAnnSW |
| Copia local del sistema para este repo | `design/` (ver `design/README.md`) |
| Manual de marca completo (voz, color, forma, movimiento, impresión) | `design/sistema-de-diseno.md` |
| Tokens | `design/tokens.json` (fuente) y `design/tokens.css` (variables CSS + `@font-face`) |
| Fuentes (woff2, licencia OFL) | `design/fonts/` |
| Monograma, patrón ikat, ornamentos (SVG) | `design/assets/` |
| **Portada aprobada, HTML de referencia exacta a 390×844** | `design/reference/portada.html` (ábrelo en el navegador) |
| **Bienvenida aprobada, HTML de referencia exacta con su animación: celular 390×844 y computadora 1440×900** | `design/reference/bienvenida.html` y `design/reference/bienvenida-computadora.html` |
| **Ceremonia y recepción aprobada, HTML de referencia exacta a 390×1056 (con la interacción de "Cómo llegar")** | `design/reference/ceremonia.html` (ábrelo en el navegador) |
| **Itinerario de la fiesta aprobado, HTML de referencia con su animación: celular 390×670 y computadora 1440×900** | `design/reference/itinerario.html` y `design/reference/itinerario-computadora.html` |
| **Código de vestimenta aprobado, HTML de referencia a 390×740** | `design/reference/vestimenta.html` |
| **Galería aprobada (Un paso a la vez), HTML de referencia con la navegación por años: celular 390×1042 y computadora 1440×900** | `design/reference/galeria.html` y `design/reference/galeria-computadora.html` (usan `design/assets/fotos/toledo-propuesta.jpg`) |
| **Cierre aprobado (El sello), HTML de referencia con la animación a 390×844** | `design/reference/cierre.html` (usa `design/assets/invitacion-frente.jpg`, el frente impreso digitalizado) |
| **Confirmación aprobada (una pregunta por pantalla), HTML de referencia funcionando: celular y computadora 1440×900; aceptan `?lugares=1…6`** | `design/reference/confirmacion.html` y `design/reference/confirmacion-computadora.html` |
| **Estados de la confirmación** (candado, código inválido, error al guardar, regreso, cerrada), celular y computadora | `design/reference/confirmacion-estados.html` |
| **Versiones de computadora 1440×900** de portada, ceremonia y recepción, código de vestimenta y cierre | `design/reference/portada-computadora.html`, `ceremonia-computadora.html`, `vestimenta-computadora.html`, `cierre-computadora.html` |
| **Código inexistente (404)**, celular y computadora | `design/reference/404.html` |
| **Galería de la boda aprobada** (subir fotos y sus estados, historias funcionando, antes de las 18:00), celular y computadora | `design/reference/galeria-boda.html`, `galeria-boda-computadora.html`, `galeria-boda-historias.html`, `galeria-boda-historias-computadora.html`, `galeria-boda-antes.html`, `galeria-boda-antes-computadora.html` |
| **Imagen de la vista previa de WhatsApp** (`og:image`, 1200×630) | `design/assets/vista-previa-whatsapp.jpg` (y `design/reference/vista-previa-whatsapp.html`) |
| Componentes de referencia del sistema (React sin JSX, global `window.IvanEmma`) | `design/reference/bundle.js`, `bundle.css`, `componentes.d.ts` |

Los links de claude.ai son de la cuenta nueva de Ivan (migrados el 22 nov 2026; los de la cuenta anterior ya no se usan). Para construir no los necesitas: todo lo necesario está copiado en `design/`. El respaldo completo del lienzo, del sistema de diseño y de los generadores está en `design/respaldo-cowork.zip` (ver su `LEEME.md`).

---

## 3. Datos del evento

| Dato | Valor |
|---|---|
| Novios | Ivan Guerrero Ruiz y Emma Ascencio López |
| Fecha | Sábado 20 de febrero de 2027 |
| Ceremonia religiosa | Templo Expiatorio Eucarístico de Guadalajara · Calle M. López Cotilla 935, Col. Americana · **18:00 hrs** |
| Recepción | Mansión Magnolia (antigua mansión) · Calle Francisco I. Madero 636, Col. Centro · **19:30 hrs** |
| Código de vestimenta | Etiqueta rigurosa |
| Edad | Evento exclusivo para mayores de 18 años (sin niños) |
| Itinerario de la fiesta | 19:30 Cóctel de bienvenida · 21:20 Entrada de los novios · 21:30 Banquete · 22:30 El vals · 22:55 Abrimos la pista · 02:00 Fin de la fiesta (sólo horas de inicio; confirmado por Ivan) |
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

- **El recorrido sigue el día de la boda:** portada de noche → bienvenida y ceremonia en marfil (la tarde) → en el itinerario anochece → código de vestimenta, galería y mesa de regalos **de noche**, sin regresar al marfil → cierre de noche con el botón "Confirmar asistencia". La portada llena **toda la pantalla** en noche, sin arco inferior; la transición hacia marfil la hace la ola de la bienvenida (sección 6.1).
- **La confirmación es una pantalla aparte, de día (marfil), que la noche nunca toca.** Se llega por el botón de la portada o por el del cierre; ambos abren la misma pantalla. Al tocar el botón desde la noche, una luz marfil se abre desde el botón y llena la pantalla. Lleva "Volver a la invitación". **No necesita parecerse en nada a la invitación impresa:** es una pantalla de la web y se arma con los componentes del sistema (`SectionHeading`, `PassBadge`, `RsvpForm`, `Button`). Diseño aprobado: sección 6.7.

### Tipografía
- **Cormorant Garamond** (serif): nombres a peso 300, "&" en cursiva dorada, fecha en cursiva, títulos y texto (cuerpo 20px/500 en pantalla, nunca < 17px).
- **Jost** (sans): etiquetas, botones, unidades, en mayúsculas espaciadas.
- **Pinyon Script**: sólo 2–3 palabras de adorno (p. ej. "gracias" tras confirmar).
- El "&" cursivo de Cormorant es una ligadura de "Et"; es intencional.

### Forma
- Botones: radio de 12px (`--radius-button`), todos por igual. Chips: píldora (`--radius-pill`). Tarjetas y placas de vidrio: `--radius-lg` (24px). Paneles/hojas: `--radius-xl` (36px). Campos: `--radius-md` (14px). Medallón y retratos: óvalo.
- Vidrio: `background: var(--glass); border: 1px solid var(--glass-border); backdrop-filter: blur(var(--blur-glass));` siempre sobre algo que se vea detrás.

### Movimiento
- Entradas: 1–1.4 s con `cubic-bezier(.2,.7,.2,1)`, desplazamientos de 14–28px. Trazos que se dibujan: `cubic-bezier(.65,0,.35,1)`.
- Ambiente en bucle lento: luz que respira (7 s), destellos (9–14 s), ikat que se desliza (60 s), anillo de perlas (30 s por vuelta).
- Al hacer scroll: cada bloque aparece una vez (fade + 16px hacia arriba) con IntersectionObserver.
- Hover/tap en botones: sube 2px + `--shadow-glow`.
- `prefers-reduced-motion: reduce` → todo visible y quieto. Obligatorio.

---

## 6. Pantallas

Especificación completa de cada pantalla aprobada en **`docs/pantallas.md`** (lee sólo la sección de la que vas a construir). Medidas exactas en su tablero del lienzo y en `design/sistema-de-diseno.md`.

| Pantalla | Sección en docs/pantallas.md | Tableros del lienzo | Estado |
|---|---|---|---|
| Portada | § 6 | `Velas`, `PortadaEscritorio` | **Construida** (`src/screens/portada/`) |
| Bienvenida | § 6.1 | `BienvenidaPostal`, `BienvenidaD` | **Construida** (`src/screens/bienvenida/`) |
| Ceremonia y recepción | § 6.2 | `CeremoniaC`, `CeremoniaEscritorio` | **Construida** (`src/screens/ceremonia/`) |
| Itinerario de la fiesta | § 6.3 | `ItinerarioD`, `ItinerarioEscritorio` | **Construida** (`src/screens/itinerario/`) |
| Código de vestimenta | § 6.4 | `VestimentaGala`, `VestimentaEscritorio` | **Construida** (`src/screens/vestimenta/`) |
| Galería (Un paso a la vez) | § 6.5 | `HistoriaPeliculaOro`, `HistoriaEscritorio` | **Construida** (`src/screens/galeria/`; faltan 11 de las 12 fotos) |
| Cierre (El sello) | § 6.6 | `CierreSello`, `CierreEscritorio` | **Construida** (`src/screens/cierre/`; el sello lleva a `/confirmar`) |
| Confirmación y sus estados | § 6.7 | `ConfirmacionD2`, `ConfirmacionEscritorio`, `ConfEstado-*` | **Construida la pantalla** (`src/screens/confirmacion/`, `/confirmar`; muestras en `/prueba/<estado>/confirmar` sólo en dev); falta el backend (Action, Supabase, `/i/[codigo]`) |
| 404 y vista previa de WhatsApp | § 6.8 | `General404*`, `VistaPreviaWhatsApp` | **Construida** (`src/screens/no-encontrada/`, `pages/404.astro` con la dirección fija; `og:*` en `BaseLayout`, `site` = `URL` de Netlify); falta el `Astro.rewrite('/404')` de `/i/[codigo]` y el `og:title` por familia, con el backend |
| Galería de la boda | § 6.9 | `GaleriaBoda-*` | **Construida la pantalla** (`src/screens/galeria-boda/`: subir, sus mensajes, el rollo antes/cerrada e historias; `/galeria-de-la-boda` y `/galeria-de-la-boda/historias`, bajo demanda; muestras en `/prueba/<estado>/galeria-de-la-boda` sólo en dev); falta el backend (Supabase Storage, `/i/[codigo]/galeria-de-la-boda`) |

Reglas que aplican a todas: la portada **no se personaliza** (el pase sólo aparece en la confirmación); la confirmación es una pantalla aparte en marfil; el recorrido va de noche (portada) → marfil (bienvenida, ceremonia) → anochece (itinerario) → noche hasta el cierre.


## 7. Stack y arquitectura

**Decidido:** Astro 7 + islas de React 19 + Supabase, desplegado en Netlify (adaptador `@astrojs/netlify`, funciones serverless, sin Edge middleware). Node 26 (`.nvmrc`). (Ivan conoce Next.js, no Astro: explica las decisiones de Astro cuando no sean obvias.)

**Lenguaje: JavaScript, no TypeScript.** Archivos `.js` / `.jsx` / `.astro` con JS en el frontmatter; nunca sintaxis de TS (`interface`, anotaciones de tipo, `as`). `tsconfig.json` usa `astro/tsconfigs/base` con `checkJs: true` para que el editor avise errores con tipos inferidos (excluye `design/`). JSDoc sólo en las props de `components/ui/`. La seguridad de los datos la da **zod** en las fronteras (formularios, endpoints, variables de entorno). Alias `@/` → `src/`.

**Renderizado:** `output: 'static'` (por defecto). Sólo las rutas que lo necesitan llevan `export const prerender = false`.

### Rutas
| Ruta | Qué muestra |
|---|---|
| `/` | Invitación general, en este orden (estructura acordada con Ivan): portada · bienvenida · ceremonia y recepción (con "Cómo llegar" y "Agregar al calendario") · itinerario de la fiesta · código de vestimenta y sólo adultos · galería (Un paso a la vez, con el botón a la galería de la boda) · mesa de regalos (si la hay) · cierre de noche con el botón "Confirmar asistencia" (si no hay mesa de regalos, el cierre va después de la galería). **La confirmación no es una sección de este recorrido**: es una pantalla aparte en marfil (ver sección 5); en `/` (sin código) esa pantalla pide **el código de la invitación** (el candado; ver § Invitaciones impresas y digitales) y con él lleva a la invitación personalizada. No habrá hospedaje, preguntas frecuentes, padrinos ni "pide una canción" (Ivan, 20 nov). |
| `/i/[codigo]` | Invitación personalizada de una familia: la misma invitación, **sin personalizar la portada** (Ivan, 19 nov); el pase ("Familia X · Válido para N personas") aparece sólo en la confirmación. El `RsvpForm` (quién asiste y un mensaje opcional) y la pantalla de gracias viven en la **pantalla de confirmación aparte** (marfil), a la que llevan el botón de la portada y el del cierre (se puede cambiar la respuesta hasta la fecha límite). Cómo implementarla (sub-ruta bajo demanda tipo `/i/[codigo]/confirmar` u otra opción) lo decide Claude Code; debe seguir funcionando sin JS. Renderizado bajo demanda (SSR); el resto, estático. |
| `/galeria-de-la-boda` (y `/historias`) | Galería de la boda (§ 6.9), pantallas aparte de noche: subir fotos o, según la hora (`evento.galeriaBoda`), el rollo sin revelar / completo; y las historias. **Bajo demanda** (`prerender = false`, `private, no-store`): el estado depende de la hora de la visita. Las historias sin fotos llevan a subir. La personalizada (`/i/<codigo>/galeria-de-la-boda`) llega con el backend. |

El QR impreso de cada familia apunta a `https://<dominio>/i/<codigo>`.

`/i/[codigo]`: valida el formato del código con zod antes de consultar; si no existe → `return Astro.rewrite('/404')` (diseño en la sección 6.8); headers `Cache-Control: private, no-store` y `X-Robots-Tag: noindex` (nunca en caché de CDN ni indexada; no usar `cacheOnDemandPages`). Página completa bajo demanda, **no** server islands (el código va en la ruta, el pase no debe parpadear y el formulario sin JS necesita página bajo demanda).

### Estructura
```
src/
├─ actions/index.js          # entrada: operaciones que llama NUESTRA UI (RSVP)
├─ assets/fonts/             # fuentes (copias exactas de design/fonts)
├─ components/
│  ├─ ui/                    # primitivos del sistema: Button, GlassCard, Field, Heading, Ornament, Monogram, Icon
│  └─ patterns/              # compuestos: Screen, Medallion, Countdown, ScrollCue, CandleBackdrop, Sparkles, EventCard, PassBadge, RsvpForm
├─ screens/                  # UNA CARPETA POR PANTALLA del recorrido (ver § Recorrido de pantallas)
│  ├─ index.js               #   registro: orden, ancla, ruta y título de cada pantalla
│  ├─ portada/               #   Portada.astro (markup) · portada.css (estilos) · portada.data.js (datos de diseño, si hay)
│  └─ bienvenida/            #   Bienvenida.astro · bienvenida.css · bienvenida.data.js · assets/ (sus fotos)
├─ config/evento.js          # datos del evento, validados con zod al cargar
├─ layouts/
│  ├─ BaseLayout.astro       # <head>, meta OG/WhatsApp, theme-color, precarga de fuente, estilos globales
│  └─ Recorrido.astro        # contenedor de pantallas con scroll-snap + scripts/pantallas.js
├─ lib/                      # utilidades puras compartidas cliente/servidor (fechas es-MX, cuenta regresiva)
├─ scripts/pantallas.js      # pantalla activa, precarga y espera de imágenes, disparo de las entradas
├─ server/
│  ├─ services/              # casos de uso (p. ej. confirmarAsistencia): no saben de HTTP ni de SQL
│  ├─ domain/                # reglas de negocio puras + errores de dominio: sin I/O
│  ├─ repositories/          # única capa que conoce las tablas de Supabase
│  └─ db/supabase.js         # cliente con la service key (astro:env/server)
├─ middleware.js             # transversal (auth de endpoints, logging); se crea cuando haga falta
├─ pages/                    # [...pantalla].astro (`/`, `/bienvenida`, …) · i/[codigo]/[...pantalla].astro · 404.astro · _catalogo.astro (sólo dev) · api/ (cuando haya consumidor)
└─ styles/                   # fonts.css · tokens.css (copias de design/) · global.css · screen.css · recorrido.css · ui/*.css
supabase/migrations/         # esquema versionado (sin datos)
scripts/                     # generación de códigos/QR desde un CSV local ignorado
netlify.toml                 # headers de seguridad
```

### Capas de UI: `ui ← patterns ← screens ← pages`
Ninguna capa importa de una superior.
- **`ui/`** no sabe nada de la boda: sólo props y tokens.
- **`patterns/`** se arman con `ui/`, reciben datos por props y **nunca** importan `config/` ni `server/`.
- **`screens/`** son las únicas que leen `config/evento.js` y pasan datos hacia abajo. Una pantalla no conoce a las demás.
- **`pages/`** son delgadas: obtienen datos y ordenan pantallas dentro de `Recorrido`. `screens/` evita duplicar la invitación entre `/` y `/i/[codigo]`.

### Recorrido de pantallas (Ivan, 20 nov: "cada pantalla se ve como una sola")
- **Cada pantalla ocupa exactamente la pantalla visible y el scroll se detiene en cada una** (`scroll-snap-type: y mandatory` + `scroll-snap-stop: always`). Nada de un scroll continuo donde las pantallas se cruzan.
- El scroll vive en `<main class="recorrido">` (`layouts/Recorrido.astro`), no en el documento: así la barra del navegador del celular no se encoge y cada pantalla mide siempre lo mismo. Es el contenedor `recorrido` (`container-type: size`).
- **Responsivo por unidad de diseño:** cada pantalla declara su tablero (`--bw`/`--bh`: celular 390×844; computadora, p. ej., 1440×900 dentro de `@container recorrido (min-width: 1024px) and (min-aspect-ratio: 1 / 1)`). `--u = min(100cqw / --bw, 100cqh / --bh)` es un pixel del tablero escalado para que el tablero completo quepa. Todas las medidas del tablero se escriben `calc(N * var(--u))`: la composición es idéntica al lienzo en cualquier tamaño. Fondos y fotos a sangre en `.screen__fondo`; el contenido en `.screen__escenario` (el tablero). Textos con piso `max(17px, …)` y objetivos táctiles `max(44px, …)` en pantallas cortas.
- **Entrada al llegar:** `scripts/pantallas.js` precarga las imágenes de la pantalla siguiente, y cuando una pantalla ocupa ≥ 60 % de la vista espera a que sus imágenes estén decodificadas y las fuentes listas (tope 2.5 s) y le pone `is-active`. Hasta entonces sus animaciones están en pausa (`styles/screen.css`). Cada pantalla entra una vez; la pantalla con la que abre se activa sin esperar al observador. Sin JS todo queda visible.
- **Una pantalla por gesto:** con snap obligatorio un giro corto de rueda o una flecha regresaban a la misma pantalla. `pantallas.js` controla rueda y teclado (flechas, AvPág/RePág, Espacio, Inicio/Fin): cada gesto avanza o retrocede exactamente una pantalla y la inercia del trackpad cuenta como el mismo gesto. En pantallas táctiles se queda el deslizamiento nativo. Sin barra de scroll visible.
- **Salida con paralaje:** mientras una pantalla se va, su tablero sube 64 px del tablero más que el fondo (animación ligada al scroll, `animation-timeline: view()`). **Sólo `translate`**: animar `opacity`/`filter`/`mask` en el tablero lo vuelve "backdrop root" y los vidrios de adentro dejan de desenfocar (pasó y se corrigió).
- **Una dirección por pantalla, como páginas (Ivan, 20 nov):** `/portada`, `/bienvenida`, `/ceremonia`…; en las personalizadas, `/i/<codigo>/portada`, `/i/<codigo>/bienvenida`… La ruta base (`/`, `/i/<codigo>`) abre la portada y la barra muestra `/portada`. `pages/[...pantalla].astro` genera una página estática por pantalla (todas con el mismo recorrido) que abre directo en la suya. Al llegar a una pantalla, `pantallas.js` cambia la dirección y el título de la pestaña con `history.pushState`: **"Atrás" regresa a la pantalla anterior**. Los enlaces entre pantallas son `ruta#ancla` (sin JS, el ancla lleva a la pantalla; con JS se desplaza sin recargar y queda sólo la ruta). Las personalizadas usarán la misma base de rutas con `base = '/i/<codigo>'` en `pages/i/[codigo]/[...pantalla].astro` (bajo demanda).
- **Módulo de pantalla:** `screens/<pantalla>/` con el `.astro` (sólo markup y composición, envuelto en `<Screen>`; recibe `id`, `slug`, `titulo` y `siguiente` del registro), su `.css` (clases con prefijo de la pantalla, p. ej. `.bienvenida__*`), su `.data.js` (posiciones, listas, curvas del tablero) y sus `assets/`. Los componentes se colocan con contenedores propios de la pantalla para no pelear con sus estilos internos. Agregar una pantalla = crear su carpeta y sumarla en `screens/index.js`.
- Tableros de celular más altos que una pantalla (ceremonia 1056, galería 1042): **se escalan completos para que quepan** (`--bh` = alto del tablero; Ivan, 21 nov). Las manchas o fondos van a sangre, colocados en coordenadas del tablero centrado. Se verifican 1:1 con el tamaño `celularAlto` de `tools/qa` y escalados con `ajustar: true`.
- **Fidelidad con el lienzo (cómo se verifica):** cada tablero del lienzo se lee con la herramienta de Artifacts (`project/<Tablero>.dc.html`) y se compara contra la web con Chrome real a 390×844, 375×667, 1440×900, el monitor de Ivan (≈1863×972) y tableta 768×1024: capturas lado a lado, cajas de cada elemento (deben coincidir al píxel) y diferencia píxel a píxel. **Herramientas en `tools/qa/` (ver su README):** `referencias.mjs` convierte los tableros, `npm run qa:comparar -- <pantalla>` da primero los números (cajas, diferencia) y sólo hay que mirar imágenes donde no cuadren; `npm run qa:recorrido` prueba rueda, direcciones y "Atrás". No entregar una pantalla sin pasar por ahí. Detalles que salieron de esa comparación y aplican a todas las pantallas:
  - La compresión de HTML de Astro 7 quita los espacios entre elementos en línea: separar frases en `<span>` con `{' '}` explícito.
  - Textos con `line-height: normal` donde el tablero no la define (Jost/Cormorant traen la suya; 1.2 desplaza 2 px).
  - Medidas internas de un componente relativas al componente, no a un hijo con margen (el monograma mide el 62.5 % del medallón, no del vidrio).
  - Fotos: servir el JPEG del lienzo tal cual cuando el tamaño necesario es el original (recomprimir a WebP/AVIF suaviza piel y texturas), y animar su aparición con fill-mode `backwards` (con `forwards` queda en una capa de composición y se ve más suave). Fotos optimizadas en el build con sharp (`imageCDN: false`), no en la CDN de Netlify.
  - El botón principal no tiene margen interno en el tablero: con textos con piso de tamaño en pantallas cortas, `white-space: nowrap` y sin margen para que no se parta.

**Primitivos compartidos Astro/React:** un `.astro` no se puede usar dentro de una isla. El estilo de cada primitivo vive **una sola vez** en `styles/ui/*.css` (clases construidas sólo con tokens, p. ej. `.btn`, `.btn--primary`) y hay dos capas delgadas con la misma API de props (`Button.astro` / `Button.jsx`). Sólo tienen versión `.jsx` los que se usan dentro de islas (hoy sólo `Button`; `Field` y `GlassCard` cuando una isla los necesite).

**Convenciones:** variantes como uniones de valores (`variant: 'primary' | 'secondary' | 'link'`, contrato en `design/reference/componentes.d.ts`); pasar atributos nativos con `...rest` + `class:list`; composición con slots; `Heading` con `as="h1|h2|h3"`; sólo `var(--token)`; cada componente que anima resuelve su `prefers-reduced-motion`; PascalCase, un componente por archivo, pruebas junto al componente. Los datos pendientes se modelan como opcionales y el componente muestra "Horario por confirmar".

Los componentes de `design/reference/bundle.js` son la referencia de comportamiento y markup; **reescríbelos** como componentes `.astro`/`.jsx` limpios (no copies el bundle tal cual).

### Islas de React
- `Countdown` → `client:visible` (renderiza un marcador estable en servidor para evitar *hydration mismatch*).
- `RsvpForm` → `client:load`. Vive en `screens/confirmacion/RsvpForm.jsx` (no en `patterns/`) porque es la pantalla entera: un solo DOM para celular y computadora con todos los pasos y estados; la cerrada se pinta sin hidratar.
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
  code text unique not null,      -- aleatorio, 8 caracteres de un alfabeto de 31 sin ambiguos (sin 0/O, 1/l/I), NO secuencial ni adivinable; se muestra como K7M2-PQ9X
  family_name text not null,      -- "Familia Guerrero Ruiz"
  seats int not null check (seats between 1 and 6),   -- el pase más grande previsto es de 6
  channel text not null check (channel in ('impresa', 'digital')),  -- cómo recibe la invitación
  phone text,                     -- WhatsApp en formato internacional (52…), sólo para 'digital'; dato privado
  first_opened_at timestamptz,    -- primera vez que se abrió su enlace (sin contar las vistas previas de WhatsApp)
  last_opened_at timestamptz,
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

### Invitaciones impresas y digitales
Un solo mecanismo: cada familia tiene su código y su enlace `https://<dominio>/i/<codigo>` (el QR sólo lo entrega). `/` sin código pide el código (el candado; nunca buscar por nombre). Flujo completo, mensaje de WhatsApp, registro de aperturas y tareas de `scripts/` en **`docs/invitaciones.md`**.

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
- Revisión visual contra el lienzo: `tools/qa/` (`playwright-core` con el Chrome instalado; tableros convertidos en `tools/qa/.ref/` y capturas en `tools/qa/salida/`, ambos ignorados en git).
- Vitest (`getViteConfig`) para dominio y utilidades; Playwright + axe contra el preview para el flujo QR → `/i/[codigo]` → confirmación. No usar la Container API (experimental).
- Catálogo `/_catalogo` sólo en desarrollo (404 en producción) con cada primitivo y patrón en marfil y noche.
- Ni `astro dev` ni `astro build` revisan tipos; `astro check` requiere `@astrojs/check` + `typescript` (instalar sólo con autorización de Ivan).

### Particularidades de Astro 7
- `compressHTML` es `'jsx'` por defecto: puede quitar espacios entre elementos en línea (vigilar "Ivan" / "& Emma" y la fecha; si falla, `true`).
- El compilador en Rust falla con HTML mal anidado en vez de corregirlo.
- `src/fetch.ts` está reservado por el enrutamiento avanzado (opción `fetchFile`): no usar ese nombre (tampoco `fetch.js`).
- Fuera de alcance: `<ClientRouter />`, Edge middleware, `cacheOnDemandPages`.

---

## 8. Estado y pendientes

**Hecho:** proyecto Astro (JS + `checkJs`, React, Netlify), fuentes y tokens; base de la arquitectura; **portada**, **bienvenida**, **ceremonia y recepción**, **itinerario de la fiesta**, **código de vestimenta**, **galería**, **cierre**, la **pantalla de confirmación** con sus estados y la **galería de la boda** (subir con sus mensajes, el rollo antes/cerrada e historias) (celular y computadora, verificadas al píxel contra el lienzo; la ceremonia con `/calendario.ics`; la confirmación y la galería de la boda todavía sin backend); recorrido de pantallas con direcciones por pantalla e historial; herramientas de revisión visual en `tools/qa/`.

**Siguiente paso:** el backend de la confirmación (CLAUDE.md § 7 › RSVP y › Datos): Action `rsvp` (reemplaza `guardar()` y la validación del código en `RsvpForm.jsx`, marcados `TODO(backend)`), Supabase, `/i/[codigo]` y `/i/[codigo]/confirmar` bajo demanda (estado `pasos`, `regreso` o `cerrada` según la familia y la fecha). Con el mismo backend, la galería de la boda: Supabase Storage para `subir()` (`galeria-boda/subida.js`) y `fotosCompartidas()` (`galeria-boda/galeria-boda.js`), validación de hora, tipo y tamaño en el servidor, y `/i/[codigo]/galeria-de-la-boda` ("Compartiendo como"). Después, 404 y vista previa de WhatsApp (§ 6.8). Una sesión por pantalla. En la galería sólo falta poner las fotos en `src/screens/galeria/galeria.data.js` cuando Ivan las mande.

### Pendientes (al 18 de noviembre)

**Datos que faltan de Ivan:**

- **WhatsApp de los novios** (`whatsapp` en `config/evento.js`) para "Pídenoslo / Escríbenos por WhatsApp" de la confirmación; mientras falte, el enlace abre WhatsApp sin destinatario.

- **Dominio para el QR.** Es urgente: tiene que existir antes de imprimir, y la imprenta es a finales de noviembre. También va impreso en el reverso ("o entra a [dominio] con tu código") y en el mensaje de WhatsApp.
- Los teléfonos de WhatsApp de las familias con invitación digital, y cuáles familias reciben impresa y cuáles digital.
- Las medidas reales de la solapa del sobre, para ajustar el forro (`design/impresion/sobre/LEEME.txt`).
- Si la tarjeta impresa cambia "Recepción a continuación" por "19:30".
- Las doce fotos de la galería con su año, y los años en que se conocieron y en que empezaron a andar.

**Diseño pendiente en Cowork:**

- **Mesa de regalos:** sin decidir.
- **Reverso impreso:** agregar bajo el QR el código (`K7M2-PQ9X`) y *"o entra a [dominio] con tu código"*. Hay que cerrarlo antes de la imprenta.
- **Para Cowork** (ver la bitácora del 10 nov): valores de la portada que no existen como token.

---

## 9. Cómo trabajamos (Cowork ↔ Code)

- **Cowork (claude.ai, celular/escritorio):** diseño. Mockups, sistema de diseño, invitación impresa. Cada sección se aprueba ahí primero.
- **Claude Code (esta carpeta, PC):** desarrollo. Construye lo aprobado.
- Cuando cambie algo visual: se actualiza primero el **sistema de diseño** en Cowork; después se actualizan `design/` y este `CLAUDE.md` en el repo. Ivan pidió explícitamente mantener el sistema de diseño siempre al día: **no se debe perder nada**.
- Si durante el desarrollo surge una decisión visual nueva (un componente o un color que no existe), anótala en la sección 10 para llevarla a Cowork; no la inventes en silencio.

---

## 10. Bitácora

Historial completo de decisiones en **`docs/bitacora.md`** (léelo sólo si necesitas el porqué de una decisión). Al cerrar un trabajo, agrega ahí una entrada breve con la fecha; lo que deba llevarse a Cowork, márcalo como **Para Cowork**.
