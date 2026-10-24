import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import menu from '../../mock-server/data/menu.json';
import permissions from '../../mock-server/data/permissions.json';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { seed } from '../../src/services/mock/seed';
import { ITEM_CASES } from './items.cases';
import { describeRegistryContract } from './registryContract';

const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const WRITER = { userId: '7', empresaId: '1' };
const entry = REGISTRY.bySlug.get('items');
const field = (name: string) => entry.fields.find((f: any) => f.name === name);

describe('R-MST-1 / R-MST-14 the items entry', () => {
  it('is the Item master: formId miProducto, Datos de Item, empresa scope, no clone (S-MST-1), code of six', () => {
    expect([entry.formId, entry.title, entry.entity, entry.modes, entry.scope, entry.codeWidth, entry.generalTab]).toEqual(['miProducto', 'Item', 'un Item', ['INSERT', 'UPDATE', 'DELETE', 'DETAIL'], 'empresa', 6, 'Datos de Item']);
  });

  it('hangs under Generales with the menu node and the grant of the formId (R-REG-19), without clone', () => {
    expect(entry.menu).toEqual({ parent: 'mnGenerales', label: 'Item' });
    expect((menu as any[]).find((n) => n.nombre === 'miProducto')).toMatchObject({ descripcion: 'Item', menu_item: 'S' });
    expect((permissions as any).miProducto).toMatchObject({ add: true, modify: true, eliminate: true, clone: false, details: true });
  });

  it('checks the five required fields in the order of isRegisterValid, then the units that follow the stock', () => {
    expect(entry.validation.slice(0, 7)).toEqual(['id_alterno', 'id_familia', 'id_marca', 'descripcion', 'id_um_stock', 'id_um_compra', 'id_um_venta']);
    expect(entry.validation.at(-1)).toEqual({ unique: 0 });
  });

  it('D27b the derived fields are read-only in every mode and follow their source', () => {
    for (const name of ['id_um_compra', 'id_um_venta', 'kardex', 'serv_transporte', 'flag_percepcion', 'por_perc']) expect(field(name).readOnlyOn).toEqual(['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE']);
    expect([field('id_um_compra').follows, field('id_um_venta').follows]).toEqual([{ field: 'id_um_stock' }, { field: 'id_um_stock' }]);
    expect(field('por_igv')).toMatchObject({ default: '$params.PORC_IGV', enabledWhen: { field: 'afecto_igv', in: ['AFECTO'] }, follows: { field: 'afecto_igv', otherwise: 0 } });
  });

  it('the prices are gated by IS_ITEM_RESUMEN_PRECIO and the botica fields by ISBOTICA or IS_BOTICA_SIN_LOTE (R-REG-17)', () => {
    expect(entry.fields.filter((f: any) => f.name.startsWith('precio_')).map((f: any) => f.gate)).toEqual(Array(6).fill({ param: 'IS_ITEM_RESUMEN_PRECIO' }));
    expect([field('composicion').gate, field('funcion').gate]).toEqual(Array(2).fill({ param: 'ISBOTICA', or: ['IS_BOTICA_SIN_LOTE'] }));
  });
});

describeRegistryContract(
  'in-browser mock (items)',
  (slug, ctx) => {
    const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 });
    return { catalog: mock.catalog(slug), lookup: mock.lookup };
  },
  ITEM_CASES,
);

const server = useTestServer({ seed: loadSeed(dataDir) });
describeRegistryContract(
  'http mock server (items)',
  (slug, ctx) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    return { catalog: createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  },
  ITEM_CASES,
);

/** The same data with the Item parameters of `demo` changed (demo ships the prices on and the botica fields off). */
const withParams = (base: any, params: Record<string, unknown>) => ({ ...base, params: { ...base.params, demo: { ...base.params.demo, ...params } } });
const BODY = { id_alterno: 'zz-1', id_familia: '001', id_marca: '001', descripcion: 'arroz extra', id_um_stock: '001', precio_sol_publico: 4, composicion: 'paracetamol', funcion: 'analgesico' };
const VARIANTS: [string, Record<string, unknown>, Record<string, unknown>][] = [
  ['demo: prices on, botica fields off', {}, { precio_sol_publico: 4, precio_dol_mayor: 0, composicion: undefined, funcion: undefined }],
  ['prices off', { IS_ITEM_RESUMEN_PRECIO: false }, { precio_sol_publico: undefined, precio_dol_mayor: undefined, composicion: undefined }],
  ['ISBOTICA on', { ISBOTICA: true }, { composicion: 'PARACETAMOL', funcion: 'ANALGESICO' }],
  ['IS_BOTICA_SIN_LOTE on', { IS_BOTICA_SIN_LOTE: true }, { composicion: 'PARACETAMOL', funcion: 'ANALGESICO' }],
];
const servers = VARIANTS.map(([, params]) => useTestServer({ seed: withParams(loadSeed(dataDir), params) }));
describe.each(VARIANTS.map((variant, index) => ({ variant, index })))('S-MST-31 / R-MST-14 the parameter gates: $variant.0', ({ variant: [, params, expected], index }) => {
  const make = (kind: 'mock' | 'http') =>
    kind === 'mock'
      ? createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => WRITER, delayMs: 0, seed: withParams(seed, params) }).catalog('items')
      : createCatalogServiceHttp(createHttpClient({ baseUrl: servers[index].url(), getSession: session, getRequestContext: () => WRITER }), 'items');

  it.each(['mock', 'http'] as const)('%s: a closed field is left out of the body, stored nowhere and not returned', async (kind) => {
    const created = (await make(kind).create(BODY)) as Record<string, unknown>;
    expect(Object.fromEntries(Object.keys(expected).map((key) => [key, created[key]]))).toEqual(expected);
  });
});
