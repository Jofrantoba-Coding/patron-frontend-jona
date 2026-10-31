import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { UILOGIN_DEFAULTS } from '../src/uilogin/InterUiLogin.js';

describe('InterUiLogin', () => {
  it('DEFAULTS trae solo valores de presentación: los campos son estado y no tienen default', () => {
    assert.deepEqual(UILOGIN_DEFAULTS, { titulo: 'Iniciar sesión', textoBoton: 'Ingresar' });
  });
});
