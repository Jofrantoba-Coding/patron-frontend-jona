import { expect, it, vi } from 'vitest';
import { useTestServer } from '../../mock-server/http/test-server';
import { createHttpClient } from './httpClient';
import { createLookupServiceHttp } from './LookupServiceHttp';
import { describeLookupServiceContract } from './lookupServiceContract';

const server = useTestServer();

describeLookupServiceContract('LookupServiceHttp against the live mock server', (getSession) =>
  createLookupServiceHttp(createHttpClient({ baseUrl: server.url(), getSession })),
);

it('sends the parent as a query parameter and omits it for the roots', async () => {
  const fetchFn = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ items: [] })));
  const service = createLookupServiceHttp(createHttpClient({ baseUrl: 'http://api.test', fetchFn }));

  await service.ubigeoChildren('15');
  await service.ubigeoChildren();

  expect(fetchFn.mock.calls.map(([url]) => String(url))).toEqual(['http://api.test/v1/ubigeo?parent=15', 'http://api.test/v1/ubigeo']);
});
