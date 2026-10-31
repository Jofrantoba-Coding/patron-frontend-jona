import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ApiError } from '../src/ApiError.js';
import { createAuthServiceFake } from '../src/AuthServiceFake.js';
import type { InterAuthService, LoginResult } from '../src/InterAuthService.js';
import { createUiLogin } from '../src/UiLogin.js';

/** Abre la pantalla con el servicio dado, ingresa los datos y espera la respuesta. */
async function ingresar(service: InterAuthService, email: string, password: string) {
  let autenticado: LoginResult | undefined;
  const screen = createUiLogin({ service, onAuthenticated: (r) => { autenticado = r; } });
  screen.email.type(email);
  screen.password.type(password);
  screen.submit.click();
  await new Promise((resolve) => setImmediate(resolve));
  return { screen, autenticado };
}

describe('UiLogin', () => {
  it('con credenciales válidas avisa con el resultado del servicio', async () => {
    const { autenticado } = await ingresar(createAuthServiceFake(), 'ana@ejemplo.com', 'secreta123');
    assert.deepEqual(autenticado?.user, { id: 1, usuario: 'ana@ejemplo.com', nombre: 'Ana Torres' });
  });

  it('con credenciales inválidas muestra el mensaje', async () => {
    const { screen } = await ingresar(createAuthServiceFake(), 'ana@ejemplo.com', 'otra');
    assert.equal(screen.message.text, 'Correo o contraseña incorrectos.');
  });

  it('con un error de validación muestra el detalle junto a cada campo', async () => {
    const { screen } = await ingresar(createAuthServiceFake(), '', '');
    assert.equal(screen.message.text, 'Revise los datos marcados.');
    assert.deepEqual([screen.emailError.text, screen.passwordError.text], ['Es obligatorio.', 'Es obligatorio.']);
  });

  it('sin red muestra el mensaje de conexión', async () => {
    const sinRed: InterAuthService = {
      login: async () => {
        throw new ApiError(0, { code: 'NETWORK_ERROR', message: 'x', details: [], traceId: '' });
      },
    };
    const { screen } = await ingresar(sinRed, 'ana@ejemplo.com', 'secreta123');
    assert.equal(screen.message.text, 'No se pudo conectar con el servidor. Revise su conexión.');
  });
});
