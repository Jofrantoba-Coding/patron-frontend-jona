import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MISSING_DATA_ERROR } from '../src/comun/mensajes.js';
import { UiLogin } from '../src/jona-clasica/UiLogin.js';
import { UiLoginImpl } from '../src/jona-clasica/UiLoginImpl.js';
import { describeLoginBehavior } from './loginBehavior.js';

// La entrada es la Implementación: se crea con `new UiLoginImpl(...)`.
describeLoginBehavior('JONA clásica', (deps) => new UiLoginImpl(deps));

describe('JONA clásica: la Plantilla funciona sola, sin integración', () => {
  it('sin datos muestra MISSING_DATA_ERROR', () => {
    const plantilla = new UiLogin();
    plantilla.submit.click();
    assert.equal(plantilla.message.text, MISSING_DATA_ERROR);
  });

  it('con datos completos responde con su comportamiento por defecto', () => {
    const plantilla = new UiLogin();
    plantilla.email.type('ana@ejemplo.com');
    plantilla.password.type('secreta123');
    plantilla.submit.click();
    assert.equal(plantilla.message.text, 'Datos completos (sin integración).');
  });
});
