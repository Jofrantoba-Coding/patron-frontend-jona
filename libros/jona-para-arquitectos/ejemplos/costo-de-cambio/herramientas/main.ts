import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { medirExperimento, tablaMarkdown } from './medir.js';

// npm run medir: mide las instantáneas, reescribe resultados.json e imprime las tablas del capítulo.

const raiz = fileURLToPath(new URL('../..', import.meta.url));
const variantes = medirExperimento(raiz);
const resultados = {
  generadoPor: 'npm run medir (herramientas/medir.ts); lo protege test/resultados.test.ts',
  unidad: 'líneas de código sin líneas en blanco ni comentarios; diferencias por LCS contra v0, sin espacios',
  variantes,
};
writeFileSync(join(raiz, 'resultados.json'), `${JSON.stringify(resultados, null, 2)}\n`);
console.log(tablaMarkdown(variantes));
