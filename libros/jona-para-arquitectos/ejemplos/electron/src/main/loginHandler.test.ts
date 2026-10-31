// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { createAuthServiceFake } from '../shared/services/AuthServiceFake';
import type { InterAuthService } from '../shared/services/InterAuthService';
import { createLoginHandler } from './loginHandler';

describe('createLoginHandler (proceso principal, sin Electron)', () => {
  it('devuelve { ok: true, value } cuando el servicio responde', async () => {
    const handle = createLoginHandler(createAuthServiceFake());

    const result = await handle('ana@ejemplo.com', 'secreta123');

    expect(result).toMatchObject({ ok: true, value: { user: { nombre: 'Ana Torres' } } });
  });

  it('serializa el ApiError con el formato del contrato de API', async () => {
    const handle = createLoginHandler(createAuthServiceFake());

    const result = await handle('bloqueado@ejemplo.com', 'secreta123');

    expect(result).toEqual({
      ok: false,
      status: 403,
      error: { code: 'USER_DISABLED', message: 'El usuario está bloqueado.', details: [], traceId: expect.any(String) },
    });
  });

  it('convierte una falla inesperada en INTERNAL_ERROR, sin lanzar a través del IPC', async () => {
    const broken: InterAuthService = { login: () => Promise.reject(new TypeError('falla inesperada')) };

    const result = await createLoginHandler(broken)('ana@ejemplo.com', 'secreta123');

    expect(result).toMatchObject({ ok: false, status: 500, error: { code: 'INTERNAL_ERROR', details: [] } });
  });

  it('el resultado es un objeto plano, que el IPC puede clonar sin perder campos', async () => {
    const result = await createLoginHandler(createAuthServiceFake())('ana@ejemplo.com', 'otra');

    expect(structuredClone(result)).toEqual(result);
    expect(Object.getPrototypeOf(result.ok ? result.value : result.error)).toBe(Object.prototype);
  });
});
