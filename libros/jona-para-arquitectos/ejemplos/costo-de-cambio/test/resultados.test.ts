import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { CAMBIOS, medirExperimento, tablaMarkdown, VARIANTES } from '../herramientas/medir.js';

// Guarda de los números del capítulo: si alguien toca una instantánea, esta prueba falla
// hasta que se regenere resultados.json con `npm run medir` (y se revise el texto del libro).

const RAIZ = fileURLToPath(new URL('../..', import.meta.url));

describe('resultados.json', () => {
  it('coincide con la medición actual de las instantáneas', () => {
    const guardado = JSON.parse(readFileSync(join(RAIZ, 'resultados.json'), 'utf8'));
    assert.deepEqual(guardado.variantes, medirExperimento(RAIZ));
  });

  it('la tabla en Markdown tiene una fila por variante en la base y por (cambio, variante)', () => {
    const tabla = tablaMarkdown(medirExperimento(RAIZ));
    const filas = tabla.split('\n').filter((l) => l.startsWith('| ') && !l.startsWith('| Variante |') && !l.startsWith('| Cambio |'));
    assert.equal(filas.length, VARIANTES.length + CAMBIOS.length * VARIANTES.length);
  });
});
