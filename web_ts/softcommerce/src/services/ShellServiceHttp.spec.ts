import { describe, expect, it, vi } from 'vitest';
import { useTestServer } from '../../mock-server/http/test-server';
import { createHttpClient } from './httpClient';
import { createShellServiceHttp } from './ShellServiceHttp';
import { describeShellServiceContract } from './shellServiceContract';

const server = useTestServer();

describeShellServiceContract('ShellServiceHttp against the live mock server', (getSession) =>
  createShellServiceHttp(createHttpClient({ baseUrl: server.url(), getSession })),
);

describe('ShellServiceHttp wire behavior', () => {
  it('requests GET /menu and unwraps the items, sending the session tenant and token', async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ items: [] })));
    const service = createShellServiceHttp(
      createHttpClient({ baseUrl: 'http://api.test', fetchFn, getSession: () => ({ tenantId: 'T1', token: 'tok' }) }),
    );

    await expect(service.menu()).resolves.toEqual([]);

    const [url, init] = fetchFn.mock.calls[0];
    const headers = new Headers(init!.headers);
    expect(url).toBe('http://api.test/menu');
    expect(headers.get('X-Tenant-Id')).toBe('T1');
    expect(headers.get('Authorization')).toBe('Bearer tok');
  });

  it('encodes the form id in the permissions path and fails closed on a malformed payload', async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ add: true, modify: 'yes' })));
    const service = createShellServiceHttp(createHttpClient({ baseUrl: 'http://api.test', fetchFn }));

    const permissions = await service.permissions('a b/c');

    expect(fetchFn.mock.calls[0][0]).toBe('http://api.test/forms/a%20b%2Fc/permissions');
    expect(permissions.add).toBe(true);
    expect(permissions.modify).toBe(false);
  });
});
