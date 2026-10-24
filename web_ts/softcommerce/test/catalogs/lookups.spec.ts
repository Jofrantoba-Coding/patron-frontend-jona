import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { listCatalog } from '../../mock-server/core/catalog.js';
import { createStore } from '../../mock-server/core/store.js';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import type { CatalogCase } from './cases';
import { describeRegistryContract } from './registryContract';

const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const notAllowed = { status: 405, code: 'METHOD_NOT_ALLOWED' };

// R-REF-11 read-only seeded lookups: the table runs against the in-browser mock and the HTTP mock (R-REF-13).
const FAMILIAS_SUNAT = [
  { id: '5010', name: 'FRUTAS Y VERDURAS FRESCAS' },
  { id: '5011', name: 'CARNES Y AVES' },
  { id: '5013', name: 'LACTEOS Y HUEVOS' },
  { id: '5018', name: 'PANADERIA Y PASTELERIA' },
  { id: '5020', name: 'BEBIDAS' },
];
// subfamilias-sunat (RegisterSubFamilia.loadSubFamiliaSunat): the options of a familia are the SUNAT rows keyed by that familia's SUNAT code.
const SUBFAMILIAS_SUNAT_FRUTAS = [{ id: '501015', name: 'FRUTAS FRESCAS' }, { id: '501016', name: 'VERDURAS FRESCAS' }, { id: '501017', name: 'TUBERCULOS Y RAICES' }];
const SUBS = 'subfamilias-sunat';
// monedas (DaoMoneda.listarMoneda, R-REF-11): the read-only list behind the Moneda select of a Tipo de Cambio; ids are 5-digit strings (MonedaEnum 00001, 00004).
const MONEDAS = [{ id: '00001', name: 'SOLES' }, { id: '00004', name: 'DOLAR AMERICANO' }, { id: '00005', name: 'EURO' }];
// tipos-doc-venta (RegisterCorrelativo.loadTipoDocumento, R-REF-11): the read-only list behind the Tipo de Documento select; ids are the SUNAT codes.
const TIPOS = { '01': 'FACTURA', '03': 'BOLETA DE VENTA', TI: 'TICKET', '07': 'NOTA DE CREDITO', '08': 'NOTA DE DEBITO', '09': 'GUIA DE REMISION REMITENTE' };
const TIPOS_ITEMS = Object.entries(TIPOS).map(([id, name]) => ({ id, name }));
const TDV = 'tipos-doc-venta';
// tablas-sunat / tablas-detalle-sunat (RegisterUnidadMedida.loadTablaSunat, loadTablaDetalleSunat; R-REF-11): the tabla shows as `nombre - descripcion`, its detail as the description.
const TS = 'tablas-sunat';
const TD = 'tablas-detalle-sunat';
const TABLAS = [
  [1, 'TABLA 1 - TIPO DE COMPROBANTE DE PAGO O DOCUMENTO'], [2, 'TABLA 2 - TIPO DE MONEDA'], [3, 'TABLA 3 - TIPO DE DOCUMENTO DE IDENTIDAD'], [4, 'TABLA 4 - MEDIOS DE PAGO'],
  [5, 'TABLA 5 - TIPO DE EXISTENCIA'], [6, 'TABLA 6 - UNIDAD DE MEDIDA'], [12, 'TABLA 12 - TIPO DE OPERACION'],
].map(([id, name]) => ({ id: String(id), name: String(name) }));
const UNIDADES = ['UNIDAD (BIENES)', 'KILOGRAMO', 'LITRO', 'METRO', 'UNIDAD (SERVICIOS)', 'CAJA'];
// tipos-doc-iden (RegisterChofer.loadTipoDocIden = listarTipoDocIden("", "A", "S"), R-REF-11): the combo shows the abreviatura; the id is the code (`01` DNI, `05` RUC).
const TDI = 'tipos-doc-iden';
const TDI_OPTIONS = [{ id: '00', name: 'SD' }, { id: '01', name: 'DNI' }, { id: '04', name: 'CE' }, { id: '05', name: 'RUC' }, { id: '06', name: 'PAS' }];
const LOOKUP_CASES: CatalogCase[] = [
  { name: `${TDI} S-REF-35 create is 405 METHOD_NOT_ALLOWED`, slug: TDI, steps: [{ op: 'create', body: { descripcion: 'X' } }], expect: notAllowed },
  { name: `${TDI} S-REF-35 update is 405 METHOD_NOT_ALLOWED`, slug: TDI, steps: [{ op: 'update', id: '01', body: { descripcion: 'X' } }], expect: notAllowed },
  { name: `${TDI} S-REF-35 remove is 405 and the row stays`, slug: TDI, steps: [{ op: 'remove', id: '01' }, { op: 'get', id: '01' }], expect: { ok: true, match: { activo: true } } },
  { name: `${TDI} S-REF-35 lists the active rows without any session context`, slug: TDI, steps: [{ op: 'list' }], expect: { ok: true, total: 5 } },
  { name: `${TDI} S-MOCK-15 get resolves a retired row`, slug: TDI, steps: [{ op: 'get', id: '99' }], expect: { ok: true, match: { activo: false } } },
  { name: `${TDI} S-REF-35 get carries the persona and estado flags`, slug: TDI, steps: [{ op: 'get', id: '06' }], expect: { ok: true, match: { abreviatura: 'PAS', persona: true, estado: false } } },
  { name: `${TDI} the options are named by the abreviatura, ids are the codes`, slug: TDI, steps: [{ op: 'options' }], expect: { ok: true, items: TDI_OPTIONS } },
  { name: 'familias-sunat S-REG-14 create is 405 METHOD_NOT_ALLOWED', slug: 'familias-sunat', steps: [{ op: 'create', body: { descripcion: 'X' } }], expect: notAllowed },
  { name: 'familias-sunat S-REG-14 update is 405 METHOD_NOT_ALLOWED', slug: 'familias-sunat', steps: [{ op: 'update', id: '5010', body: { descripcion: 'X' } }], expect: notAllowed },
  { name: 'familias-sunat S-REG-14 remove is 405 and the row stays', slug: 'familias-sunat', steps: [{ op: 'remove', id: '5010' }, { op: 'get', id: '5010' }], expect: { ok: true, match: { activo: true } } },
  { name: 'familias-sunat S-REG-14 remove answers 405', slug: 'familias-sunat', steps: [{ op: 'remove', id: '5010' }], expect: notAllowed },
  { name: 'familias-sunat S-MOCK-15 lists the active rows without any session context', slug: 'familias-sunat', steps: [{ op: 'list' }], expect: { ok: true, total: 5 } },
  { name: 'familias-sunat S-MOCK-15 get resolves a retired row', slug: 'familias-sunat', steps: [{ op: 'get', id: '9999' }], expect: { ok: true, match: { activo: false } } },
  { name: 'familias-sunat options carry the SUNAT code as id and the description as name', slug: 'familias-sunat', steps: [{ op: 'options' }], expect: { ok: true, items: FAMILIAS_SUNAT } },
  { name: 'monedas S-MOCK-29 create is 405 METHOD_NOT_ALLOWED', slug: 'monedas', steps: [{ op: 'create', body: { descripcion: 'X' } }], expect: notAllowed },
  { name: 'monedas S-MOCK-29 update is 405 METHOD_NOT_ALLOWED', slug: 'monedas', steps: [{ op: 'update', id: '00004', body: { descripcion: 'X' } }], expect: notAllowed },
  { name: 'monedas S-MOCK-29 remove is 405 METHOD_NOT_ALLOWED', slug: 'monedas', steps: [{ op: 'remove', id: '00004' }], expect: notAllowed },
  { name: 'monedas S-REF-35 lists the active rows without any session context', slug: 'monedas', steps: [{ op: 'list' }], expect: { ok: true, total: 3 } },
  { name: 'monedas S-MOCK-15 get resolves a retired row', slug: 'monedas', steps: [{ op: 'get', id: '00009' }], expect: { ok: true, match: { activo: false } } },
  { name: 'monedas options carry the id and the description as name', slug: 'monedas', steps: [{ op: 'options' }], expect: { ok: true, items: MONEDAS } },
  { name: `${SUBS} S-REG-14 create is 405 METHOD_NOT_ALLOWED`, slug: SUBS, steps: [{ op: 'create', body: { descripcion: 'X' } }], expect: notAllowed },
  { name: `${SUBS} S-REG-14 update is 405 METHOD_NOT_ALLOWED`, slug: SUBS, steps: [{ op: 'update', id: '501015', body: { descripcion: 'X' } }], expect: notAllowed },
  { name: `${SUBS} S-REG-14 remove is 405 and the row stays`, slug: SUBS, steps: [{ op: 'remove', id: '501015' }], expect: notAllowed },
  { name: `${SUBS} S-MOCK-15 lists the active rows without any session context`, slug: SUBS, steps: [{ op: 'list' }], expect: { ok: true, total: 11 } },
  { name: `${SUBS} S-MOCK-15 get resolves a retired row`, slug: SUBS, steps: [{ op: 'get', id: '999901' }], expect: { ok: true, match: { activo: false } } },
  { name: `${SUBS} options carry the SUNAT code as id and the description as name`, slug: SUBS, steps: [{ op: 'options', filters: { id_familia: '001' } }], expect: { ok: true, items: SUBFAMILIAS_SUNAT_FRUTAS } },
  { name: `${SUBS} S-MOCK-30 via: the options of a familia are keyed by its SUNAT code`, slug: SUBS, steps: [{ op: 'options', filters: { id_familia: '002' } }], expect: { ok: true, items: [{ id: '501315', name: 'LECHE Y CREMA' }, { id: '501316', name: 'HUEVOS' }] } },
  { name: `${SUBS} S-MOCK-30 via: a familia without a SUNAT code has no options`, slug: SUBS, steps: [{ op: 'options', filters: { id_familia: '003' } }], expect: { ok: true, items: [] } },
  { name: `${TDV} S-MOCK-29 create is 405 METHOD_NOT_ALLOWED`, slug: TDV, steps: [{ op: 'create', body: { descripcion: 'X' } }], expect: notAllowed },
  { name: `${TDV} S-MOCK-29 update is 405 METHOD_NOT_ALLOWED`, slug: TDV, steps: [{ op: 'update', id: '01', body: { descripcion: 'X' } }], expect: notAllowed },
  { name: `${TDV} S-MOCK-29 remove is 405 and the row stays`, slug: TDV, steps: [{ op: 'remove', id: '01' }], expect: notAllowed },
  { name: `${TDV} S-MOCK-15 lists the active rows without any session context`, slug: TDV, steps: [{ op: 'list' }], expect: { ok: true, total: 6 } },
  { name: `${TDV} S-MOCK-15 get resolves a retired row`, slug: TDV, steps: [{ op: 'get', id: 'NI' }], expect: { ok: true, match: { activo: false } } },
  { name: `${TDV} R-REF-11 the options include TI, 01 and 03, with the SUNAT code as id`, slug: TDV, steps: [{ op: 'options' }], expect: { ok: true, items: TIPOS_ITEMS } },
  { name: `${TDV} S-MOCK-30 exists: punto de venta 1 offers only the types with an active correlativo in it (the inactive boleta does not count)`, slug: TDV, steps: [{ op: 'options', filters: { id_punto_venta: '1' } }], expect: { ok: true, items: [{ id: '01', name: 'FACTURA' }, { id: 'TI', name: 'TICKET' }] } },
  { name: `${TDV} S-MOCK-30 exists: punto de venta 2 offers its own factura only`, slug: TDV, steps: [{ op: 'options', filters: { id_punto_venta: '2' } }], expect: { ok: true, items: [{ id: '01', name: 'FACTURA' }] } },
  { name: `${TDV} S-MOCK-30 exists: a deleted correlativo does not count`, slug: TDV, steps: [{ op: 'options', filters: { id_punto_venta: '3' } }], expect: { ok: true, items: [] } },
  { name: `${TDV} S-MOCK-30 exists: an unknown punto de venta has no options, not an error`, slug: TDV, steps: [{ op: 'options', filters: { id_punto_venta: 'zzz' } }], expect: { ok: true, items: [] } },
  { name: `${TS} S-MOCK-29 create is 405 METHOD_NOT_ALLOWED`, slug: TS, steps: [{ op: 'create', body: { nombre: 'X', descripcion: 'X' } }], expect: notAllowed },
  { name: `${TS} S-MOCK-29 update is 405 METHOD_NOT_ALLOWED`, slug: TS, steps: [{ op: 'update', id: '6', body: { nombre: 'X' } }], expect: notAllowed },
  { name: `${TS} S-MOCK-29 remove is 405 METHOD_NOT_ALLOWED`, slug: TS, steps: [{ op: 'remove', id: '6' }], expect: notAllowed },
  { name: `${TS} S-REF-35 lists the seven active rows without any session context`, slug: TS, steps: [{ op: 'list' }], expect: { ok: true, total: 7 } },
  { name: `${TS} S-MOCK-15 get resolves a retired row`, slug: TS, steps: [{ op: 'get', id: '99' }], expect: { ok: true, match: { activo: false } } },
  { name: `${TS} R-REF-11 the options show nombre - descripcion with the numeric id`, slug: TS, steps: [{ op: 'options' }], expect: { ok: true, items: TABLAS } },
  { name: `${TD} S-MOCK-29 create is 405 METHOD_NOT_ALLOWED`, slug: TD, steps: [{ op: 'create', body: { descripcion: 'X' } }], expect: notAllowed },
  { name: `${TD} S-MOCK-29 update is 405 METHOD_NOT_ALLOWED`, slug: TD, steps: [{ op: 'update', id: '4', body: { descripcion: 'X' } }], expect: notAllowed },
  { name: `${TD} S-MOCK-29 remove is 405 and the row stays`, slug: TD, steps: [{ op: 'remove', id: '4' }], expect: notAllowed },
  { name: `${TD} S-REF-35 lists the seventeen active rows without any session context`, slug: TD, steps: [{ op: 'list' }], expect: { ok: true, total: 17 } },
  { name: `${TD} S-MOCK-29 ?id_tabla_sunat=6 returns only the detail rows of that tabla`, slug: TD, steps: [{ op: 'list', filters: { id_tabla_sunat: '6' } }], expect: { ok: true, total: 6, match: { items: UNIDADES.map((descripcion) => ({ id_tabla_sunat: '6', descripcion })) } } },
  { name: `${TD} S-MOCK-15 get resolves a retired row and joins its tabla`, slug: TD, steps: [{ op: 'get', id: '15' }], expect: { ok: true, match: { activo: false, tabla_sunat: 'TABLA 6' } } },
  { name: `${TD} options of tabla 6 are its units, named by the description`, slug: TD, steps: [{ op: 'options', filters: { id_tabla_sunat: '6' } }], expect: { ok: true, items: UNIDADES.map((name, i) => ({ id: String(i + 4), name })) } },
  { name: `${TD} S-REF-23 tabla 1 has no detail and never returns those of tabla 12 (exact match)`, slug: TD, steps: [{ op: 'options', filters: { id_tabla_sunat: '1' } }], expect: { ok: true, items: [] } },
  { name: `${TD} S-MOCK-30 an unknown tabla has no options, not an error`, slug: TD, steps: [{ op: 'options', filters: { id_tabla_sunat: 'zzz' } }], expect: { ok: true, items: [] } },
  { name: `${SUBS} S-MOCK-30 via: an unknown familia has no options, not an error`, slug: SUBS, steps: [{ op: 'options', filters: { id_familia: '999' } }], expect: { ok: true, items: [] } },
];

