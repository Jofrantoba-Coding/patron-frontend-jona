import { describe, expect, it, vi } from 'vitest';
import { useTestServer } from '../../mock-server/http/test-server';
import { createAuthServiceHttp } from './AuthServiceHttp';
import { describeAuthServiceContract } from './authServiceContract';
import { createHttpClient } from './httpClient';

const server = useTestServer();

describeAuthServiceContract('AuthServiceHttp against the live mock server', (getSession) =>
  createAuthServiceHttp(createHttpClient({ baseUrl: server.url(), getSession })),
);

describe('AuthServiceHttp wire behavior', () => {
  it('sends the login body as {usuario, clave} with the explicit X-Tenant-Id (S-AUTH-22)', async () => {
    const fetchFn = vi.fn<typeof fetch>(
      async () => new Response(JSON.stringify({ token: 't', user: { id_usuario: 1, usuario: 'a', nombre: 'A' } })),
    );
    const service = createAuthServiceHttp(
      createHttpClient({ baseUrl: 'http://api.test', fetchFn, newCorrelationId: () => 'c-1' }),
    );

    await service.login('T1', { usuario: 'a', clave: 'b' });

    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe('http://api.test/auth/login');
    expect(new Headers(init!.headers).get('X-Tenant-Id')).toBe('T1');
    expect(JSON.parse(init!.body as string)).toEqual({ usuario: 'a', clave: 'b' });
  });

  it('error traceId equals the correlation id the client generated', async () => {
    const service = createAuthServiceHttp(
      createHttpClient({ baseUrl: server.url(), newCorrelationId: () => 'corr-xyz' }),
    );

    const error = await service.login('demo', { usuario: 'admin', clave: 'bad' }).catch((e: unknown) => e);

    expect(error).toMatchObject({ status: 401, traceId: 'corr-xyz' });
  });
});
