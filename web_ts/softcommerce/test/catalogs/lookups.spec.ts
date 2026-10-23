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
const LOOKUP_CASES: CatalogCase[] = [
  { name: 'familias-sunat S-REG-14 create is 405 METHOD_NOT_ALLOWED', slug: 'familias-sunat', steps: [{ op: 'create', body: { descripcion: 'X' } }], expect: notAllowed },
  { name: 'familias-sunat S-REG-14 update is 405 METHOD_NOT_ALLOWED', slug: 'familias-sunat', steps: [{ op: 'update', id: '5010', body: { descripcion: 'X' } }], expect: notAllowed },
  { name: 'familias-sunat S-REG-14 remove is 405 and the row stays', slug: 'familias-sunat', steps: [{ op: 'remove', id: '5010' }, { op: 'get', id: '5010' }], expect: { ok: true, match: { activo: true } } },
  { name: 'familias-sunat S-REG-14 remove answers 405', slug: 'familias-sunat', steps: [{ op: 'remove', id: '5010' }], expect: notAllowed },
  { name: 'familias-sunat S-MOCK-15 lists the active rows without any session context', slug: 'familias-sunat', steps: [{ op: 'list' }], expect: { ok: true, total: 5 } },
  { name: 'familias-sunat S-MOCK-15 get resolves a retired row', slug: 'familias-sunat', steps: [{ op: 'get', id: '9999' }], expect: { ok: true, match: { activo: false } } },
  { name: 'familias-sunat options carry the SUNAT code as id and the description as name', slug: 'familias-sunat', steps: [{ op: 'options' }], expect: { ok: true, items: FAMILIAS_SUNAT } },
  { name: `${SUBS} S-REG-14 create is 405 METHOD_NOT_ALLOWED`, slug: SUBS, steps: [{ op: 'create', body: { descripcion: 'X' } }], expect: notAllowed },
  { name: `${SUBS} S-REG-14 update is 405 METHOD_NOT_ALLOWED`, slug: SUBS, steps: [{ op: 'update', id: '501015', body: { descripcion: 'X' } }], expect: notAllowed },
  { name: `${SUBS} S-REG-14 remove is 405 and the row stays`, slug: SUBS, steps: [{ op: 'remove', id: '501015' }], expect: notAllowed },
  { name: `${SUBS} S-MOCK-15 lists the active rows without any session context`, slug: SUBS, steps: [{ op: 'list' }], expect: { ok: true, total: 11 } },
  { name: `${SUBS} S-MOCK-15 get resolves a retired row`, slug: SUBS, steps: [{ op: 'get', id: '999901' }], expect: { ok: true, match: { activo: false } } },
  { name: `${SUBS} options carry the SUNAT code as id and the description as name`, slug: SUBS, steps: [{ op: 'options', filters: { id_familia: '001' } }], expect: { ok: true, items: SUBFAMILIAS_SUNAT_FRUTAS } },
  { name: `${SUBS} S-MOCK-30 via: the options of a familia are keyed by its SUNAT code`, slug: SUBS, steps: [{ op: 'options', filters: { id_familia: '002' } }], expect: { ok: true, items: [{ id: '501315', name: 'LECHE Y CREMA' }, { id: '501316', name: 'HUEVOS' }] } },
  { name: `${SUBS} S-MOCK-30 via: a familia without a SUNAT code has no options`, slug: SUBS, steps: [{ op: 'options', filters: { id_familia: '003' } }], expect: { ok: true, items: [] } },
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

describe('S-REG-18 a shared lookup is one global dataset', () => {
  const seed = loadSeed(dataDir);

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

  it('every tenant sees the same rows', () => {
    const store = createStore(seed);
    const rowsOf = (tenant: string) => listCatalog(store, tenant, 'familias-sunat').items;
    expect(rowsOf('demo')).toEqual(rowsOf('botica'));
    expect(rowsOf('botica')).toHaveLength(5);
  });
});
