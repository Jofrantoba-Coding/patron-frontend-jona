import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { ApiError } from '../src/ApiError.js';
import { createAuthServiceHttp } from '../src/AuthServiceHttp.js';

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

const service = createAuthServiceHttp({ baseUrl: 'http://api' });

describe('AuthServiceHttp', () => {
  it('envía correo y clave, y devuelve el token y el usuario', async () => {
    const user = { id: 1, usuario: 'ana@ejemplo.com', nombre: 'Ana Torres' };
    const peticiones = responderCon(200, { accessToken: 't-1', user });
    assert.deepEqual(await service.login('ana@ejemplo.com', 'secreta123'), { token: 't-1', user });
    assert.deepEqual(peticiones, [{ correo: 'ana@ejemplo.com', clave: 'secreta123' }]);
  });

  it('traduce el cuerpo de error a ApiError, con los campos del contrato de servicio', async () => {
    const fields = [{ name: 'correo', message: 'Es obligatorio.' }, { name: 'clave', message: 'Es obligatorio.' }];
    responderCon(422, { error: { code: 'VALIDATION_ERROR', message: 'Inválida.', fields }, traceId: 't-9' });
    const error = await service.login('', '').catch((e: unknown) => e);
    assert.ok(error instanceof ApiError);
    assert.deepEqual([error.status, error.code, error.traceId], [422, 'VALIDATION_ERROR', 't-9']);
    assert.deepEqual(error.details.map((d) => d.field), ['email', 'password']);
  });

  it('traduce un fallo de red a ApiError NETWORK_ERROR con estado 0', async () => {
    globalThis.fetch = (async () => {
      throw new TypeError('fetch failed');
    }) as typeof fetch;
    const error = await service.login('ana@ejemplo.com', 'secreta123').catch((e: unknown) => e);
    assert.ok(error instanceof ApiError);
    assert.deepEqual([error.status, error.code], [0, 'NETWORK_ERROR']);
  });
});
