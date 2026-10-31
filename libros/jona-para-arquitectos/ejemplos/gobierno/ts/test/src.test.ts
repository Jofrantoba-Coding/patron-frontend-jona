import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { describe, it } from 'node:test';
import { archivosAnalizados, revisar } from '../herramientas/jona-check.js';
import { enProyecto } from './rutas.js';

describe('El ejemplo de src/ cumple la norma', () => {
  it('analiza el código de src/ (la prueba no pasa por no encontrar archivos)', () => {
    const archivos = archivosAnalizados(enProyecto('src'));

    assert.ok(archivos.includes('uilogin/UiLoginImpl.ts'));
    assert.ok(archivos.includes('jbutton/JButtonView.ts'));
    assert.ok(archivos.includes('servicios/AuthServiceHttp.ts'));
  });

  it('src/ no tiene violaciones', () => {
    assert.deepEqual(revisar(enProyecto('src')), []);
  });
});

// Prueba de generalidad: el mismo verificador, en solo lectura, sobre los ejemplos de otros capítulos.
// Si faltan (por ejemplo, al copiar solo esta carpeta), la prueba se omite en lugar de fallar.
const OTROS_EJEMPLOS = ['../../web-react/src', '../../web-ts-puro/src'];

describe('Generalidad: la norma se cumple en los ejemplos web-react y web-ts-puro', () => {
  for (const ruta of OTROS_EJEMPLOS) {
    const raiz = enProyecto(ruta);
    it(`${ruta} no tiene violaciones`, { skip: !existsSync(raiz) && `${ruta} no existe` }, () => {
      assert.ok(archivosAnalizados(raiz).length > 3, 'debe analizar los archivos del ejemplo');
      assert.deepEqual(revisar(raiz), []);
    });
  }
});
