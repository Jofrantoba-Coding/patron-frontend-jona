import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createChildServiceHttp } from '../../src/services/ChildServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { seed } from '../../src/services/mock/seed';
import { withBancos } from './bancosSeed';
import { CLIENTE_GRID_CASES } from './clientes.grids.cases';
import { describeRegistryContract } from './registryContract';

const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const WRITER = { userId: '7' };
const kids = REGISTRY.childEntries.filter((c: any) => c.parent === 'clientes');
const kid = (name: string) => kids.find((c: any) => c.childName === name);

describe('R-MST-11 the Cliente child entries', () => {
  it('the tabs follow the desktop order and each child is deactivated, never deleted (R-MD-4)', () => {
    expect(kids.map((c: any) => [c.childName, c.tab, c.removal])).toEqual([
      ['activaciones', 'Activación de Cliente', 'none'], ['direcciones', 'Direcciones', 'deactivate'], ['contactos', 'Contactos', 'deactivate'], ['cuentas', 'Cuentas', 'deactivate'],
    ]);
  });

  it('the Quitar texts are the desktop ones (the empty-selection sentence of the direcciones differs)', () => {
    expect(kid('direcciones').quitar).toEqual({ none: 'Para quitar una direccion primero debe seleccionar la fila.', confirm: 'Desea Quitar Direccion?', already: 'Direccion ya Esta desactivada' });
    expect(kid('contactos').quitar).toEqual({ none: 'Seleccione Fila.', confirm: 'Desea Quitar Contacto?', already: 'Contacto ya esta Desactivado' });
    expect(kid('cuentas').quitar).toEqual({ none: 'Seleccione Fila.', confirm: 'Desea Quitar Cuenta?', already: 'Cuenta ya esta Desactivada' });
  });

  it('the direccion dialog has the cascade, the zona (required only with IS_DIRECCION_CLIENTE false) and the direccion; the cuenta takes the banco name unless it is OTROS (58)', () => {
    const zona = kid('direcciones').fields.find((f: any) => f.name === 'id_zona');
    expect(zona.byParam).toEqual({ param: 'IS_DIRECCION_CLIENTE', in: [false], set: { required: true } });
    expect(kid('direcciones').fields.find((f: any) => f.name === 'id_ubigeo').byParam).toEqual({ param: 'IS_DIRECCION_CLIENTE', in: [false], set: { filter: { has: 'zonas' } } });
    const banco = kid('cuentas').fields.find((f: any) => f.name === 'id_cuenta');
    expect([banco.source, banco.fillLabel]).toEqual([{ catalog: 'tablas-detalle-sunat', where: { id_tabla_sunat: '3' } }, { target: 'descripcion', unless: ['58'] }]);
  });
});

describeRegistryContract(
  'in-browser mock (clientes grids)',
  (slug, ctx) => {
    const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0, seed: withBancos(seed) });
    return { catalog: mock.catalog(slug), lookup: mock.lookup };
  },
  CLIENTE_GRID_CASES,
);
const server = useTestServer({ seed: withBancos(loadSeed(dataDir)) });
describeRegistryContract(
  'http mock server (clientes grids)',
  (slug, ctx) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    return { catalog: createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  },
  CLIENTE_GRID_CASES,
);

describe.each([
  ['in-browser mock', () => { const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => WRITER, delayMs: 0, seed: withBancos(seed) }); return { catalog: mock.catalog('clientes'), children: mock.children('clientes') }; }],
  ['http mock server', () => { const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => WRITER }); return { catalog: createCatalogServiceHttp(client, 'clientes'), children: createChildServiceHttp(client, 'clientes') }; }],
])('Cliente nested routes: %s', (_label, make) => {
  it('S-MOCK-39 lists the active and the deactivated direccion and not the deleted one; a deactivated one resolves', async () => {
    const { children } = make();
    expect((await children.list('0000000001', 'direcciones')).items.map((r) => [r.id, r.estado])).toEqual([['1', 'A'], ['2', 'D']]);
    expect(await children.get('0000000001', 'direcciones', '2')).toMatchObject({ estado: 'D', direccion: 'AV. NICOLAS AYLLON 100' });
  });

  it('S-MOCK-40 a nested POST of a contacto is created and listed; an unknown parent or child is a 404', async () => {
    const { children } = make();
    const created = await children.create('0000000002', 'contactos', { paterno: 'luna', materno: 'rios', nombre: 'paola' });
    expect(created).toMatchObject({ paterno: 'LUNA', estado: 'A' });
    expect((await children.list('0000000002', 'contactos')).items.map((r) => r.paterno)).toEqual(['RAMOS', 'LUNA']);
    await expect(children.create('0000000009', 'contactos', { paterno: 'a', materno: 'b', nombre: 'c' })).rejects.toMatchObject({ status: 404 });
    await expect(children.list('0000000001', 'nada')).rejects.toMatchObject({ status: 404 });
  });

  it('S-MOCK-41 DELETE of a direccion deactivates it: the row stays listed with estado D', async () => {
    const { children } = make();
    await children.remove('0000000001', 'direcciones', '1');
    expect((await children.list('0000000001', 'direcciones')).items.map((r) => [r.id, r.estado])).toEqual([['1', 'D'], ['2', 'D']]);
  });

  it('S-MD-3 the cuentas show the banco name the client sent and the OTROS one', async () => {
    const { children } = make();
    expect((await children.list('0000000001', 'cuentas')).items.map((r) => [r.id_cuenta, r.descripcion, r.num_cuenta])).toEqual([['56', 'BANCO DE CREDITO DEL PERU', '19123456789012'], ['58', 'CAJA RURAL SUR', '0011223344']]);
  });
});

/** The same data with IS_DIRECCION_CLIENTE off for `demo`: the zona becomes required (S-MST-22). */
const withoutParam = (base: any) => withBancos({ ...base, params: { ...base.params, demo: { ...base.params.demo, IS_DIRECCION_CLIENTE: false } } });
const offServer = useTestServer({ seed: withoutParam(loadSeed(dataDir)) });
describe.each([
  ['in-browser mock', () => createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => WRITER, delayMs: 0, seed: withoutParam(seed) }).catalog('clientes')],
  ['http mock server', () => createCatalogServiceHttp(createHttpClient({ baseUrl: offServer.url(), getSession: session, getRequestContext: () => WRITER }), 'clientes')],
])('S-MST-22 with IS_DIRECCION_CLIENTE false: %s', (_label, make) => {
  const body = (zona: Record<string, unknown>) => ({ id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme sac', id_clasif_cliente: '1', children: { direcciones: [{ op: 'I', id_ubigeo: '150101', direccion: 'AV LIMA 1', ...zona }] } });

  it('a direccion with no zona says Debes Seleccionar una Zona. on the indexed field', async () => {
    await expect(make().create(body({}))).rejects.toMatchObject({ status: 422, details: [{ field: 'direcciones[0].id_zona', message: 'Debes Seleccionar una Zona.' }] });
  });

  it('with a zona of the distrito it is stored', async () => {
    await expect(make().create(body({ id_zona: '1' }))).resolves.toMatchObject({ id_cliente: '0000000005' });
  });

  it('the order is distrito, zona, direccion', async () => {
    await expect(make().create(body({ direccion: '' }))).rejects.toMatchObject({ details: [{ field: 'direcciones[0].id_zona' }] });
  });
});
