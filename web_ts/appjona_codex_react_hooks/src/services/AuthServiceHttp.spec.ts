import { describe, expect, it, vi } from 'vitest';
import { createAuthServiceHttp } from './AuthServiceHttp';
import { exitosoFixture } from './fixtures/auth/exitoso.fixture';

const BASE_URL = 'https://api.jona.dev';

function fakeFetch(response: Response) {
  return vi.fn<typeof fetch>().mockResolvedValue(response);
}

describe('createAuthServiceHttp', () => {
  it('respuesta ok devuelve la sesion y envia POST con email normalizado', async () => {
    const fetchFn = fakeFetch(new Response(JSON.stringify(exitosoFixture), { status: 200 }));
    const service = createAuthServiceHttp(BASE_URL, fetchFn);

    const session = await service.login('  Architect@JONA.dev ', 'codex123');

    expect(session).toEqual(exitosoFixture);
    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe(`${BASE_URL}/auth/login`);
    expect(init?.method).toBe('POST');
    expect(init?.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(String(init?.body))).toEqual({
      email: 'architect@jona.dev',
      password: 'codex123',
    });
  });

  it('401 con message en el cuerpo rechaza con ese mensaje', async () => {
    const fetchFn = fakeFetch(
      new Response(JSON.stringify({ message: 'Credenciales inválidas.' }), { status: 401 }),
    );
    const service = createAuthServiceHttp(BASE_URL, fetchFn);

    await expect(service.login('a@jona.dev', 'x')).rejects.toThrow('Credenciales inválidas.');
  });

  it('500 con cuerpo no JSON rechaza con el mensaje por defecto', async () => {
    const fetchFn = fakeFetch(new Response('<html>Internal Error</html>', { status: 500 }));
    const service = createAuthServiceHttp(BASE_URL, fetchFn);

    await expect(service.login('a@jona.dev', 'x')).rejects.toThrow(
      'No fue posible iniciar sesión.',
    );
  });
});
