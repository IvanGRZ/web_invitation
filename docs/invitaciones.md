# Invitaciones impresas y digitales (acordado con Ivan, 18 nov)

Flujo de enlaces personales, candado, mensajes de WhatsApp y herramientas para no cruzar enlaces. Se usa al construir `/i/[codigo]`, la confirmación y los scripts de `scripts/`.


**Un solo mecanismo para las dos:** cada familia tiene su código y su enlace personal `https://<dominio>/i/<codigo>`. El QR sólo es una forma de entregar ese enlace.

| | Impresa | Digital |
|---|---|---|
| Cómo le llega | Tarjeta con QR y, bajo el QR, el código impreso (`K7M2-PQ9X`) con *"o entra a [dominio] con tu código"* | Mensaje de WhatsApp con su enlace personal y, al final, su código como respaldo |
| A dónde la lleva | A su invitación personalizada (portada con su pase y "Confirmar asistencia" a la vista) | Lo mismo; al final del recorrido, el sobre del cierre la lleva a su confirmación |

- **Enlace general (`/`)** = red de seguridad para quien lo recibe reenviado o pierde el suyo. Ve la invitación completa, y al intentar confirmar le aparece **el candado**: escribe su código y, si es válido, entra a su invitación personalizada. Debajo, *"¿No lo tienes? Pídenoslo por WhatsApp"*. La pantalla está por diseñar en Cowork.
  - Normaliza la entrada: mayúsculas o minúsculas, con o sin guion o espacios.
  - Responde igual de lento si el código existe o no, y **limita los intentos** por IP (p. ej. 10 por hora).
  - **Nunca** busca por nombre o apellido: revelaría quién está invitado y con cuántos lugares.
- **Vista previa de WhatsApp:** cada `/i/<codigo>` sirve sus propias meta OG: título "Ivan & Emma · Invitación para la Familia García", descripción breve e imagen de la portada. Va aunque la página lleve `noindex`.
- **Mensaje de WhatsApp** (Ivan lo manda desde su teléfono). El enlace va completo con `https://`, para que sea tocable y muestre la vista previa:
  > ¡Hola, familia García! Con mucho cariño les compartimos nuestra invitación: https://[dominio]/i/K7M2PQ9X — Ahí pueden confirmar su asistencia antes del 15 de enero. Si en algún momento les pide un código, es K7M2-PQ9X. Ivan y Emma

**Para evitar enviar enlaces cruzados (tareas para Claude Code):**

1. **Lista de invitados con teléfono.** La lista de Excel de Ivan exportada a CSV (ignorado en git): una fila por persona con NOMBRE, APELLIDOS, CELULAR e INVITACION LABEL (los acompañantes llevan "Acompañante <nombre de su principal>"). `npm run importar:invitados -- <lista.csv>` genera el SQL para Supabase en `scripts/salida/` (ignorada): crea las invitaciones con su código aleatorio (todas `digital`), las personas con su celular (10 dígitos → +52; si empieza con 1 → +1; de 11 a 15 dígitos ya trae su clave de país, p. ej. 49 de Alemania) y las relaciona; avisa de celulares repetidos o raros, personas sin apellido, acompañantes con error de dedo e invitaciones de más de 6.
2. **Enlaces de WhatsApp listos.** Por cada familia digital, el script genera un enlace `https://wa.me/<telefono>?text=<mensaje>` que abre **el chat correcto con el mensaje ya escrito**, con su enlace personal y su código dentro. Ivan no copia ni pega nada, sólo revisa y envía.
3. **Lista de envío local.** Es un HTML generado en una carpeta ignorada; **nunca se publica**, porque lleva teléfonos. Tiene una fila por familia: nombre, lugares, canal, botón "Abrir en WhatsApp", casilla de "enviado" (en `localStorage`) y la columna "abrió su enlace" con la fecha. Se regenera con un comando que lee las aperturas de Supabase con la service key.
4. **Registro de aperturas.** Al cargar `/i/[codigo]` se guardan `first_opened_at` y `last_opened_at`.
   - **No cuentan las vistas previas:** `WhatsApp`, `facebookexternalhit` y otros bots por User-Agent. WhatsApp pide la página al escribir el mensaje, antes de enviarlo.
   - Que el registro no frene la página: se escribe sin esperar respuesta.
   - Un enlace abierto antes de enviarlo indica que algo se cruzó.
5. **Cambiar el código.** Un script rota el código de **una familia digital** cuyo enlace llegó a quien no era. El código anterior deja de funcionar y lleva al enlace general con el candado. En las impresas no se puede, porque el código ya está en la tarjeta: el script lo impide y lo avisa.
6. **Revisión antes de enviar** (para Ivan): el nombre del saludo, el del chat y el de la vista previa tienen que coincidir.
7. La confirmación muestra el nombre de la familia en grande. Un "¿No eres de esta familia? Avísanos" al pie queda como opción por decidir en Cowork.
