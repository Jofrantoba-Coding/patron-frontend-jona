// Cada enlace relativo de los capítulos, los apéndices, el README del libro y los README de cada ejemplo
// apunta a un archivo o carpeta que existe.
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

const LIBRO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CAPITULOS = join(LIBRO, 'capitulos');
const EJEMPLOS = join(LIBRO, 'ejemplos');
const DOCUMENTOS = [
  join(LIBRO, 'README.md'),
  join(EJEMPLOS, 'README.md'),
  ...readdirSync(CAPITULOS).filter((f) => f.endsWith('.md')).map((f) => join(CAPITULOS, f)),
  // El README de cada ejemplo, un nivel por debajo de ejemplos/.
  ...readdirSync(EJEMPLOS, { withFileTypes: true })
    .filter((entrada) => entrada.isDirectory() && entrada.name !== 'node_modules')
    .map((entrada) => join(EJEMPLOS, entrada.name, 'README.md'))
    .filter((ruta) => existsSync(ruta)),
];

/** Enlaces Markdown relativos: [texto](ruta) sin esquema ni ancla sola, fuera de bloques de código. */
function enlacesRelativos(ruta) {
  const texto = readFileSync(ruta, 'utf8').replace(/\r\n/g, '\n').replace(/```[\s\S]*?```/g, '');
  return [...texto.matchAll(/\]\(([^)\s]+)\)/g)]
    .map((m) => m[1])
    .filter((destino) => !/^[a-z]+:/i.test(destino) && !destino.startsWith('#'))
    .map((destino) => destino.split('#')[0]);
}

describe('Enlaces relativos del libro', () => {
  for (const documento of DOCUMENTOS) {
    it(`${documento.slice(LIBRO.length + 1)}: todos los destinos existen`, () => {
      const rotos = enlacesRelativos(documento).filter((destino) => !existsSync(resolve(dirname(documento), decodeURIComponent(destino))));
      assert.deepEqual(rotos, []);
    });
  }
});
