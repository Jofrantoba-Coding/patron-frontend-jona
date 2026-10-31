import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { aHtml, Raiz } from '../../../comun/declarativo.js';
import { UiLoginView } from '../src/uilogin/UiLoginView.js';

// La vista declarativa es una función pura: el mismo modelo da el mismo árbol (y el mismo HTML).

describe('UiLoginView (declarativa)', () => {
  it('pinta el modelo como HTML', () => {
    const html = aHtml(UiLoginView({
      titulo: 'T', textoBoton: 'B', correo: 'c', clave: 'k', errorCorreo: 'ec', errorClave: 'ek', mensaje: 'm', ocupada: true,
    }));
    assert.equal(html, [
      '<form id="login">',
      '<h1 id="titulo">T</h1>',
      '<input id="correo" value="c" disabled>',
      '<span id="error-correo">ec</span>',
      '<input id="clave" value="k" disabled>',
      '<span id="error-clave">ek</span>',
      '<button id="ingresar" class="boton-primario" disabled>B</button>',
      '<p id="mensaje">m</p>',
      '</form>',
    ].join(''));
  });

  it('reenvía lo que hace la persona a los callbacks del modelo, con el valor primero', () => {
    const raiz = new Raiz();
    const eventos: string[] = [];
    raiz.pintar(UiLoginView({
      correo: '', clave: '',
      alCambiarCorreo: (correo) => eventos.push(`correo:${correo}`),
      alCambiarClave: (clave) => eventos.push(`clave:${clave}`),
      alEnviar: () => eventos.push('enviar'),
    }));
    raiz.escribir('correo', 'ana@ejemplo.com');
    raiz.escribir('clave', 'secreta123');
    raiz.pulsar('ingresar');
    assert.deepEqual(eventos, ['correo:ana@ejemplo.com', 'clave:secreta123', 'enviar']);
  });
});