describeRegistryContract(
  'in-browser mock (lookups)',
  (slug, ctx) => {
    const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 });
    return { catalog: mock.catalog(slug), lookup: mock.lookup };
  },
  LOOKUP_CASES,
);

const server = useTestServer({ seed: loadSeed(dataDir) });
describeRegistryContract(
  'http mock server (lookups)',
  (slug, ctx) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    return { catalog: createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  },
  LOOKUP_CASES,
);

// A case runs its steps on one catalog, so the filter following the data of ANOTHER catalog is checked here, on both sources.
describe.each([
  ['in-browser mock', (ctx: { userId: string; empresaId: string }) => createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 })],
  ['http mock server', (ctx: { userId: string; empresaId: string }) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    return { catalog: (slug: string) => createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  }],
])('S-MOCK-30 exists follows the correlativos (%s)', (_label, make) => {
  const ctx = { userId: '7', empresaId: '1' };
  const created = { id_tipo_doc: '03', serie: 'B002', correlativo: '1', estado: 'A', id_localidad: '2', id_punto_venta: '2' };

  it('a new correlativo makes its type appear in that punto de venta, and deleting it removes the type again', async () => {
    const services = make(ctx);
    const before = await services.lookup.options(TDV, { id_punto_venta: '2' });
    expect(before).toEqual([{ id: '01', name: 'FACTURA' }]);
    const row: any = await services.catalog('correlativos').create(created);
    expect(await services.lookup.options(TDV, { id_punto_venta: '2' })).toEqual([{ id: '01', name: 'FACTURA' }, { id: '03', name: 'BOLETA DE VENTA' }]);
    await services.catalog('correlativos').remove(String(row.id_correlativo));
    expect(await services.lookup.options(TDV, { id_punto_venta: '2' })).toEqual(before);
  });

  it('an inactive (estado I) correlativo does not offer its type', async () => {
    const services = make(ctx);
    await services.catalog('correlativos').create({ ...created, estado: 'I' });
    expect(await services.lookup.options(TDV, { id_punto_venta: '2' })).toEqual([{ id: '01', name: 'FACTURA' }]);
  });
});

