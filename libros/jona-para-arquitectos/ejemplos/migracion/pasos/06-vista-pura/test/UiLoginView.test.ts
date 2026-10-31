import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { crearUiLoginView } from '../src/uilogin/UiLoginView.js';

// La vista se prueba sola: recibe un modelo, pinta, y reenvía lo que hace la persona. Sin servicio ni almacenamiento.

describe('UiLoginView', () => {
  it('pinta el modelo en los controles', () => {
    const { pantalla, pintar } = crearUiLoginView();
    pintar({ titulo: 'T', textoBoton: 'B', correo: 'c', clave: 'k', errorCorreo: 'ec', errorClave: 'ek', mensaje: 'm', ocupada: true });
    assert.deepEqual(
      [pantalla.titulo.text, pantalla.boton.label, pantalla.boton.className, pantalla.correo.value, pantalla.clave.value],
      ['T', 'B', 'boton-primario', 'c', 'k'],
    );
    assert.deepEqual([pantalla.errorCorreo.text, pantalla.errorClave.text, pantalla.mensaje.text], ['ec', 'ek', 'm']);
    assert.deepEqual([pantalla.correo.enabled, pantalla.clave.enabled, pantalla.boton.enabled], [false, false, false]);
  });

  it('reenvía lo que hace la persona a los callbacks del modelo, con el valor primero', () => {
    const { pantalla, pintar } = crearUiLoginView();
    const eventos: string[] = [];
    pintar({
      correo: '', clave: '',
      alCambiarCorreo: (correo) => eventos.push(`correo:${correo}`),
      alCambiarClave: (clave) => eventos.push(`clave:${clave}`),
      alEnviar: () => eventos.push('enviar'),
    });
    pantalla.correo.type('ana@ejemplo.com');
    pantalla.clave.type('secreta123');
    pantalla.boton.click();
    assert.deepEqual(eventos, ['correo:ana@ejemplo.com', 'clave:secreta123', 'enviar']);
  });
});
