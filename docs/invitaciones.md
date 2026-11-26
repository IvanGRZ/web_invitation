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
  > ¡Hola, familia García! Hay días que se esperan toda una vida, y el nuestro ya tiene fecha: el sábado 20 de febrero de 2027. No lo imaginamos sin ustedes. Aquí les espera su invitación: https://[dominio]/i/K7M2PQ9X
  >
  > Nos hará muy felices que nos confirmen su asistencia antes del 15 de enero. Si en algún momento les pide un código, es K7M2-PQ9X.
  >
  > Con cariño, Ivan y Emma

  Sin referencias religiosas (Ivan, 25 nov). Una persona: en singular ("¡Hola, Janette!… sin ti… te espera tu…"); pareja u otra etiqueta sin "Familia": los nombres de sus personas ("¡Hola, Alexis y Citlali!") en plural. Las fechas salen de `config/evento.js`.

**Para evitar enviar enlaces cruzados (tareas para Claude Code):**

1. **Lista de invitados con teléfono.** La lista de Excel de Ivan exportada a CSV (ignorado en git): una fila por persona con NOMBRE, APELLIDOS, CELULAR e INVITACION LABEL (los acompañantes llevan "Acompañante <nombre de su principal>"). `npm run importar:invitados -- <lista.csv>` genera el SQL para Supabase en `scripts/salida/` (ignorada): crea las invitaciones con su código aleatorio (todas `digital`), las personas con su celular (10 dígitos → +52; si empieza con 1 → +1; de 11 a 15 dígitos ya trae su clave de país, p. ej. 49 de Alemania) y las relaciona; avisa de celulares repetidos o raros, personas sin apellido, acompañantes con error de dedo e invitaciones de más de 6.
2. **Enlaces de WhatsApp listos.** ✅ `npm run whatsapp -- <n>` (`scripts/whatsapp.mjs`) arma por cada invitación digital dos enlaces, `whatsapp://send?phone=…&text=…` (WhatsApp de escritorio) y `https://web.whatsapp.com/send?…` (WhatsApp Web, siempre en la misma pestaña), sin la página intermedia de wa.me, que abren **el chat correcto con el mensaje ya escrito**, con su enlace personal y su código dentro. Teléfono: el de la invitación o, si no tiene, el del primer integrante (por silla) con celular. **No envía nada**: Ivan revisa y envía a mano (WhatsApp puede bloquear el número).
3. **Lista de envío local.** ✅ El mismo comando abre `http://127.0.0.1:4500` (sólo localhost; copia en `scripts/salida/whatsapp.html`, ignorada; **nunca se publica**, lleva teléfonos) con las siguientes n pendientes: nombre, personas, teléfono, enlace, "Abrir en WhatsApp", "Marcar enviada" y "abrió su enlace" (resaltada si se abrió antes de enviarla). "Marcar enviada" guarda la fecha en `invitations.sent_at` (migración `20261125000000_envio_whatsapp.sql`; es lo único que escribe), así cada corrida sigue donde se quedó la anterior. Opciones: `--codigos K7M2PQ9X,BGD7F9AN` y `--reenviar`. Al final, las digitales sin ningún teléfono.
4. **Registro de aperturas.** Al cargar `/i/[codigo]` se guardan `first_opened_at` y `last_opened_at`.
   - **No cuentan las vistas previas:** `WhatsApp`, `facebookexternalhit` y otros bots por User-Agent. WhatsApp pide la página al escribir el mensaje, antes de enviarlo.
   - Que el registro no frene la página: se escribe sin esperar respuesta.
   - Un enlace abierto antes de enviarlo indica que algo se cruzó.
5. **Cambiar el código.** Un script rota el código de **una familia digital** cuyo enlace llegó a quien no era. El código anterior deja de funcionar y lleva al enlace general con el candado. En las impresas no se puede, porque el código ya está en la tarjeta: el script lo impide y lo avisa.
6. **Revisión antes de enviar** (para Ivan): el nombre del saludo, el del chat y el de la vista previa tienen que coincidir. ✅ Cada fila de la lista muestra el saludo y el título de la vista previa para compararlos con el chat.
7. La confirmación muestra el nombre de la familia en grande. Un "¿No eres de esta familia? Avísanos" al pie queda como opción por decidir en Cowork.
