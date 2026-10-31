import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createAuthServiceFake } from '../src/comun/AuthServiceFake.js';
import { UILOGIN_DEFAULTS } from '../src/jona-minima/InterUiLogin.js';
import { createUiLogin } from '../src/jona-minima/UiLogin.js';
import { describeLoginBehavior } from './loginBehavior.js';

describeLoginBehavior('JONA mínima', createUiLogin);

describe('JONA mínima: DEFAULTS y entrada', () => {
  it('los DEFAULTS solo traen valores de presentación, nunca estado', () => {
    assert.deepEqual(Object.keys(UILOGIN_DEFAULTS).sort(), ['submitLabel', 'title']);
  });

  it('la entrada aplica los DEFAULTS a la vista', () => {
    const screen = createUiLogin({ service: createAuthServiceFake(), onAuthenticated: () => {} });
    assert.equal(screen.title.text, 'Iniciar sesión');
    assert.equal(screen.submit.label, 'Ingresar');
  });
});
