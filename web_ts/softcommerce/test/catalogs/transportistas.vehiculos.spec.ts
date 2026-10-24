import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { ApiError } from '../../src/services/ApiError';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createChildServiceHttp } from '../../src/services/ChildServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import type { InterCatalogService } from '../../src/services/InterCatalogService';
import type { InterChildService } from '../../src/services/InterChildService';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';

/**
 * The Transportista `Vehiculos` child is a view of the W2 `vehiculos` store (R-MST-5, R-MST-6, S-REG-30, S-MST-11, S-MD-3, S-MD-6), checked on both sources.
 * Seeded: vehiculos 001 and 002 belong to the transportista 1, 003 to the transportista 2, 004 is retired and has no propietario.
 */
const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const WRITER = { userId: '7' };
const KEY = 'id_anexo_empresa_transportista';
const T1 = '0000000001';
const T2 = '0000000002';
const body = (over: Record<string, unknown> = {}) => ({ placa: 'nueva1', constancia_inscripcion: 'ci-1', peso: 900, id_marca: '001', id_modelo: '001', ...over });

type Services = { transportistas: InterCatalogService<Record<string, any>>; vehiculos: InterCatalogService<Record<string, any>>; children: InterChildService };
const failure = async (promise: Promise<unknown>): Promise<ApiError> => {
  try {
    await promise;
  } catch (e) {
    return e as ApiError;
  }
  throw new Error('expected the call to fail');
};

describe('S-REG-30 the registry declares the Vehiculo child as a store view', () => {
  const child = REGISTRY.bySlug.get('transportistas/vehiculos');

  it('is an inline delete child over the vehiculos store keyed by the propietario, with no seed or section of its own', () => {
    expect(child).toMatchObject({ parent: 'transportistas', parentKey: KEY, section: 'vehiculos', idKey: 'id_vehiculo', seed: null, store: { entry: 'vehiculos', key: KEY }, entry: 'inline', removal: 'delete', tab: 'Vehiculo' });
  });

  it('shows the five entry fields of the desktop in its order, each with its Agregar sentence (S-MST-10)', () => {
    expect(child.entryFields).toEqual(['constancia_inscripcion', 'placa', 'peso', 'id_marca', 'id_modelo']);
    expect(child.steps.slice(0, 5)).toEqual(['constancia_inscripcion', 'placa', 'peso', 'id_marca', 'id_modelo']);
    const said = (name: string) => child.fields.find((f: any) => f.name === name).message;
    expect(['constancia_inscripcion', 'placa', 'peso', 'id_marca', 'id_modelo'].map(said)).toEqual(['Ingrese Constancia', 'Ingrese Placa', 'Ingrese Peso', 'Seleccione Marca', 'Seleccione Modelo']);
  });

  it('lists CODIGO, PLACA, CONSTANCIA INSCRIPCION, MARCA and MODELO like the desktop grid (the id and propietario columns are hidden)', () => {
    expect(child.columns.map((c: any) => c.header)).toEqual(['CODIGO', 'PLACA', 'CONSTANCIA INSCRIPCION', 'MARCA', 'MODELO']);
  });

  it('the W2 vehiculos entry and its messages are untouched', () => {
    const owner = REGISTRY.bySlug.get('vehiculos');
    expect(owner.steps.slice(0, 5)).toEqual(['placa', 'constancia_inscripcion', 'peso', 'id_marca', 'id_modelo']);
    expect(owner.fields.find((f: any) => f.name === 'placa').message).toBeUndefined();
  });
});

