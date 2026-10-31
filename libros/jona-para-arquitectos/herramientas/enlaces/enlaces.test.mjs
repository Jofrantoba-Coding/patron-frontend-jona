// Cada enlace relativo de los capítulos, los apéndices y el README del libro apunta a un archivo o carpeta que existe.
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

const LIBRO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CAPITULOS = join(LIBRO, 'capitulos');
const DOCUMENTOS = [
  join(LIBRO, 'README.md'),
  join(LIBRO, 'ejemplos', 'README.md'),
  ...readdirSync(CAPITULOS).filter((f) => f.endsWith('.md')).map((f) => join(CAPITULOS, f)),
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
