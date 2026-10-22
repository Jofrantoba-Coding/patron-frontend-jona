import { describe, expect, it, vi } from 'vitest';
import { createHttpClient, type RequestContext } from './httpClient';

function setup(getRequestContext?: () => RequestContext) {
  const fetchFn = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ ok: true })));
  const client = createHttpClient({ baseUrl: 'http://api.test', fetchFn, getSession: () => ({ tenantId: 'demo' }), getRequestContext });
  const headers = () => new Headers((fetchFn.mock.calls.at(-1)![1] as RequestInit).headers);
  return { client, headers };
}

describe('httpClient request context headers (D13)', () => {
  it('sends X-User-Id and X-Empresa-Id when the context knows them', async () => {
    const { client, headers } = setup(() => ({ userId: '5', empresaId: '2' }));
    await client.request('GET', '/v1/x');
    expect([headers().get('X-User-Id'), headers().get('X-Empresa-Id')]).toEqual(['5', '2']);
  });

  it('sends only what is known and reads the context at request time', async () => {
    let context: RequestContext = { userId: '5' };
    const { client, headers } = setup(() => context);
    await client.request('GET', '/v1/x');
    expect([headers().get('X-User-Id'), headers().has('X-Empresa-Id')]).toEqual(['5', false]);
    context = { userId: '6', empresaId: '1' };
    await client.request('GET', '/v1/x');
    expect([headers().get('X-User-Id'), headers().get('X-Empresa-Id')]).toEqual(['6', '1']);
  });

  it('sends neither header without a context or with an empty one (W1 requests unchanged)', async () => {
    for (const getRequestContext of [undefined, () => ({})]) {
      const { client, headers } = setup(getRequestContext);
      await client.request('GET', '/v1/x');
      expect([headers().has('X-User-Id'), headers().has('X-Empresa-Id')]).toEqual([false, false]);
      expect(headers().get('X-Tenant-Id')).toBe('demo');
    }
  });
});
