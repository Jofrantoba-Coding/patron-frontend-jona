// Punto de entrada del proceso (dist/server/principal.js): arma una vez lo que dura lo que el
// proceso, la raíz y el servidor, y escucha. Es el único módulo del servidor con código suelto.
// Variables: PORT (4040), HOST (127.0.0.1), REPOSITORIO (memoria | http), API_URL.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crearRaizComposicion } from './crearRaizComposicion';
import { crearServidorSsr } from './crearServidorSsr';

const dirCliente = join(dirname(fileURLToPath(import.meta.url)), '..', 'client');
const plantilla = readFileSync(join(dirCliente, 'index.html'), 'utf8');
const entorno = { REPOSITORIO: process.env.REPOSITORIO, API_URL: process.env.API_URL };
const servidor = crearServidorSsr({ raiz: crearRaizComposicion(entorno), plantilla, dirEstaticos: dirCliente });

const host = process.env.HOST ?? '127.0.0.1';
servidor.listen(Number(process.env.PORT ?? 4040), host, () => {
  const { port } = servidor.address() as { port: number };
  console.log(`Catálogo SSR listo en http://${host}:${port} (repositorio: ${process.env.REPOSITORIO === 'http' ? `http, ${process.env.API_URL ?? 'http://127.0.0.1:4020'}` : 'memoria'})`);
});
