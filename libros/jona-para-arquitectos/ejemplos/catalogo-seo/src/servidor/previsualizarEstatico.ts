// Proceso de previsualización del sitio estático (dist/server/previsualizarEstatico.js,
// `npm run preview:estatico`). Variables: PORT (4060), HOST (127.0.0.1).
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crearServidorEstatico } from './crearServidorEstatico';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'estatico');
const servidor = crearServidorEstatico(dir);

const host = process.env.HOST ?? '127.0.0.1';
servidor.listen(Number(process.env.PORT ?? 4060), host, () => {
  const { port } = servidor.address() as { port: number };
  console.log(`Sitio estático listo en http://${host}:${port} (dist/estatico)`);
});
