import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { medirMigracion, tablaMarkdown } from './medir.js';

// npm run medir: mide los pasos con el verificador, reescribe progreso.json e imprime la tabla del capítulo.

const raiz = fileURLToPath(new URL('../..', import.meta.url));
const progreso = {
  generadoPor: 'npm run medir (herramientas/medir.ts); lo protege test/progreso.test.ts',
  unidad: 'violaciones de herramientas/jona-check.ts sobre src/; líneas de código sin líneas en blanco ni comentarios',
  pasos: medirMigracion(raiz),
};
writeFileSync(join(raiz, 'progreso.json'), `${JSON.stringify(progreso, null, 2)}\n`);
console.log(tablaMarkdown(progreso.pasos));