describe('S-REG-18 a shared lookup is one global dataset', () => {
  const seed = loadSeed(dataDir);

  it('tipos-doc-iden is declared shared and read-only, with no screen of its own, shown by its abreviatura', () => {
    const entry = REGISTRY.bySlug.get(TDI);
    expect([entry.scope, entry.readOnly, entry.formId, entry.menu, entry.optionLabel, Array.isArray(seed[TDI])]).toEqual(['shared', true, undefined, undefined, 'abreviatura', true]);
  });

  it('R-REF-11 the DNI id is 01 and the RUC id is 05 (the desktop ids), both active persons, and a non-person type is seeded', () => {
    const by = (abreviatura: string) => seed[TDI].find((r: any) => r.abreviatura === abreviatura);
    expect([by('DNI'), by('RUC')].map((r: any) => [r.id_tipo_doc_iden, r.persona, r.estado, r.activo])).toEqual([['01', true, true, true], ['05', true, true, true]]);
    expect(seed[TDI].some((r: any) => r.persona === false && r.activo !== false)).toBe(true);
    expect(seed[TDI].some((r: any) => r.persona === true && r.estado === false && r.activo !== false)).toBe(true);
  });

  it('every tenant sees the same tipos-doc-iden', () => {
    const store = createStore(seed);
    expect(listCatalog(store, 'demo', TDI).items).toEqual(listCatalog(store, 'botica', TDI).items);
    expect(listCatalog(store, 'botica', TDI).items.map((r: any) => r.abreviatura)).toEqual(['SD', 'DNI', 'CE', 'RUC', 'PAS']);
  });

  it('familias-sunat is declared shared and read-only, with no screen of its own', () => {
    const entry = REGISTRY.bySlug.get('familias-sunat');
    expect([entry.scope, entry.readOnly, entry.formId, entry.menu]).toEqual(['shared', true, undefined, undefined]);
  });

  it('its seed is a plain list of rows, not keyed by tenant', () => {
    expect(Array.isArray(seed['familias-sunat'])).toBe(true);
  });

  it('subfamilias-sunat is declared shared and read-only, keyed by the familia SUNAT code of familias-sunat', () => {
    const entry = REGISTRY.bySlug.get(SUBS);
    expect([entry.scope, entry.readOnly, entry.formId, entry.menu]).toEqual(['shared', true, undefined, undefined]);
    expect(entry.lookupFilters).toEqual({ id_familia: { via: { catalog: 'familias', key: 'id_familia_sunat', as: 'codigo_familia' } } });
    expect(Array.isArray(seed[SUBS])).toBe(true);
  });

  it('every subfamilia SUNAT row belongs to a demo familias-sunat code (the demo codes align)', () => {
    const familias = new Set(seed['familias-sunat'].map((r: any) => r.codigo));
    expect(seed[SUBS].every((r: any) => familias.has(r.codigo_familia))).toBe(true);
    expect(new Set(seed[SUBS].map((r: any) => r.codigo_familia))).toEqual(familias);
  });

  it('every tenant sees the same subfamilias-sunat rows', () => {
    const store = createStore(seed);
    expect(listCatalog(store, 'demo', SUBS).items).toEqual(listCatalog(store, 'botica', SUBS).items);
    expect(listCatalog(store, 'botica', SUBS).items).toHaveLength(11);
  });

  it('monedas is declared shared and read-only, with no screen of its own and 5-digit ids', () => {
    const entry = REGISTRY.bySlug.get('monedas');
    expect([entry.scope, entry.readOnly, entry.formId, entry.menu, entry.codeWidth]).toEqual(['shared', true, undefined, undefined, 5]);
    expect(Array.isArray(seed.monedas)).toBe(true);
  });

  it('S-MOCK-38 every tenant sees the same monedas, DOLAR AMERICANO among them', () => {
    const store = createStore(seed);
    expect(listCatalog(store, 'demo', 'monedas').items).toEqual(listCatalog(store, 'botica', 'monedas').items);
    expect(listCatalog(store, 'botica', 'monedas').items.map((r: any) => r.descripcion)).toEqual(['SOLES', 'DOLAR AMERICANO', 'EURO']);
  });

  it('tipos-doc-venta is declared shared and read-only, with no screen, and filters by an exists rule over the correlativos', () => {
    const entry = REGISTRY.bySlug.get(TDV);
    expect([entry.scope, entry.readOnly, entry.formId, entry.menu]).toEqual(['shared', true, undefined, undefined]);
    expect(entry.lookupFilters).toEqual({ id_punto_venta: { exists: { catalog: 'correlativos', local: 'id_tipo_doc', where: { estado: 'A' } } } });
    expect(Array.isArray(seed[TDV])).toBe(true);
  });

  it('every tenant sees the same tipos-doc-venta, and they include TI, 01 and 03', () => {
    const store = createStore(seed);
    expect(listCatalog(store, 'demo', TDV).items).toEqual(listCatalog(store, 'botica', TDV).items);
    expect(listCatalog(store, 'botica', TDV).items.map((r: any) => r.id_tipo_doc)).toEqual(expect.arrayContaining(['TI', '01', '03']));
  });

  it('tablas-sunat and tablas-detalle-sunat are declared shared and read-only, with no screen of their own and unpadded numeric ids', () => {
    for (const slug of [TS, TD]) {
      const entry = REGISTRY.bySlug.get(slug);
      expect([entry.scope, entry.readOnly, entry.formId, entry.menu, entry.codeWidth, Array.isArray(seed[slug])]).toEqual(['shared', true, undefined, undefined, 0, true]);
    }
    expect(REGISTRY.bySlug.get(TS).optionLabel).toEqual(['nombre', 'descripcion']);
    expect(REGISTRY.bySlug.get(TD).refs.map((r: any) => [r.field, r.catalog])).toEqual([['id_tabla_sunat', TS]]);
  });

  it('R-REF-11 at least six tablas are seeded and the 6th is the units table, with its id asserted (UnidadMedida starts on it)', () => {
    expect(seed[TS].length).toBeGreaterThanOrEqual(6);
    expect(seed[TS][5]).toMatchObject({ id_tabla_sunat: '6', nombre: 'TABLA 6', descripcion: 'UNIDAD DE MEDIDA' });
  });

  it('every detail row belongs to a seeded tabla, and the units table has detail rows', () => {
    const ids = new Set(seed[TS].map((r: any) => r.id_tabla_sunat));
    expect(seed[TD].every((r: any) => ids.has(r.id_tabla_sunat))).toBe(true);
    expect(seed[TD].filter((r: any) => r.id_tabla_sunat === '6' && r.activo !== false).length).toBeGreaterThan(0);
  });

  it('every tenant sees the same tablas and the same detail rows', () => {
    const store = createStore(seed);
    for (const slug of [TS, TD]) expect(listCatalog(store, 'demo', slug).items).toEqual(listCatalog(store, 'botica', slug).items);
    expect(listCatalog(store, 'botica', TS).items).toHaveLength(7);
  });

  it('every tenant sees the same rows', () => {
    const store = createStore(seed);
    const rowsOf = (tenant: string) => listCatalog(store, tenant, 'familias-sunat').items;
    expect(rowsOf('demo')).toEqual(rowsOf('botica'));
    expect(rowsOf('botica')).toHaveLength(5);
  });
});
