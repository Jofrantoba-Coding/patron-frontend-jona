import { describe, expect, it, vi } from 'vitest';
import { useTestServer } from '../../mock-server/http/test-server';
import { createCatalogServiceHttp } from './CatalogServiceHttp';
import { describeCatalogServiceContract, type LocalidadRow } from './catalogServiceContract';
import { createHttpClient } from './httpClient';

const server = useTestServer();

describeCatalogServiceContract('CatalogServiceHttp against the live mock server', (getSession) =>
  createCatalogServiceHttp<LocalidadRow>(createHttpClient({ baseUrl: server.url(), getSession }), 'localidades'),
);

describe('CatalogServiceHttp wire behavior', () => {
  const setup = (body: unknown = { items: [], pagination: { page: 1, pageSize: 20, total: 0 } }) => {
    const fetchFn = vi.fn<typeof fetch>(async () => new Response(JSON.stringify(body)));
    const service = createCatalogServiceHttp(createHttpClient({ baseUrl: 'http://api.test', fetchFn }), 'localidades');
    const request = () => {
      const [url, init] = fetchFn.mock.calls[0];
      return { url: String(url), method: init!.method, body: init!.body };
    };
    return { service, request };
  };

  it('maps list paging and field filters onto the query string', async () => {
    const { service, request } = setup();

    await service.list({ page: 2, pageSize: 1000, filters: { descripcion: 'lim' } });

    expect(request().url).toBe('http://api.test/v1/localidades?page=2&pageSize=1000&descripcion=lim');
    expect(request().method).toBe('GET');
  });

  it('encodes ids in item paths and sends the JSON body on create and update', async () => {
    const created = setup({ id_localidad: '9' });
    await created.service.create({ descripcion: 'A' });
    expect(created.request()).toEqual({ url: 'http://api.test/v1/localidades', method: 'POST', body: '{"descripcion":"A"}' });

    const updated = setup({});
    await updated.service.update('a/b', { descripcion: 'B' });
    expect(updated.request()).toEqual({ url: 'http://api.test/v1/localidades/a%2Fb', method: 'PUT', body: '{"descripcion":"B"}' });

    const removed = setup();
    await removed.service.remove('7');
    expect(removed.request()).toMatchObject({ url: 'http://api.test/v1/localidades/7', method: 'DELETE' });
  });
});
