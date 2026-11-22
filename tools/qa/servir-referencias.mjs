// Sirve tools/qa/.ref/ en http://localhost:4400 (o el puerto indicado) para comparar contra la web.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { REF_DIR } from './comun.mjs';

const puerto = Number(process.argv[2] || process.env.PORT || 4400);
const tipos = { '.html': 'text/html; charset=utf-8', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };

createServer(async (req, res) => {
  const ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname).split('/').filter((p) => p && p !== '..').join('/');
  try {
    const datos = await readFile(join(REF_DIR, ruta || 'index.html'));
    res.writeHead(200, { 'content-type': tipos[extname(ruta)] || 'application/octet-stream' });
    res.end(datos);
  } catch {
    res.writeHead(404);
    res.end('no');
  }
}).listen(puerto, () => console.log(`referencias en http://localhost:${puerto}`));
