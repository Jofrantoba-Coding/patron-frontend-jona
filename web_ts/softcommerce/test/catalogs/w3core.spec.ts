import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { tinySeed } from '../../mock-server/core/test-helpers';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { validateRegistry } from '../../mock-server/registry/schema.js';
import { ApiError } from '../../src/services/ApiError';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import type { InterCatalogService } from '../../src/services/InterCatalogService';
import type { InterLookupService } from '../../src/services/InterLookupService';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';

/**
 * R-MOCK-18 / S-MOCK-35 for the W3-1 capabilities: every case runs against the in-browser mock AND the HTTP mock, through the services the UI uses.
 * Part 1 drives a test-only registry (search, joined key filters, lookup kind); part 2 drives the real registry (the four read-only stubs).
 */
type Services = { catalog: <T = any>(slug: string) => InterCatalogService<T>; lookup: InterLookupService };
type Source = { label: string; services: (tenantId: string) => Services };

const text = (name: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label: name, max: 30, ...extra });
const entry = (slug: string, over: Record<string, any> = {}): Record<string, any> => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'un item', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [text('descripcion', { required: true })], columns: [{ key: 'descripcion', header: 'D' }], ...over,
});
const REGISTRY_UNDER_TEST = validateRegistry([
  entry('personas', { optionLabel: 'nombre', search: ['id_personas', 'nombre', 'dni'], fields: [{ name: 'id_personas', kind: 'code', label: 'Codigo' }, text('nombre', { required: true }), text('dni')] }),
  entry('marcas'),
  entry('autos', {
    search: ['placa', 'ciudad', 'marca'],
    fields: [text('placa'), text('ciudad'), { name: 'id_marca', kind: 'select', label: 'Marca', source: { catalog: 'marcas' } }],
    joins: [{ as: 'marca', ref: 'id_marca', display: 'descripcion' }],
  }),
  entry('citas', {
    fields: [
      text('motivo', { required: true }),
      {
        name: 'id_persona', kind: 'lookup', label: 'Persona', required: true, source: { catalog: 'personas' }, search: ['nombre', 'dni'],
        columns: [{ key: 'nombre', header: 'N' }], filters: [{ field: 'nombre', label: 'N', type: 'text' }],
      },
    ],
  }),
]);
const SEED_UNDER_TEST = {
  ...tinySeed(),
  personas: { a: [
    { id_personas: '001', nombre: 'JUAN PEREZ LOPEZ', dni: '40000001', activo: true },
    { id_personas: '002', nombre: 'MARIA GARCIA RAMOS', dni: '40000002', activo: true },
    { id_personas: '003', nombre: 'PEDRO PEREZ SOTO', dni: '40000003', activo: false },
  ] },
  marcas: { a: [{ id_marcas: '1', descripcion: 'TOYOTA', activo: true }, { id_marcas: '2', descripcion: 'HYUNDAI', activo: true }] },
  autos: { a: Array.from({ length: 28 }, (_, i) => ({ id_autos: String(i + 1), placa: `${i < 3 ? 'AB' : 'PL'}-${100 + i}`, ciudad: i < 2 ? 'LIMA' : 'CUSCO', id_marca: i < 25 ? '1' : '2', activo: true })) },
  citas: { a: [{ id_citas: '1', motivo: 'CONSULTA', id_persona: '001', activo: true }] },
};

const session = (tenantId: string) => () => ({ tenantId });
const mockSource = (options: Record<string, any> = {}): Source => ({
  label: 'in-browser mock',
  services: (tenantId) => {
    const mock = createAppServicesMock('exitoso', { getSession: session(tenantId), delayMs: 0, ...options });
    return { catalog: (slug) => mock.catalog(slug), lookup: mock.lookup };
  },
});
const httpSource = (server: { url(): string }): Source => ({
  label: 'http mock server',
  services: (tenantId) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session(tenantId) });
    return { catalog: (slug) => createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  },
});

const failure = async (promise: Promise<unknown>): Promise<ApiError> => {
  try { await promise; } catch (e) { return e as ApiError; }
  throw new Error('expected the call to fail');
};

