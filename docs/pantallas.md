# Especificación de pantallas aprobadas

Detalle de cada pantalla tal como se aprobó en Cowork. La medida exacta manda en el tablero del lienzo (`project/<Tablero>.dc.html`) y en `design/sistema-de-diseno.md`; aquí está el resumen y las reglas de comportamiento. Lee sólo la sección de la pantalla que vas a construir.

## 6. Portada aprobada (propuesta D · Velas + medallón)

Referencia exacta: `design/reference/portada.html`. Medidas a 390×844:

| Elemento | Especificación |
|---|---|
| Fondo | Degradado radial índigo (#1f2d44 → #141c2b → #0f1522), resplandor dorado de vela arriba que respira, halo índigo abajo-izquierda, 5 destellos flotantes, ikat marfil al 5 % deslizándose |
| Medallón | Óvalo de vidrio 240×314 px a 68px del borde superior; anillo de perlas doradas (punto de 3px cada 9px) que gira; dentro, el monograma I & E (150×187) en `gold` que **se dibuja trazo a trazo** |
| Nombres | "Ivan" alineado a la izquierda y "& Emma" a la derecha (desfasados), Cormorant 300 a 66px, margen lateral 40px; entran deslizándose cada uno desde su lado |
| Fecha | "Sábado 20 de febrero de 2027", cursiva 20px, centrada |
| Cuenta regresiva | Tarjeta de vidrio, margen lateral 44px; días : horas : min : seg en vivo, cifras 32px en `gold-deep`, ":" que parpadean |
| Botón | "Confirmar asistencia", marfil con degradado, radio de 12px (`--radius-button`), 52px de alto, margen lateral 44px |
| Cierre | Sólo el gesto de desplazamiento (`ScrollCue`): línea dorada de 32px por la que cae una estela de luz hacia una flecha de 30px que rebota, a 12px del borde inferior. **Sin arco marfil**: el fondo noche ocupa toda la pantalla |

Secuencia (~4 s): medallón 0.1 s → monograma se dibuja 0.4–2.6 s → letras se enfocan 1.3 s → anillo 1.6 s → "Ivan" 2.2 s / "& Emma" 2.45 s → fecha 2.8 s → cuenta regresiva 3.05 s → botón 3.3 s → gesto de desplazamiento 3.6 s (bucle de 2.4 s).

**Responsivo:** en la web real el medallón NO es fijo: escálalo con la altura de pantalla (p. ej. `width: min(240px, 29svh)`) para que en teléfonos cortos (iPhone SE) el botón de confirmar quede visible sin hacer scroll. En escritorio, la portada se centra como una columna con el fondo noche a pantalla completa.

**Computadora (aprobada el 19 nov):** `design/reference/portada-computadora.html`. Es la misma composición del celular centrada (pedido expreso de Ivan), con la luz, los halos y los destellos repartidos en todo el ancho. **La portada no se personaliza:** quien entra con su código ve la misma portada; el pase sólo aparece en la confirmación.

## 6.1 Bienvenida aprobada (propuesta B · postal a pantalla completa)

Referencia exacta: `design/reference/bienvenida.html` (390×844) y `design/reference/bienvenida-computadora.html` (1440×900), con la animación; son los tableros **"Bienvenida · celular"** y **"Bienvenida · computadora 1440 × 900"** del lienzo. **La versión de computadora es como se debe ver la web en un monitor.** Medidas completas en `design/sistema-de-diseno.md` § Bienvenida aprobada.

- Segunda sección, justo después de la portada. Define el paso de noche a marfil.
- **Foto** de la propuesta en Toledo (3 de marzo de 2025) a sangre: celular 390×580 con encuadre `74% 40%`; computadora a todo lo ancho, 660 px de alto, encuadre `50% 30%`. **Color original, sin filtros.** Ivan va a poner la foto original (7767 px de ancho, la toma nítida) como asset del proyecto; servirla con `<Image>`/`<Picture>` de Astro en varios tamaños. En monitores ultrawide, fijar el encuadre para no cortar las caras.
- Arriba, degradado de noche (#0f1522 → transparente) que continúa la portada; antetítulo "Nuestra historia" en Jost dorado.
- **Placa de vidrio** sobre la foto: "Toledo · España" + *dijo que sí* (Pinyon Script, **en minúscula**, decisión de estilo). En celular centrada a 372 px; en computadora del lado izquierdo, sobre el cerro.
- **Ola marfil** que cubre la base de la foto; debajo, el texto: *"El 3 de marzo de 2025 con el Alcázar de testigo, nos prometimos caminar juntos toda la vida. Ahora queremos celebrarlo con ustedes."* (texto exacto, aprobado por Ivan), voluta dorada y firma *Ivan & Emma*.
- **Destellos:** 3 en la franja de noche y 8 sobre la foto (12 en computadora), dorado claro con halo, nunca sobre las caras. Es la única excepción a la regla de máximo 5.
- **Movimiento** (una sola vez, al entrar en pantalla con IntersectionObserver): foto con fundido lento (sólo opacidad, **sin escala ni desenfoque**); la placa sube y su vidrio se empaña (backdrop-filter 0 → 16 px); *dijo que sí* se escribe de izquierda a derecha (clip-path); el texto aparece **frase por frase**; al final la firma. `prefers-reduced-motion`: todo visible sin animar.

## 6.2 Ceremonia y recepción aprobada (propuesta C · ola con corte y brújula)

Computadora (aprobada el 19 nov): `design/reference/ceremonia-computadora.html`. La ceremonia va arriba a la izquierda y la recepción abajo a la derecha, unidas por la línea dorada de lado a lado con *"y a continuación"* al centro.

Referencia exacta: `design/reference/ceremonia.html` (390×1056, ábrelo en el navegador; ahí funcionan las opciones de "Cómo llegar") y el tablero **"Ceremonia y recepción · celular (aprobada)"** del lienzo. Medidas y tiempos completos en `design/sistema-de-diseno.md` § Ceremonia y recepción aprobada.

- Tercera sección, después de la bienvenida. Fondo marfil con las tres manchas de luz que cambian de forma; encabezado "Ceremonia y recepción" · *Sábado 20 de febrero* · "de 2027".
- **Paradas en zigzag:** medallón de vidrio de 96 px con el icono del lugar (templo a la izquierda, mansión a la derecha) y junto a él "Ceremonia · 18:00 hrs" / "Recepción · 19:30 hrs" y el nombre del lugar. **Sin direcciones a la vista.**
- **Ola dorada** (SVG) que une los dos medallones cruzando casi todo el ancho; en el centro, *y a continuación*. Alrededor del letrero la línea se rompe en trazos cortos que se desvanecen (máscaras SVG: la línea sólida se oculta con un degradado radial y una copia punteada aparece sólo en el anillo de transición). Se dibuja de la ceremonia a la recepción con una máscara que revela el trazo.
- **"Cómo llegar" ya no es botón:** brújula de 28 px + texto con subrayado dorado. La aguja se acomoda al aparecer y luego se mece muy despacio. Al tocarlo aparece una barra de vidrio con **Maps · Waze · Uber** y la aguja gira para apuntar hacia ella; sólo una abierta a la vez. Implementarlo como `<button aria-expanded>` que muestra/oculta la barra (con poco JS o una isla pequeña) y enlaces normales en la barra, que deben funcionar con teclado.
  - Maps: `https://www.google.com/maps/search/?api=1&query=<destino>`
  - Waze: `https://waze.com/ul?q=<destino>&navigate=yes`
  - Uber: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=<destino>`
  - Destinos: "Templo Expiatorio Eucarístico, Guadalajara" y "Mansión Magnolia, Francisco I. Madero 636, Guadalajara".
- Al final, "Agregar al calendario" (índigo lleno, 52 px, `--radius-button`).
- **Movimiento** (una sola vez, al entrar en pantalla): medallón de la ceremonia y su icono se dibuja → textos y brújula → la ola se dibuja (3.2 s) → *y a continuación* cuando la línea llega → medallón de la recepción → calendario. `prefers-reduced-motion`: todo visible, aguja fija.

## 6.3 Itinerario de la fiesta aprobado (propuesta D · programa que anochece)

Referencia exacta: `design/reference/itinerario.html` (celular, 390×670) y `design/reference/itinerario-computadora.html` (1440×900), con la animación funcionando. Medidas y tiempos completos en `design/sistema-de-diseno.md` § Itinerario de la fiesta aprobado.

- Cuarta sección, después de la ceremonia. Una **carta marfil sólida** (`#faf7f0`, no vidrio) con marco dorado interior, como un programa impreso: voluta, "Programa de la noche", *la fiesta* en Pinyon Script que se escribe, y seis renglones (icono de línea dorado · nombre · línea de puntos · hora). Datos en la sección 3; **sin ubicación** y sin descripción del vals.
- **Fondo:** arriba se queda claro (marfil con luz dorada y palo de rosa). Abajo, el cielo de la noche (palo de rosa → lila → índigo → `#0f1522`), visible a los lados y debajo de la carta. En computadora la carta va centrada a 560 px y el cielo cubre todo el ancho.
- **Movimiento** (una sola vez, al entrar en pantalla): los horarios caen uno cada 0.75 s (aparece el renglón, el icono se dibuja y la línea de puntos se traza) y **al mismo tiempo cae la noche**: dos capas de fondo fijas que sólo suben de opacidad, primero el atardecer y luego la noche. **No hay orillas que se muevan.** Cuando ya es de noche, titilan las estrellas. `prefers-reduced-motion`: estado final, sin animar.
- Termina en noche (`#0f1522`): la sección de código de vestimenta empieza en esa misma noche.

## 6.4 Código de vestimenta aprobado (propuesta A · Gala)

Referencia exacta: `design/reference/vestimenta.html` (390×740). Medidas en `design/sistema-de-diseno.md` § Código de vestimenta aprobado.

- Quinta sección, **de noche** (continúa la del itinerario y sigue en la galería; **sin ola**). Estrellas que titilan.
- "Código de vestimenta" · *Etiqueta rigurosa*; dos columnas con un moño y un vestido largo en línea dorada que se dibujan: "Ellos · Smoking" y "Ellas · Vestido largo" (esta aclaración sólo va en la web).
- Placa de vidrio de noche con "Sólo adultos", la frase de los niños de la impresa y "Evento exclusivo para mayores de 18 años" (textos exactos en la sección 3 y en el manual).
- Computadora (aprobada el 19 nov): `design/reference/vestimenta-computadora.html`, todo centrado en la noche estrellada.

## 6.5 Galería aprobada (Un paso a la vez)

Referencia exacta: `design/reference/galeria.html` (celular) y `design/reference/galeria-computadora.html` (1440×900), con flechas y puntos funcionando. Medidas, textos exactos y tiempos en `design/sistema-de-diseno.md` § Galería aprobada.

- Sexta sección, **de noche**. **Una foto por cada año** de su historia (doce), de la más antigua a la más reciente; en la web empieza en el primer año.
- Cada foto va en un **pedazo de película dibujado en línea dorada** sobre vidrio de noche (perforaciones, cuadros vecinos, ventana), apiladas: la del año actual al frente y las anteriores salen volando al avanzar. Debajo, el **año grande** en Cormorant dorado y el pie de foto opcional.
- **Línea de años:** flechas a los lados y un punto por año que se puede tocar. Debe funcionar con teclado (flechas y puntos como botones con `aria-label` del año) y con gesto de deslizar en celular.
- Textos de Ivan (exactos en el manual): *Un paso a la vez* · entrada · cierre · *"¡Compártenos las fotos que tomes esta noche!"* · botón **Compartir mis fotos**.
- El botón lleva a la **galería de la boda** (sección 6.9), una pantalla aparte donde los invitados suben sus fotos.
- **Datos pendientes de Ivan:** las doce fotos y sus años. Sólo está la de Toledo (2025), copiada en `design/assets/fotos/toledo-propuesta.jpg` para las referencias.

## 6.6 Cierre aprobado (El sello)

Referencia exacta: `design/reference/cierre.html` (390×844, con la animación) y `design/reference/cierre-computadora.html` (1440×900: sobre de 420 × 294 px, sello de 112 px y el frente impreso a 640 px de alto). Medidas y tiempos en `design/sistema-de-diseno.md` § Cierre aprobado.

- Final del recorrido, **de noche**. Un **sobre virtual** (para quien no tiene la invitación impresa): "Tu invitación" · *Todo listo, solo faltas tú* · *Rompe el sello y confirma tu asistencia*; debajo, "Toca el sello" y la fecha límite.
- Reverso del sobre azul (solapas laterales e inferior en triángulo, superior de pico encimada) con el **sello de lacre dorado I & E** en la punta. **El sello es el botón**: `<button>` accesible con `aria-label` ("Romper el sello y confirmar asistencia"), que funcione con teclado. **No hay botón aparte de "Confirmar asistencia"** en esta pantalla.
- Al tocarlo: el sello se rompe, el sobre se desvanece, aparece el **frente impreso digitalizado** (`design/assets/invitacion-frente.jpg`; sírvelo optimizado con `<Image>` de Astro) y una luz marfil llena la pantalla; al terminar (~2.9 s) **navega a la pantalla de confirmación** (marfil, sección 6.7). Sin JS o con `prefers-reduced-motion`, el sello es un enlace normal que lleva directo a la confirmación.

## 6.7 Confirmación aprobada (una pregunta por pantalla)

Referencias exactas, funcionando: `design/reference/confirmacion.html` (celular) y `design/reference/confirmacion-computadora.html` (diseñada a 1440×900). Ábrelas con `?lugares=1` … `6` para ver cada tamaño de pase. Medidas, textos y animaciones en `design/sistema-de-diseno.md` § Confirmación aprobada. La lógica de los pasos y de las sillas está en el `<script>` de las referencias: es la misma del lienzo, así que tómala como especificación del comportamiento.

- **Pantalla aparte, de día (marfil).** Llegan a ella el botón de la portada y el sello del cierre. No imita la invitación impresa: no lleva tarjetas ni cajas.
- **Pasos:**
  1. *¿Nos acompañarán?*, con "Sí, con mucho gusto" y "No podremos asistir".
  2. *¿Quiénes vendrán?*, con las sillas.
  3. *Un mensaje para nosotros* (opcional) y "Confirmar asistencia".
  4. *gracias*, o *los extrañaremos* si no asisten. Si no asisten, el flujo se salta el paso 2.
- **Arriba:** "Volver a la invitación" en el paso 1 y en gracias; "Atrás" en los pasos 2 y 3. A la derecha "1 de 3" y una línea dorada de avance.
- **Una silla por persona** (Ivan, 24 nov; antes "sillas en orden" con cascada, 18 nov):
  - Bajo cada silla, el nombre y el primer apellido de su persona (dos renglones). En las muestras de desarrollo, "Lugar N".
  - Cada silla se marca y se desmarca sola: de una familia pueden ir la 1 y la 4. Sin cascada.
  - Al entrar, todas ocupadas (o las de quienes ya confirmaron que van).
  - Sin sillas ocupadas, "Continuar" se deshabilita.
  - De 1 a 12 lugares (lienzo del 24 nov): hasta 6 en una fila; de 7 a 12, dos filas centradas, la de arriba con la silla de más. Cada silla tiene su columna fija según cuántas van en la fila (78/64/56 celular, 94/82/74 computadora) y el renglón del nombre que no cabe se achica hasta 8 px. Tableros `ConfLugares7/8/9/12`, `ConfNombres4/6/12`, `ConfEtiqueta-*` y los estados con 12. El HTML de referencia acepta `?lugares=1…12`.
- **Datos que envía:** `{ attending, people, message }`, con `people` = ids de las personas de las sillas ocupadas (ninguno si no asisten). El servidor revalida que sean de esa invitación.
- **Accesibilidad:**
  - Las sillas son controles reales: botones con `aria-pressed`, o un grupo de radio "cuántos asisten", con teclado.
  - El contador va con `aria-live`.
  - Los objetivos táctiles miden ≥ 44 px.
  - Con `prefers-reduced-motion`, sin rebote, escritura ni destellos.
- **Sin JS:** el formulario debe seguir funcionando. Una versión de una sola página (asistencia, una casilla por persona y mensaje) que envíe la misma Action basta como respaldo.
- **El contenedor de la pantalla usa `overflow: clip`, no `hidden`.** Con `hidden`, el navegador desplaza el contenido al enfocar un botón y la pantalla brinca; pasó en las pruebas.
- **Computadora:** dos mitades separadas por un filete dorado al centro. A la izquierda, el pase fijo, cuyas sillitas se pintan de índigo al elegir quiénes vienen. A la derecha, la pregunta del paso.
- **Estados (aprobados el 19 nov), en `design/reference/confirmacion-estados.html`:**
  1. **El candado** (`/` sin código):
     - Ocho casillas en dos bloques de 4, como va impreso (K7M2-PQ9X). Que sea un solo `<input>` real (`inputmode="text"`, `autocapitalize="characters"`, `autocomplete="off"`, `maxlength="9"`), pintado como casillas, para que pegar y borrar funcionen.
     - "Entrar a mi invitación" se habilita con 8 caracteres.
     - Debajo, "¿No lo tienes? Pídenoslo por WhatsApp".
     - En computadora, la izquierda muestra Ivan & Emma y la fecha.
  2. **Código inválido:** borde rojo suave, una sacudida corta (sin ella con `prefers-reduced-motion`) y el mensaje exacto del manual, con `role="alert"`.
  3. **Error al guardar:** el mensaje escrito se conserva, aparece un aviso arriba del botón y el botón pasa a "Intentar de nuevo".
  4. **Regreso después de confirmar:** si la familia ya respondió, la confirmación abre aquí y no en el paso 1. Muestra su respuesta (sillas, mensaje y fecha en que se recibió) y "Cambiar mi respuesta", que entra al paso 1 con su respuesta precargada.
  5. **Cerrada:** después del 15 de enero (`2027-01-15T23:59:59-06:00`), sin formulario. Muestra su respuesta, o "No recibimos su respuesta", y "Escríbenos por WhatsApp".

## 6.8 Pantallas generales (aprobadas el 19 nov)

- **404 · código inexistente** (`design/reference/404.html`, celular y computadora):
  - De noche, con el medallón chico, "Ivan & Emma" y *No encontramos esta invitación*.
  - "Escribir mi código" lleva al candado (6.7); "Ver la invitación" lleva a `/`.
  - Al pie, la ayuda por WhatsApp.
  - Sirve para `/i/<codigo>` inexistente y para cualquier ruta que no exista.
- **Vista previa de WhatsApp:**
  - Copia `design/assets/vista-previa-whatsapp.jpg` (1200×630, 78 KB) a `public/` y úsala como `og:image`, con URL absoluta, `og:image:width` 1200, `og:image:height` 630 y `twitter:card` = `summary_large_image`.
  - En `/i/<codigo>`, `og:title` = "Ivan & Emma · Invitación para la {familia}"; en `/`, "Ivan & Emma · Nuestra boda". `og:description` = "Sábado 20 de febrero de 2027 · Guadalajara".
  - La imagen es la misma para todos.

## 6.9 Galería de la boda aprobada (20 nov)

Pantalla aparte, **de noche**, a la que lleva "Compartir mis fotos" (6.5). Tableros en la sección "Galería de la boda" del lienzo; detalle en `design/sistema-de-diseno.md` § Galería de la boda. **Aprobada completa por Ivan el 20 nov**, en celular y computadora. Referencias exactas: `design/reference/galeria-boda.html` (celular) y `galeria-boda-computadora.html`: subir fotos y sus estados. `galeria-boda-historias.html` y `galeria-boda-historias-computadora.html`: las historias funcionando. `galeria-boda-antes.html` y `galeria-boda-antes-computadora.html`: el rollo sin revelar con la cuenta en vivo. En las historias, la lógica del `<script>` es la especificación del comportamiento.

- **Calendario:** se abre el sábado 20 de febrero a las 18:00 (`2027-02-21T00:00:00Z`) y **deja de recibir fotos el domingo 21 a las 12:00 (`2027-02-21T18:00:00Z`)** (Ivan, 20 nov). Después de esa hora las historias se siguen viendo. El servidor valida las dos horas, no sólo la pantalla.
- **Decisiones de Ivan (20 nov):**
  - **No se pide nombre.** Con `/i/<codigo>` la foto queda a nombre de la familia; con el enlace general sube sin nombre y en la historia sólo se ve *nuestra noche* y la hora. Sin código no aparece "Compartiendo como".
  - **Sin revisión:** las fotos se publican en cuanto suben.
  - **Historias por orden de llegada**, como en Instagram, sin agrupar por familia.
  - **Sólo fotos, sin videos** (por espacio). El selector usa `accept="image/*"` (incluye HEIC de iPhone) y el servidor rechaza lo demás.
- **Almacenamiento (Supabase, plan gratis, revisado el 20 nov):** 1 GB de archivos, 5 GB de egress y 5 GB de egress en caché al mes, archivos de hasta 50 MB y **sin transformación de imágenes**. Además, **los proyectos gratis se pausan tras una semana sin actividad**. Por eso:
  - Comprime en el navegador antes de subir (lado largo de unos 2000 px, JPEG o WebP al 80 %, sin metadatos de ubicación) y genera ahí mismo una miniatura chica para la tira, el fondo desenfocado y la precarga. Así caben miles de fotos en 1 GB y cada historia pesa poco.
  - Sirve las fotos con caché larga para que cuenten como egress en caché.
  - Vigila el uso la noche de la boda. Si se acerca al límite, conviene subir a Pro sólo ese mes.
  - Evita que el proyecto esté pausado en febrero: que haya actividad cada semana (las confirmaciones ayudan) o un aviso programado.

- **Subir fotos (elegida el 19 nov, "el obturador"):**
  - El número de recuerdos compartidos.
  - Un botón redondo grande, *Compartir mis fotos*, con un anillo dorado que marca el avance de la subida y "Subiendo 2 de 3".
  - La tira "Tus fotos" y el enlace *Ver las historias de la noche*.
  - Al pie, "Compartiendo como Familia X" (sólo con código).
  - La nota *"Puedes elegir varias a la vez. Deja esta pantalla abierta mientras se suben."*: en iPhone la subida desde la web se detiene si se cierra la página, así que no prometas lo contrario.
  - **Computadora:** textos a la izquierda y el obturador a la derecha (círculo de 300 px) con "o arrástralas aquí": acepta arrastrar y soltar archivos sobre el círculo.
- **Ver las fotos: historias (elegidas el 19 nov)**, como las de Instagram. Sin cuadrícula, sin botón de pausa y sin "Compartir mis fotos":
  - Las fotos pasan solas, 5 s cada una, con barras doradas de avance arriba.
  - **Gestos:**
    - Un toque en el tercio izquierdo regresa; en el resto avanza.
    - Mantener el dedo presionado pausa; al soltar sigue sin brincarse.
    - El umbral entre toque y presión es de unos 250 ms.
    - En la primera foto, tocar atrás la vuelve a empezar; después de la última, vuelve a la primera.
  - **"Volver"**, arriba a la izquierda, regresa a la pantalla de subir.
  - **Computadora:** la historia en 9:16 (461 × 820 px) al centro sobre su propia foto muy desenfocada, flechas a los lados, **botón de pausa** dentro de la historia (con `aria-label` "Pausar"/"Reanudar") y teclado (flechas y barra espaciadora).
  - **Orden y barras:** por orden de llegada; las fotos nuevas se agregan al final mientras se ven. Que empiece donde la persona se quedó (guárdalo en el navegador) o, la primera vez, en la primera foto. Con muchas fotos las barras se vuelven rayitas: muestra una ventana de unas 30 barras que se recorre con la foto actual.
  - **Para implementarlo:**
    - Pointer Events (`pointerdown`, `pointerup` y `pointercancel`) y `touch-action: none` en la zona de toque.
    - Sin selección de texto ni menú de pulsación larga: `user-select: none`, `-webkit-touch-callout: none` y `contextmenu` cancelado.
    - La barra se pausa con `animation-play-state`, y la foto siguiente se precarga.
- **Las fotos nunca se recortan (Ivan, 19 nov):**
  - Cada foto se ve **completa y centrada** en formato de historia (`object-fit: contain`).
  - Detrás va **ella misma desenfocada y oscurecida**, llenando la pantalla. En el tablero: `blur(26px) brightness(.5) saturate(1.15)`; el fondo puede salir de una miniatura para no cargar dos veces la foto grande.
  - Una foto vertical 9:16 llena la pantalla sola; una horizontal queda al centro con el desenfoque arriba y abajo.
  - Aplica también a los videos, si se aceptan.
- **Antes del sábado 20 de febrero a las 18:00 (Guadalajara), es decir `2027-02-21T00:00:00Z` (elegida el 19 nov, "el rollo sin revelar"):**
  - La galería está cerrada. Se ve un rollo de 35 mm dibujado en línea dorada con *Este rollo se revela el día de la boda*, la fecha y hora en que se abre y cuánto falta ("Faltan 93 días y 4 horas").
  - El botón "Volver a la invitación" y la nota *"Guarda este enlace: es el mismo que usarás esa noche."*
  - El servidor valida la hora, no sólo la pantalla.
- **Mensajes al subir (20 nov; celular y computadora):** se muestran en la misma pantalla de subir, con el anillo (dorado lo subido, palo de rosa `#e3b1b3` lo que falló), un renglón de estado y un aviso debajo:
  - **Sin señal:** "En pausa · 1 de 3" · *Sin señal por ahora* · las fotos esperan en la cola y se reintentan solas al volver la conexión; botón "Reintentar ahora".
  - **Archivo rechazado:** se valida en el navegador antes de subir y otra vez en el servidor; el aviso dice *"Sólo se pueden compartir fotos."* y lista cada archivo con su razón ("es un video", "pesa más de 25 MB": el límite aplica al original, antes de comprimir).
  - **Falla al guardar:** *Una foto no se pudo guardar* · "Fue un problema nuestro, no de tu foto" · botón "Reintentar".
  - **Éxito:** el anillo se completa, la cámara se vuelve palomita (*Compartir más fotos*), *¡Gracias!* y *Verlas ahora*.
  - Errores con `role="alert"`; lo demás con `role="status"`. Textos exactos en el manual.
- **Recién abierta, sin fotos (celular y computadora):** *Estrena el rollo* · "La galería ya está abierta. Comparte la primera foto de la noche." en lugar del número; "Tus fotos" como cinco lugares vacíos punteados; sin enlace a las historias. Si alguien abre las historias sin fotos, llévalo a subir.
- **Galería cerrada (desde el domingo 21, 12:00; celular y computadora):** el rollo dorado con *El rollo está completo*, cuándo se cerró, el total de recuerdos y "Ver las historias de la noche". El botón "Compartir mis fotos" de la galería (6.5) lleva aquí después del cierre, y al rollo sin revelar antes de las 18:00.
- **Límite:** 25 MB por archivo original, antes de comprimir.
- **Para construirlo:** almacenamiento (p. ej. Supabase Storage), validación de tipo y tamaño, y protección contra abuso. La ruta la decides tú; con el código, la familia queda acreditada.

---