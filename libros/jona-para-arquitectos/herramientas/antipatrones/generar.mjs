// Reescribe el catálogo por capítulo del capítulo 12 a partir de las fichas.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CAPITULOS, CAPITULO_12, FIN, INICIO, bloqueCatalogo, fichas } from './catalogo.mjs';

const ruta = join(CAPITULOS, CAPITULO_12);
const original = readFileSync(ruta, 'utf8');
const crlf = original.includes('\r\n');
const texto = original.replace(/\r\n/g, '\n');
const i = texto.indexOf(INICIO);
const j = texto.indexOf(FIN);
if (i < 0 || j < i) throw new Error(`faltan los marcadores en ${CAPITULO_12}`);
const nuevo = `${texto.slice(0, i + INICIO.length)}\n${bloqueCatalogo()}\n${texto.slice(j)}`;
writeFileSync(ruta, crlf ? nuevo.replace(/\n/g, '\r\n') : nuevo);
console.log(`${fichas().length} fichas en el catálogo`);
