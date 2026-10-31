// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from './ApiError';
import { createAuthServiceHttp } from './AuthServiceHttp';

// La suite de contrato contra el servidor mock corre sobre la cadena IPC completa (src/ipcChain.test.ts).
describe('AuthServiceHttp: respuesta 200 que no cumple el contrato de API', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([
    ['un cuerpo que no es JSON', 'esto no es JSON'],
    ['un cuerpo vacío', ''],
    ['un objeto vacío', '{}'],
    ['un cuerpo sin token', JSON.stringify({ user: { id: 1, usuario: 'ana@ejemplo.com', nombre: 'Ana Torres' } })],
    ['un token vacío', JSON.stringify({ token: '', user: { id: 1, usuario: 'ana@ejemplo.com', nombre: 'Ana Torres' } })],
    ['un usuario incompleto', JSON.stringify({ token: 't-1', user: { id: '1', usuario: 'ana@ejemplo.com' } })],
  ])('rechaza %s con ApiError INVALID_RESPONSE', async (_name, body) => {
    const fetchStub = vi.fn(async () => new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } }));
    vi.stubGlobal('fetch', fetchStub);

    const error = await createAuthServiceHttp({ baseUrl: 'http://backend.invalid' })
      .login('ana@ejemplo.com', 'secreta123')
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 200, code: 'INVALID_RESPONSE', message: 'La respuesta del servidor no es válida.', details: [],
    });
    const sent = fetchStub.mock.calls[0] as unknown as [string, RequestInit];
    expect((error as ApiError).traceId).toBe((sent[1].headers as Record<string, string>)['X-Correlation-Id']);
  });
});
