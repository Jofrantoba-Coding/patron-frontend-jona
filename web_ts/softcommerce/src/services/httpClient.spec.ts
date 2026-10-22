import { describe, expect, it, vi } from 'vitest';
import { ApiError } from './ApiError';
import { createHttpClient, type SessionContext } from './httpClient';

function jsonResponse(status: number, body?: unknown): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), { status });
}

function setup(session: SessionContext = {}, response: () => Response = () => jsonResponse(200, { ok: true })) {
  const fetchFn = vi.fn<typeof fetch>(async () => response());
  const client = createHttpClient({
    baseUrl: 'http://api.test',
    fetchFn,
    getSession: () => session,
    newCorrelationId: () => 'corr-1',
  });
  const lastInit = () => fetchFn.mock.calls.at(-1)![1] as RequestInit;
  const lastHeaders = () => new Headers(lastInit().headers);
  const lastUrl = () => fetchFn.mock.calls.at(-1)![0] as string;
  return { client, fetchFn, lastInit, lastHeaders, lastUrl };
}

describe('httpClient headers (S-AUTH-22)', () => {
  it('sends X-Tenant-Id and Authorization from the session on post-login requests', async () => {
    const { client, lastHeaders, lastUrl } = setup({ tenantId: 'T1', token: 'tok-9' });

    await client.request('GET', '/v1/empresas');

    expect(lastUrl()).toBe('http://api.test/v1/empresas');
    expect(lastHeaders().get('X-Tenant-Id')).toBe('T1');
    expect(lastHeaders().get('Authorization')).toBe('Bearer tok-9');
  });

  it('uses a different tenant when the session holds another one', async () => {
    const { client, lastHeaders } = setup({ tenantId: 'T2' });

    await client.request('GET', '/menu');

    expect(lastHeaders().get('X-Tenant-Id')).toBe('T2');
    expect(lastHeaders().has('Authorization')).toBe(false);
  });

  it('lets an explicit tenant override the session (login, before a session exists)', async () => {
    const { client, lastHeaders } = setup({});

    await client.request('POST', '/auth/login', { tenantId: 'demo', body: { usuario: 'a', clave: 'b' } });

    expect(lastHeaders().get('X-Tenant-Id')).toBe('demo');
  });

  it('omits X-Tenant-Id for public requests without any tenant', async () => {
    const { client, lastHeaders } = setup({});

    await client.request('GET', '/auth/session-options');

    expect(lastHeaders().has('X-Tenant-Id')).toBe(false);
  });

  it('adds a generated X-Correlation-Id', async () => {
    const { client, lastHeaders } = setup();

    await client.request('GET', '/menu');

    expect(lastHeaders().get('X-Correlation-Id')).toBe('corr-1');
  });
});

describe('httpClient request shape', () => {
  it('serializes a JSON body with its content type', async () => {
    const { client, lastInit, lastHeaders } = setup();

    await client.request('POST', '/auth/login', { body: { usuario: 'admin', clave: 'x' } });

    expect(lastInit().method).toBe('POST');
    expect(lastHeaders().get('Content-Type')).toBe('application/json');
    expect(JSON.parse(lastInit().body as string)).toEqual({ usuario: 'admin', clave: 'x' });
  });

  it('appends query values and skips undefined ones', async () => {
    const { client, lastUrl } = setup();

    await client.request('GET', '/v1/puntos-venta', { query: { id_empresa: '2', other: undefined } });

    expect(lastUrl()).toBe('http://api.test/v1/puntos-venta?id_empresa=2');
  });

  it('returns the parsed JSON body, and undefined for 204', async () => {
    const ok = setup({}, () => jsonResponse(200, { items: [1] }));
    await expect(ok.client.request('GET', '/x')).resolves.toEqual({ items: [1] });

    const empty = setup({}, () => jsonResponse(204));
    await expect(empty.client.request('DELETE', '/x')).resolves.toBeUndefined();
  });
});

describe('httpClient error mapping', () => {
  it('maps the error body to ApiError with status, code, message, details and traceId', async () => {
    const body = {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: [{ field: 'descripcion', message: 'required' }],
      traceId: 'trace-7',
    };
    const { client } = setup({}, () => jsonResponse(422, body));

    const error = await client.request('POST', '/v1/x', { body: {} }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 422, ...body });
    expect((error as ApiError).message).toBe('Validation failed');
  });

  it('falls back to a generic ApiError when the body is not the error shape', async () => {
    const { client } = setup({}, () => new Response('<html>bad gateway</html>', { status: 502 }));

    const error = await client.request('GET', '/x').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 502, code: 'HTTP_ERROR', details: [], traceId: 'corr-1' });
  });

  it('maps a network failure to ApiError status 0', async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => {
      throw new TypeError('Failed to fetch');
    });
    const client = createHttpClient({ baseUrl: 'http://api.test', fetchFn, newCorrelationId: () => 'corr-2' });

    const error = await client.request('GET', '/x').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 0, code: 'NETWORK_ERROR', traceId: 'corr-2' });
  });
});
