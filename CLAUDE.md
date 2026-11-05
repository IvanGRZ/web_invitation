# Invitación web · Boda de Ivan y Emma

Invitación digital para la boda de **Ivan Guerrero Ruiz y Emma Ascencio López** (sábado 20 de febrero de 2027, Guadalajara). La web va de la mano de una invitación impresa, que lleva un QR personalizado por familia hacia esta web.

Este archivo resume todo lo decidido hasta el **16 de octubre de 2026** en la conversación de diseño (Claude Cowork). Léelo completo antes de escribir código.

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

**Decidido:** Astro + islas de React + Supabase, desplegado en Netlify. (Ivan conoce Next.js, no Astro: explica las decisiones de Astro cuando no sean obvias.)

### Rutas
| Ruta | Qué muestra |
|---|---|
| `/` | Invitación general: portada + secciones (detalles, itinerario, vestimenta, galería). Sin formulario de confirmación nominal. |
| `/i/[codigo]` | Invitación personalizada de una familia: la misma invitación + `PassBadge` ("Familia X · Válido para N personas") + `RsvpForm`. Renderizado bajo demanda (SSR); el resto, estático. |

El QR impreso de cada familia apunta a `https://<dominio>/i/<codigo>`.

### Islas de React
- `Medallion` (animación de entrada) → `client:load`
- `Countdown` → `client:visible`
- `ScrollCue` puede ser CSS puro (sin isla)
- `RsvpForm` → `client:load`
- Todo lo demás: componentes `.astro` estáticos.

Los componentes de `design/reference/bundle.js` son la referencia de comportamiento y markup; **reescríbelos** como componentes `.tsx`/`.astro` limpios (no copies el bundle tal cual).

### Datos (propuesta inicial, confirmar con Ivan)
```sql
-- invitados: una fila por familia/invitación
create table guests (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,      -- aleatorio, 6-8 caracteres, NO secuencial ni adivinable
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
- Validar en servidor: el código existe, `guests_count <= seats`, fecha límite.
- Ivan puede ver/exportar confirmaciones desde el editor de tablas de Supabase; un `/admin` es opcional.

### Fuentes y assets
- Usa los woff2 de `design/fonts/` (o los paquetes `@fontsource/cormorant-garamond`, `@fontsource/jost`, `@fontsource/pinyon-script`, son los mismos archivos) con `font-display: swap`.
- Copia lo que la web necesite de `design/assets/` a `public/` (p. ej. `ikat-textura-marfil.svg`). El monograma animado va como SVG inline (ver `Medallion` en `design/reference/bundle.js` y `design/reference/portada.html`).

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

**Primer paso sugerido en esta carpeta:** crear el proyecto Astro (TypeScript estricto, integración de React y adaptador de Netlify), integrar `design/tokens.css` y las fuentes, y construir la portada de `/` idéntica a `design/reference/portada.html`, con el ajuste responsivo de la sección 6.

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
