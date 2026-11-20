// Proceso del servidor SSR (dist/server/principal.js, `npm start`). Uno de los tres puntos de
// entrada de proceso: los únicos módulos del servidor con código suelto (regla 4).
// Variables: SITIO_URL (https://catalogo.example), PORT (4050), HOST (127.0.0.1).
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crearRaizComposicion } from './crearRaizComposicion';
import { crearServidorSsr } from './crearServidorSsr';

const dirCliente = join(dirname(fileURLToPath(import.meta.url)), '..', 'client');
const raiz = crearRaizComposicion({ SITIO_URL: process.env.SITIO_URL });
const servidor = crearServidorSsr({ raiz, plantilla: readFileSync(join(dirCliente, 'index.html'), 'utf8'), dirEstaticos: dirCliente });

const host = process.env.HOST ?? '127.0.0.1';
servidor.listen(Number(process.env.PORT ?? 4050), host, () => {
  const { port } = servidor.address() as { port: number };
  console.log(`Catálogo SSR listo en http://${host}:${port} (sitio público: ${raiz.sitio.url})`);
});
