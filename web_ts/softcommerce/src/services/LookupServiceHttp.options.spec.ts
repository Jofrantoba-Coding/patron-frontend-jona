import { describe, expect, it, vi } from 'vitest';
import { createLookupServiceHttp } from './LookupServiceHttp';
import { createHttpClient } from './httpClient';

describe('LookupServiceHttp.options', () => {
  const setup = () => {
    const fetchFn = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ items: [{ id: '1', name: 'UNO' }] })));
    const service = createLookupServiceHttp(createHttpClient({ baseUrl: 'http://api.test', fetchFn }));
    return { service, url: () => fetchFn.mock.calls.at(-1)![0] as string };
  };

  it('requests /v1/lookups/{slug} with the filters as exact query parameters', async () => {
    const { service, url } = setup();
    expect(await service.options('punto-venta', { id_localidad: '1' })).toEqual([{ id: '1', name: 'UNO' }]);
    expect(url()).toBe('http://api.test/v1/lookups/punto-venta?id_localidad=1');
  });

  it('sends no query string without filters', async () => {
    const { service, url } = setup();
    await service.options('monedas');
    expect(url()).toBe('http://api.test/v1/lookups/monedas');
  });
});
