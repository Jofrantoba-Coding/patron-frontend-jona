import { test } from 'node:test';
import assert from 'node:assert/strict';
import { UiLoginDemo } from './UiLoginDemo.js';

test('isValidData exige correo y contraseña', () => {
  const ui = new UiLoginDemo();
  assert.equal(ui.isValidData('ana@ejemplo.com', 'secreta123'), true);
  assert.equal(ui.isValidData('', 'secreta123'), false);
  assert.equal(ui.isValidData('ana@ejemplo.com', ''), false);
});

test('las capacidades registran lo que la pantalla hizo', () => {
  const ui = new UiLoginDemo();
  ui.login('ana@ejemplo.com', 'secreta123');
  ui.login('', '');
  ui.goToCreateAccount();
  ui.goToRecoverPassword();
  assert.deepEqual(ui.events, ['login:ana@ejemplo.com', 'error:datos-incompletos', 'crear-cuenta', 'recuperar-contrasena']);
});
