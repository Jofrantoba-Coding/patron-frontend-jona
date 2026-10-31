// Analiza cada bloque ```mermaid de los capítulos y falla con el primer error de sintaxis.
// Uso: node verificar.mjs [archivo.md ...]   (sin argumentos: todos los capítulos)
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

// Mermaid necesita un DOM para cargarse; el análisis de sintaxis no dibuja nada.
const dom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.DOMParser = dom.window.DOMParser;
const { default: mermaid } = await import('mermaid');
mermaid.initialize({ startOnLoad: false });

const CAPITULOS = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'capitulos');
const archivos = process.argv.length > 2
  ? process.argv.slice(2)
  : readdirSync(CAPITULOS).filter((f) => f.endsWith('.md')).sort().map((f) => join(CAPITULOS, f));

let total = 0;
let errores = 0;
for (const archivo of archivos) {
  const texto = readFileSync(archivo, 'utf8').replace(/\r\n/g, '\n');
  for (const bloque of texto.matchAll(/```mermaid\n([\s\S]*?)```/g)) {
    total++;
    const linea = texto.slice(0, bloque.index).split('\n').length + 1;
    try {
      await mermaid.parse(bloque[1]);
    } catch (e) {
      errores++;
      console.log(`ERROR ${archivo}:${linea}\n  ${String(e?.message ?? e).split('\n').slice(0, 4).join('\n  ')}`);
    }
  }
}
console.log(`${total} diagramas, ${errores} con error`);
process.exit(errores ? 1 : 0);
