# Revisión visual contra el lienzo (`tools/qa/`)

Herramientas de desarrollo para verificar que cada pantalla quede idéntica a su tablero del lienzo de Cowork. No forman parte del sitio. Usan `playwright-core` con el Chrome (o Edge) instalado en la máquina; no descargan navegadores.

## Flujo para una pantalla nueva

1. **Descargar sus tableros** del lienzo con la herramienta de Artifacts (`read` de `project/<Tablero>.dc.html`) a una carpeta temporal.
2. **Convertirlos** a HTML local (quedan en `tools/qa/.ref/`, ignorado en git porque es diseño privado):
   ```bash
   node tools/qa/referencias.mjs <carpeta-con-los-.dc.html>
   (los tableros que miden texto con un <canvas>, como las sillas con nombre, se ejecutan en Chrome con sus fuentes;
   los que arrancan en otro paso, `D.paso`, se convierten ya en ese paso)
   ```
   Si avisa "faltan blobs", descargar esos assets del lienzo a `tools/qa/.ref/` y agregarlos a `BLOBS` en `referencias.mjs`.
3. **Servir las referencias** (`.claude/launch.json` › "referencias", o `npm run qa:referencias`) en http://localhost:4400, con `astro dev` corriendo en 4321.
4. **Agregar los casos** de la pantalla en `casos.mjs`.
5. **Comparar**, primero con números:
   ```bash
   npm run qa:comparar -- ceremonia
   ```
   Imprime por caso: cajas de texto y SVG que no coinciden (deben coincidir al píxel), diferencia media de píxeles (0–255) y % de píxeles muy distintos. Abrir las imágenes de `tools/qa/salida/` (`-comparacion.png`, `-mapa.png`) **sólo** donde los números no cuadren.
6. **Probar el recorrido** (rueda, direcciones, "Atrás"):
   ```bash
   npm run qa:recorrido -- celular computadora
   ```

7. **Comportamiento de la confirmación** (sillas, teclado, candado, error al guardar, sin JS, movimiento reducido):
   ```bash
   node tools/qa/confirmacion.mjs
   ```
   Usa las páginas de muestra `/prueba/<estado>/confirmar` (sólo existen en `astro dev`).

8. **Comportamiento de la galería de la boda** (subida con un servidor simulado, rechazos, falla y "Reintentar", sin señal y regreso de la conexión, arrastrar y soltar, gestos y teclado de las historias, dónde se quedó, ventana de barras, sin JS, movimiento reducido, objetivos táctiles y rutas reales):
   ```bash
   node tools/qa/galeria-boda.mjs
   ```
   Usa `/prueba/<estado>/galeria-de-la-boda` y `/prueba/<historias|general|muchas>/galeria-de-la-boda/historias`.

Astro 7 no deja correr dos `astro dev` en el mismo proyecto: si ya hay uno (de otra sesión), las pruebas van contra ése (`QA_WEB`).

Tableros con pasos: `referencias.mjs` genera además una copia por paso (`VARIANTES`, p. ej. `ConfirmacionD2-paso2`), con el estado de su lógica aplicado.

Variables: `QA_WEB` (por defecto http://localhost:4321), `QA_REF` (http://localhost:4400), `QA_CHROME` (ruta del navegador), `QA_ESPERA` (ms hasta el estado final, 7500).

Las cifras de la cuenta regresiva y los elementos en bucle (anillo, destellos, ikat) siempre difieren un poco entre capturas: es esperado.
