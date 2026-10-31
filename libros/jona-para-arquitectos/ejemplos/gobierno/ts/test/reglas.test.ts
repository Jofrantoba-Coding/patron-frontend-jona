import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { revisar } from '../herramientas/jona-check.js';
import { CASOS } from './casos.js';
import { fixture } from './rutas.js';

describe('Cada regla detecta lo que dice detectar (una regla que nunca falla no prueba nada)', () => {
  for (const [arbol, regla, archivo] of CASOS) {
    it(`${arbol}: ${regla} señala ${archivo}`, () => {
      const violaciones = revisar(fixture(arbol));

      assert.equal(violaciones.length, 1, JSON.stringify(violaciones, null, 2));
      assert.equal(violaciones[0].regla, regla);
      assert.equal(violaciones[0].archivo, archivo);
      assert.notEqual(violaciones[0].mensaje, '');
    });
  }

  it('las pruebas y las historias quedan exentas: importan la Implementación y la vista sin violar N4', () => {
    assert.deepEqual(revisar(fixture('exentos-pruebas-e-historias')), []);
  });

  it('en la forma de Plantilla (UiLoginImpl extends UiLogin), la Implementación es la entrada', () => {
    assert.deepEqual(revisar(fixture('plantilla-impl-es-la-entrada')), []);
  });

  it('informa la línea del import que viola la regla', () => {
    const [violacion] = revisar(fixture('n4-importa-impl'));

    assert.equal(violacion.linea, 1);
  });
});
