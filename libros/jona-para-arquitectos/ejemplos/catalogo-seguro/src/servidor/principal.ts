// Punto de entrada del proceso (dist/server/principal.js): arma la raíz y el servidor, y escucha.
// Variables: PORT (4070), HOST (127.0.0.1), ORIGEN_PUBLICO (http://localhost:4070).
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crearRaizComposicion } from './crearRaizComposicion';
import { crearServidor } from './crearServidor';

const dirCliente = join(dirname(fileURLToPath(import.meta.url)), '..', 'client');
const plantilla = readFileSync(join(dirCliente, 'index.html'), 'utf8');
const host = process.env.HOST ?? '127.0.0.1';

void crearRaizComposicion({ ORIGEN_PUBLICO: process.env.ORIGEN_PUBLICO }).then((raiz) => {
  const servidor = crearServidor({ raiz, plantilla, dirEstaticos: dirCliente });
  servidor.listen(Number(process.env.PORT ?? 4070), host, () => {
    const { port } = servidor.address() as { port: number };
    console.log(`Catálogo seguro listo en http://${host}:${port} (origen público: ${raiz.origen})`);
  });
});