function describeCore({ label, services }: Source): void {
  describe(`W3-1 search, joined filters and lookup: ${label}`, () => {
    const a = () => services('a');

    it('S-MOCK-45 q matches every term in a search field, active records only', async () => {
      const names = async (q: string) => (await a().catalog('personas').list({ filters: { q } })).items.map((r: any) => r.nombre);
      expect(await names('perez juan')).toEqual(['JUAN PEREZ LOPEZ']);
      expect(await names('perez')).toEqual(['JUAN PEREZ LOPEZ']);
      expect(await names('')).toHaveLength(2);
      expect(await names('%')).toEqual([]);
      expect(await names('.*')).toEqual([]);
    });

    it('S-MOCK-46 a joined display key filters and pages; q combines with it; an unknown key is a 400', async () => {
      const page = await a().catalog('autos').list({ page: 2, pageSize: 10, filters: { marca: 'toy' } });
      expect([page.items.length, page.pagination]).toEqual([10, { page: 2, pageSize: 10, total: 25 }]);
      expect((await a().catalog('autos').list({ filters: { placa: 'ab', q: 'lima' } })).items.map((r: any) => r.placa)).toEqual(['AB-100', 'AB-101']);
      const error = await failure(a().catalog('autos').list({ filters: { nope: 'x' } }));
      expect([error.status, error.code]).toEqual([400, 'INVALID_FILTER']);
    });

    it('S-CRUD-49 server half: the stored lookup shows the description from the join; an inactive or unknown id is a 422 on the field', async () => {
      const citas = a().catalog('citas');
      expect(await citas.get('1')).toMatchObject({ id_persona: '001', persona: 'JUAN PEREZ LOPEZ' });
      expect(await citas.create({ motivo: 'CONTROL', id_persona: '002' })).toMatchObject({ persona: 'MARIA GARCIA RAMOS' });
      for (const id of ['003', '999']) {
        const error = await failure(citas.create({ motivo: 'X', id_persona: id }));
        expect([error.status, error.details.map((d) => d.field)]).toEqual([422, ['id_persona']]);
      }
    });
  });
}

describeCore(mockSource({ registry: REGISTRY_UNDER_TEST, seed: SEED_UNDER_TEST }));
const coreServer = useTestServer({ seed: SEED_UNDER_TEST, registry: REGISTRY_UNDER_TEST });
describeCore(httpSource(coreServer));

function describeStubs({ label, services }: Source): void {
  describe(`S-MOCK-53 read-only stubs: ${label}`, () => {
    const demo = () => services('demo');

    it('GET list and by id return the seed of cuentas-contables, parametros-prov and padrones', async () => {
      const cuentas = demo().catalog('cuentas-contables');
      expect((await cuentas.list()).items.map((r: any) => r.id_cuenta)).toEqual(['1', '2']);
      expect(await cuentas.get('1')).toMatchObject({ cuenta: '1011', descripcion: 'CAJA' });
      const parametros = demo().catalog('parametros-prov');
      expect((await parametros.list()).items.map((r: any) => r.id_parametro_prov)).toEqual(['1', '2', '3']);
      expect(await parametros.get('1')).toMatchObject({ descripcion: 'IGV', tipo: 'C', flag_compra: 'S' });
      const padrones = demo().catalog('padrones');
      expect((await padrones.list()).items.map((r: any) => [r.id_padron, r.descripcion])).toEqual([
        ['01', 'EXCEPTUADO'], ['02', 'AG. RETENCION'], ['03', 'AG. PERCEPCION'], ['04', 'BUEN CONTRIBUYENTE'],
      ]);
      expect(await padrones.get('03')).toMatchObject({ descripcion: 'AG. PERCEPCION' });
      expect(await demo().lookup.options('padrones')).toEqual([
        { id: '01', name: 'EXCEPTUADO' }, { id: '02', name: 'AG. RETENCION' }, { id: '03', name: 'AG. PERCEPCION' }, { id: '04', name: 'BUEN CONTRIBUYENTE' },
      ]);
    });

    it('clases-sunat is shared data and codigo_subfamilia_sunat filters EXACTLY on the list and the lookup', async () => {
      const clases = demo().catalog('clases-sunat');
      expect((await clases.list()).items).toHaveLength(4);
      expect((await clases.list({ filters: { codigo_subfamilia_sunat: '0101' } })).items.map((r: any) => r.id_clase_sunat)).toEqual(['01010101', '01010102']);
      expect((await demo().lookup.options('clases-sunat', { codigo_subfamilia_sunat: '0101' })).map((o) => o.id)).toEqual(['01010101', '01010102']);
      expect((await services('botica').catalog('clases-sunat').list()).items).toHaveLength(4);
    });

    it.each(['cuentas-contables', 'parametros-prov', 'clases-sunat', 'padrones'])('%s answers every write with 405 METHOD_NOT_ALLOWED', async (slug) => {
      const catalog = demo().catalog(slug);
      for (const write of [() => catalog.create({}), () => catalog.update('1', {}), () => catalog.remove('1')]) {
        const error = await failure(write());
        expect([error.status, error.code]).toEqual([405, 'METHOD_NOT_ALLOWED']);
      }
    });
  });
}

describeStubs(mockSource());
const stubServer = useTestServer({ seed: loadSeed(fileURLToPath(new URL('../../mock-server/data', import.meta.url))) });
describeStubs(httpSource(stubServer));
