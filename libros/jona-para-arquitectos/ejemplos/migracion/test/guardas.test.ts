import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { archivosDe, PASOS } from '../herramientas/pasos.js';
import { RAIZ } from './rutas.js';

// Guardas de la migración: qué puede cambiar en cada paso y qué no.

const carpeta = (paso: string, ...resto: string[]) => join(RAIZ, 'pasos', paso, ...resto);
const CARACTERIZACION = 'test/caracterizacion.test.ts';

/** Rutas cuyo contenido difiere entre dos carpetas, más las que solo existen en una. */
function diferencias(antes: Map<string, string>, despues: Map<string, string>): string[] {
  return [...new Set([...antes.keys(), ...despues.keys()])].filter((r) => antes.get(r) !== despues.get(r)).sort();
}

describe('Los pasos de la migración', () => {
  it('son exactamente los esperados, en orden', () => {
    const encontrados = readdirSync(join(RAIZ, 'pasos')).sort();
    assert.deepEqual(encontrados, [...PASOS]);
  });

  it('01-caracterizacion no cambia producción: su src es idéntico al del legado', () => {
    assert.deepEqual(diferencias(archivosDe(carpeta('00-legado', 'src')), archivosDe(carpeta('01-caracterizacion', 'src'))), []);
  });

  it('el legado no tiene pruebas; desde 01 cada paso corre la caracterización', () => {
    assert.equal(existsSync(carpeta('00-legado', 'test')), false);
    for (const paso of PASOS.slice(1)) assert.ok(existsSync(carpeta(paso, CARACTERIZACION)), `${paso} no corre la caracterización`);
  });

  it('la caracterización es la misma en todos los pasos: ningún paso la editó', () => {
    const original = archivosDe(carpeta('01-caracterizacion', 'test')).get('caracterizacion.test.ts');
    for (const paso of PASOS.slice(2)) {
      assert.equal(archivosDe(carpeta(paso, 'test')).get('caracterizacion.test.ts'), original, `${paso} editó ${CARACTERIZACION}`);
    }
  });
});

describe('08-cambio-de-vista: cambiar la tecnología de la vista toca solo la vista y la entrada', () => {
  /** Lo único que el paso 08 puede cambiar respecto del 07. */
  const PERMITIDOS = [
    'src/uilogin/UiLogin.ts',
    'src/uilogin/UiLoginView.ts',
    'test/UiLogin.test.ts',
    'test/UiLoginView.test.ts',
  ];

  it('contratos, Implementación, adaptadores, servicio falso, aplicación y demás pruebas quedan idénticos', () => {
    const cambiados = diferencias(archivosDe(carpeta('07-entrada')), archivosDe(carpeta('08-cambio-de-vista')));
    assert.deepEqual(cambiados.filter((r) => !PERMITIDOS.includes(r)), []);
  });

  it('la vista sí cambió (la guarda no pasa porque el paso 08 esté vacío)', () => {
    const cambiados = diferencias(archivosDe(carpeta('07-entrada')), archivosDe(carpeta('08-cambio-de-vista')));
    assert.ok(cambiados.includes('src/uilogin/UiLoginView.ts'));
  });
});
