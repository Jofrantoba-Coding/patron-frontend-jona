import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { createLogin, type LoginResult } from '../src/login.js';

const fetchOriginal = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = fetchOriginal;
});

/** Reemplaza fetch por una respuesta fija con el formato de cable del backend; devuelve las peticiones. */
function responderCon(status: number, body: unknown): unknown[] {
  const peticiones: unknown[] = [];
  globalThis.fetch = (async (_url: string, init: RequestInit) => {
    peticiones.push(JSON.parse(String(init.body)));
    return { ok: status < 300, status, json: async () => body } as Response;
  }) as typeof fetch;
  return peticiones;
}

/** Abre la pantalla, ingresa los datos y espera la respuesta. */
async function ingresar(email: string, password: string) {
  let autenticado: LoginResult | undefined;
  const screen = createLogin({ baseUrl: 'http://api', onAuthenticated: (r) => { autenticado = r; } });
  screen.email.type(email);
  screen.password.type(password);
  screen.submit.click();
  await new Promise((resolve) => setImmediate(resolve));
  return { screen, autenticado };
}

describe('pantalla de login', () => {
  it('envía usuario y clave, y avisa con el token y el usuario', async () => {
    const user = { id: 1, usuario: 'ana@ejemplo.com', nombre: 'Ana Torres' };
    const peticiones = responderCon(200, { token: 't-1', user });
    const { autenticado } = await ingresar('ana@ejemplo.com', 'secreta123');
    assert.deepEqual(peticiones, [{ usuario: 'ana@ejemplo.com', clave: 'secreta123' }]);
    assert.deepEqual(autenticado, { token: 't-1', user });
  });

  it('con credenciales inválidas muestra el mensaje', async () => {
    responderCon(401, { code: 'INVALID_CREDENTIALS', message: 'x', details: [], traceId: 't' });
    const { screen } = await ingresar('ana@ejemplo.com', 'otra');
    assert.equal(screen.message.text, 'Correo o contraseña incorrectos.');
  });

  it('con un usuario bloqueado (403) muestra el mensaje', async () => {
    responderCon(403, { code: 'USER_DISABLED', message: 'x', details: [], traceId: 't' });
    const { screen } = await ingresar('bloqueado@ejemplo.com', 'secreta123');
    assert.equal(screen.message.text, 'Su usuario está bloqueado. Contacte al administrador.');
  });

  it('con un 422 muestra el detalle junto a cada campo', async () => {
    const details = [{ field: 'usuario', message: 'Es obligatorio.' }, { field: 'clave', message: 'Es obligatorio.' }];
    responderCon(422, { code: 'VALIDATION_ERROR', message: 'x', details, traceId: 't' });
    const { screen } = await ingresar('', '');
    assert.equal(screen.message.text, 'Revise los datos marcados.');
    assert.deepEqual([screen.emailError.text, screen.passwordError.text], ['Es obligatorio.', 'Es obligatorio.']);
  });

  it('sin red muestra el mensaje de conexión', async () => {
    globalThis.fetch = (async () => {
      throw new TypeError('fetch failed');
    }) as typeof fetch;
    const { screen } = await ingresar('ana@ejemplo.com', 'secreta123');
    assert.equal(screen.message.text, 'No se pudo conectar con el servidor. Revise su conexión.');
  });
});