function describeStore(label: string, make: () => Services): void {
  describe(`Transportista Vehiculos shared store: ${label}`, () => {
    const grid = async (services: Services, id: string) => (await services.children.list(id, 'vehiculos')).items.map((r) => r.id_vehiculo);
    const w2 = async (services: Services) => (await services.vehiculos.list({})).items as Record<string, any>[];

    it('the nested list is the vehiculos whose propietario is that transportista, with the joined marca and modelo', async () => {
      const services = make();
      expect(await grid(services, T1)).toEqual(['001', '002']);
      expect(await grid(services, T2)).toEqual(['003']);
      expect((await services.children.list(T1, 'vehiculos')).items[0]).toMatchObject({ placa: 'ABC123', marca: 'TOYOTA', modelo: 'HILUX' });
    });

    it('S-MST-11 a vehiculo created in the grid of T carries T as propietario and shows in the W2 list', async () => {
      const services = make();
      const created = await services.children.create<Record<string, any>>(T1, 'vehiculos', body());
      expect(created).toMatchObject({ [KEY]: T1, placa: 'NUEVA1', estado: true });
      expect(await grid(services, T1)).toEqual(['001', '002', created.id_vehiculo]);
      expect((await w2(services)).find((r) => r.id_vehiculo === created.id_vehiculo)).toMatchObject({ transportista: 'TRANSPORTES RAPIDO SAC', [KEY]: T1 });
    });

    it('S-MST-11 a vehiculo created in the W2 screen with propietario T appears in the grid of T; one with no propietario appears in no grid', async () => {
      const services = make();
      const owned = await services.vehiculos.create(body({ placa: 'own777', [KEY]: T2 }));
      const free = await services.vehiculos.create(body({ placa: 'free88' }));
      expect(await grid(services, T2)).toEqual(['003', owned.id_vehiculo]);
      for (const id of [T1, T2, '0000000003']) expect(await grid(services, id)).not.toContain(free.id_vehiculo);
    });

    it('S-MD-3 a vehiculo deleted from the W2 screen never shows in the grid', async () => {
      const services = make();
      await services.vehiculos.remove('002');
      expect(await grid(services, T1)).toEqual(['001']);
    });

    it('S-MD-6 a persisted vehiculo removed in the register is deleted on save: the composite E op', async () => {
      const services = make();
      await services.transportistas.update(T1, { children: { vehiculos: [{ op: 'E', id: '001' }, { op: 'I', ...body({ placa: 'swap99' }) }] } });
      expect((await grid(services, T1)).includes('001')).toBe(false);
      expect((await services.children.list(T1, 'vehiculos')).items.map((r) => r.placa)).toEqual(['XYZ789', 'SWAP99']);
      expect((await w2(services)).map((r) => r.id_vehiculo)).not.toContain('001');
    });

    it('the nested write uses the desktop Agregar sentences and the W2 limits', async () => {
      const services = make();
      const said = async (over: Record<string, unknown>) => (await failure(services.children.create(T1, 'vehiculos', body(over)))).details.map((d) => [d.field, d.message]);
      expect(await said({ constancia_inscripcion: ' ' })).toEqual([['constancia_inscripcion', 'Ingrese Constancia']]);
      expect(await said({ placa: ' ', constancia_inscripcion: ' ' })).toEqual([['constancia_inscripcion', 'Ingrese Constancia']]);
      expect(await said({ placa: ' ' })).toEqual([['placa', 'Ingrese Placa']]);
      expect(await said({ peso: '' })).toEqual([['peso', 'Ingrese Peso']]);
      expect(await said({ id_marca: '' })).toEqual([['id_marca', 'Seleccione Marca']]);
      expect(await said({ id_modelo: '' })).toEqual([['id_modelo', 'Seleccione Modelo']]);
      expect(await said({ id_marca: '003' })).toEqual([['id_marca', 'id_marca does not exist']]);
    });

    it('the W2 route keeps its own sentences', async () => {
      const services = make();
      const error = await failure(services.vehiculos.create(body({ placa: ' ' })));
      expect(error.details.map((d) => d.message)).toEqual(['Para agregar, debes especificar su Placa.']);
    });

    it('a deactivated transportista still takes a vehiculo in its grid (the parent key is not ref-checked)', async () => {
      const services = make();
      const created = await services.children.create<Record<string, any>>('0000000003', 'vehiculos', body({ placa: 'cierre1' }));
      expect(created[KEY]).toBe('0000000003');
    });
  });
}

describeStore('in-browser mock', () => {
  const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => WRITER, delayMs: 0 });
  return { transportistas: mock.catalog('transportistas'), vehiculos: mock.catalog('vehiculos'), children: mock.children('transportistas') };
});

const server = useTestServer({ seed: loadSeed(dataDir) });
describeStore('http mock server', () => {
  const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => WRITER });
  return { transportistas: createCatalogServiceHttp(client, 'transportistas'), vehiculos: createCatalogServiceHttp(client, 'vehiculos'), children: createChildServiceHttp(client, 'transportistas') };
});
