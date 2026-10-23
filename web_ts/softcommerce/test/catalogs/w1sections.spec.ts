import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { describeRegistryContract } from './registryContract';
import { W1_SECTION_CASES } from './w1sections.cases';

const session = () => ({ tenantId: 'demo' });
const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));

describe('empresa and punto-venta are entries over the W1 sections (R-REG-12)', () => {
  it.each([['empresa', 'empresas'], ['punto-venta', 'puntosVenta']])('%s stores in the W1 section %s and has no seed file of its own', (slug, section) => {
    const entry = REGISTRY.bySlug.get(slug);
    expect([entry.section, entry.seed, entry.idKey]).toEqual([section, null, 'id']);
  });

  it('empresa only modifies and details (the desktop insert and delete are no-ops)', () => {
    expect(REGISTRY.bySlug.get('empresa').modes).toEqual(['UPDATE', 'DETAIL']);
  });

  it('the demo seed of both sections carries the fields the Wave 2 forms edit, in every row', () => {
    const seed = loadSeed(dataDir);
    for (const row of seed.empresas.demo) expect(Object.keys(row), row.name).toEqual(expect.arrayContaining(['id', 'name', 'direccion', 'ruc']));
    for (const row of seed.puntosVenta.demo) expect(Object.keys(row), row.name).toEqual(expect.arrayContaining(['id', 'name', 'id_empresa', 'id_localidad', 'direccion', 'telefono', 'id_ubigeo']));
  });
});

describeRegistryContract(
  'in-browser mock',
  (slug, ctx) => {
    const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 });
    return { catalog: mock.catalog(slug), lookup: mock.lookup };
  },
  W1_SECTION_CASES,
);

const server = useTestServer({ seed: loadSeed(dataDir) });
describeRegistryContract(
  'http mock server',
  (slug, ctx) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    return { catalog: createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  },
  W1_SECTION_CASES,
);

/** S-REG-15 / S-MOCK-34: what the new routes write is seen by the W1 routes in the W1 item shape, byte for byte. */
describe('the W1 routes after writes through /v1/empresa and /v1/punto-venta', () => {
  const api = useTestServer({ seed: loadSeed(dataDir) });
  const as = { 'X-User-Id': '7' };
  const body = (res: { body: unknown }) => JSON.stringify(res.body);

  it('GET /v1/empresas shows a renamed empresa as {id,name} and nothing else', async () => {
    const put = await api.call('PUT', '/v1/empresa/1', { tenant: 'demo', headers: as, body: { name: 'nuevo nombre', direccion: 'AV. X 1', ruc: '20123456789', website: 'WWW.X.COM' } });
    expect(put.status).toBe(200);
    expect(body(await api.call('GET', '/v1/empresas', { tenant: 'demo' }))).toBe('{"items":[{"id":"1","name":"NUEVO NOMBRE"},{"id":"2","name":"DISTRIBUIDORA DEMO SRL"}]}');
  });

  it('GET /v1/puntos-venta?id_empresa=1 shows a created punto de venta in the W1 shape, and a deleted one is gone', async () => {
    const post = await api.call('POST', '/v1/punto-venta', { tenant: 'demo', headers: as, body: { id_empresa: '1', id_localidad: '1', name: 'caja uno', direccion: 'av. uno 100', telefono: '1', id_ubigeo: '150101' } });
    expect([post.status, post.body.id]).toEqual([201, '4']);
    const items = (await api.call('GET', '/v1/puntos-venta?id_empresa=1', { tenant: 'demo' })).body.items;
    expect(JSON.stringify(items[2])).toBe('{"id":"4","name":"CAJA UNO","id_empresa":"1"}');
    expect((await api.call('DELETE', '/v1/punto-venta/1', { tenant: 'demo', headers: as })).status).toBe(204);
    const after = (await api.call('GET', '/v1/puntos-venta', { tenant: 'demo' })).body.items.map((p: { id: string }) => p.id);
    expect(after).toEqual(['2', '3', '4']);
  });

  it('S-MOCK-32 POST /v1/empresa answers 405 MODE_NOT_SUPPORTED over HTTP and leaves GET /v1/empresas untouched', async () => {
    const res = await api.call('POST', '/v1/empresa', { tenant: 'demo', headers: as, body: { name: 'X', direccion: 'Y', ruc: '20123456789' } });
    expect([res.status, res.body.code]).toEqual([405, 'MODE_NOT_SUPPORTED']);
    expect(body(await api.call('GET', '/v1/empresas', { tenant: 'demo' }))).toBe('{"items":[{"id":"1","name":"COMERCIAL DEMO SAC"},{"id":"2","name":"DISTRIBUIDORA DEMO SRL"}]}');
  });

  it('the botica tenant keeps its own sections', async () => {
    expect(body(await api.call('GET', '/v1/empresa', { tenant: 'botica' })).includes('BOTICA SALUD EIRL')).toBe(true);
    expect(((await api.call('GET', '/v1/punto-venta', { tenant: 'botica' })).body.items as unknown[]).length).toBe(1);
  });
});
