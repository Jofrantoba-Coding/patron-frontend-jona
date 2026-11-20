// Proceso del generador estático (dist/server/generarEstatico.js, último paso de `npm run build`):
// escribe dist/estatico a partir de dist/client. Variable: SITIO_URL (https://catalogo.example).
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crearRaizComposicion } from './crearRaizComposicion';
import { generarSitioEstatico } from './generarSitioEstatico';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..');
const dirCliente = join(dist, 'client');
const raiz = crearRaizComposicion({ SITIO_URL: process.env.SITIO_URL });

generarSitioEstatico({ raiz, plantilla: readFileSync(join(dirCliente, 'index.html'), 'utf8'), dirCliente, dirSalida: join(dist, 'estatico') }).then(
  (archivos) => console.log(`Sitio estático en dist/estatico: ${archivos.length} archivos generados para ${raiz.sitio.url}`),
  (error: unknown) => {
    console.error('No se pudo generar el sitio estático:', error);
    process.exitCode = 1;
  },
);
