import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { RAIZ } from './rutas.js';

// Una sola implementación de las reglas: la del capítulo 9 (gobierno/ts). Este ejemplo usa copias,
// y esta prueba falla si una copia se aparta del original. Para cambiar una regla, se cambia allá y se vuelve a copiar.

const ORIGINALES = join(RAIZ, '..', 'gobierno', 'ts', 'herramientas');
const COPIAS = join(RAIZ, 'herramientas');
const ARCHIVOS = ['jona-check.ts', 'deuda.ts'];

/** Contenido sin diferencias de fin de línea (LF o CRLF según el sistema que lo guardó). */
const leer = (ruta: string) => readFileSync(ruta, 'utf8').replace(/\r\n/g, '\n');

describe('Copias vigiladas del verificador', () => {
  for (const archivo of ARCHIVOS) {
    it(`herramientas/${archivo} es idéntico a gobierno/ts/herramientas/${archivo}`, () => {
      assert.ok(existsSync(join(ORIGINALES, archivo)), `no se encontró el original: ${join(ORIGINALES, archivo)}`);
      assert.ok(existsSync(join(COPIAS, archivo)), `falta la copia: herramientas/${archivo}`);
      assert.equal(leer(join(COPIAS, archivo)), leer(join(ORIGINALES, archivo)),
        `herramientas/${archivo} se apartó del original; vuelva a copiarlo desde gobierno/ts/herramientas`);
    });
  }
});
