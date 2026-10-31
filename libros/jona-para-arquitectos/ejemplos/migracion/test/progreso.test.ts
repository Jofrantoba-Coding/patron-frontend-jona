import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { lineasDeCodigo, medirMigracion, REGLAS_MEDIDAS, tablaMarkdown, type MedidaPaso } from '../herramientas/medir.js';
import { PASOS, PRIMER_PASO_SIN_DEUDA } from '../herramientas/pasos.js';
import { RAIZ } from './rutas.js';

// Guarda de los números del capítulo: si alguien toca un paso, esta prueba falla hasta que
// se regenere progreso.json con `npm run medir` (y se revise el texto del libro).

const medidas = medirMigracion(RAIZ);

describe('progreso.json', () => {
  it('coincide con la medición actual de los pasos', () => {
    const guardado = JSON.parse(readFileSync(join(RAIZ, 'progreso.json'), 'utf8')) as { pasos: MedidaPaso[] };
    assert.deepEqual(guardado.pasos, medidas);
  });

  it('la deuda total nunca sube de un paso al siguiente', () => {
    for (let i = 1; i < medidas.length; i++) {
      assert.ok(medidas[i].total <= medidas[i - 1].total,
        `${medidas[i].paso} tiene ${medidas[i].total} violaciones; ${medidas[i - 1].paso} tenía ${medidas[i - 1].total}`);
    }
  });

  it('ninguna regla sube de un paso al siguiente', () => {
    for (let i = 1; i < medidas.length; i++) {
      for (const regla of REGLAS_MEDIDAS) {
        assert.ok(medidas[i].reglas[regla] <= medidas[i - 1].reglas[regla], `${regla} sube en ${medidas[i].paso}`);
      }
    }
  });

  it(`la deuda es cero desde ${PRIMER_PASO_SIN_DEUDA}, y no antes`, () => {
    const primero = PASOS.indexOf(PRIMER_PASO_SIN_DEUDA);
    assert.deepEqual(medidas.map((m) => m.total === 0), PASOS.map((_, i) => i >= primero));
  });

  it('la tabla en Markdown tiene una fila por paso', () => {
    const filas = tablaMarkdown(medidas).split('\n').filter((l) => /^\| \d\d-/.test(l));
    assert.equal(filas.length, PASOS.length);
  });
});

describe('lineasDeCodigo', () => {
  it('descarta líneas en blanco y comentarios, sin depender del fin de línea', () => {
    const texto = ['// comentario', 'const a = 1;', '', '/** doc', ' * más', ' */', 'const b = 2; // al final', '/* x */ c();'].join('\r\n');
    assert.deepEqual(lineasDeCodigo(texto), ['const a = 1;', 'const b = 2; // al final', 'c();']);
  });
});
