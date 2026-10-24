import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import menu from '../../mock-server/data/menu.json';
import permissions from '../../mock-server/data/permissions.json';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { ApiError } from '../../src/services/ApiError';
import { createActionServiceHttp } from '../../src/services/ActionServiceHttp';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createChildServiceHttp } from '../../src/services/ChildServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import type { InterActionService } from '../../src/services/InterActionService';
import type { InterCatalogService } from '../../src/services/InterCatalogService';
import type { InterChildService } from '../../src/services/InterChildService';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { describeRegistryContract } from './registryContract';
import { VENDEDOR_CASES } from './vendedores.cases';

/** The Vendedor master (R-MST-9, S-MST-18, S-MST-19, S-ANX-1, S-MOCK-44, S-MD-10): the entry, both sources through the shared contract, and the history. */
const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const WRITER = { userId: '7' };
const entry = REGISTRY.bySlug.get('vendedores');
const field = (name: string) => entry.fields.find((f: any) => f.name === name);
const sale = (n: number) => String(n).padStart(10, '0');

describe('R-MST-1 / R-MST-9 the vendedores entry', () => {
  it('is the anexo Vendedor: formId miVendedor, modes INSERT UPDATE DELETE DETAIL and no CLONE (R-MD-9)', () => {
    expect([entry.formId, entry.title, entry.entity, entry.modes]).toEqual(['miVendedor', 'Vendedor', 'un Vendedor', ['INSERT', 'UPDATE', 'DELETE', 'DETAIL']]);
  });

  it('has the desktop fields, the trabajador lookup that fills the register and the textarea comentario', () => {
    expect(entry.fields.map((f: any) => f.name)).toEqual([
      'id_vendedor', 'id_trabajador', 'nombres', 'direccion', 'id_tipo_doc_iden', 'numero_doc', 'telefono', 'celular', 'id_nacionalidad', 'credito', 'contado', 'comentario', 'estado',
    ]);
    expect(field('id_trabajador')).toMatchObject({
      kind: 'lookup', label: 'Codigo Trab.', readOnlyOn: ['UPDATE'], display: 'trabajador',
      fill: { nombres: 'nombre', direccion: 'direccion', numero_doc: 'dni', telefono: 'telefono', celular: 'celular' }, fillReadOnly: ['nombres', 'direccion', 'numero_doc'],
    });
    expect([field('comentario').kind, field('comentario').max, field('comentario').required]).toEqual(['textarea', 500, undefined]);
  });

  it('opens on DNI, PERUANA, Contado and not Credito; the tipo lists the persona tipos in estado A (S-MST-19)', () => {
    expect([field('id_tipo_doc_iden').default, field('id_nacionalidad').default, field('contado').default, field('credito').default]).toEqual([{ INSERT: '01' }, { INSERT: '001' }, true, false]);
    expect(field('id_tipo_doc_iden').source).toEqual({ catalog: 'tipos-doc-iden', where: { persona: true, estado: true } });
  });

  it('stamps the session user in the tenant, pads the code to ten and files the anexo under "8" (R-ANX-9)', () => {
    expect([entry.scope, entry.stamp, entry.codeWidth, entry.constants]).toEqual(['tenant', ['id_usuario'], 10, { id_tipo_anexo: '8' }]);
    expect(REGISTRY.childEntries.filter((c: any) => c.parent === 'vendedores').map((c: any) => c.tab)).toEqual(['Activación de Vendedor']);
  });

  it('hangs under Generales with the menu node and the 13-flag grant, Eliminar included (R-REG-19)', () => {
    expect(entry.menu).toEqual({ parent: 'mnGenerales', label: 'Vendedor' });
    expect((menu as any[]).find((n) => n.nombre === 'miVendedor')).toMatchObject({ descripcion: 'Vendedor', menu_item: 'S', id_menu_padre: 2 });
    const grant = (permissions as any).miVendedor;
    expect(Object.keys(grant)).toHaveLength(13);
    expect(grant).toMatchObject({ add: true, modify: true, eliminate: true, clone: false, details: true });
  });
});

describeRegistryContract(
  'in-browser mock (vendedores)',
  (slug, ctx) => {
    const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 });
    return { catalog: mock.catalog(slug), lookup: mock.lookup };
  },
  VENDEDOR_CASES,
);

const server = useTestServer({ seed: loadSeed(dataDir) });
describeRegistryContract(
  'http mock server (vendedores)',
  (slug, ctx) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    return { catalog: createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  },
  VENDEDOR_CASES,
);

type Services = { catalog: InterCatalogService<Record<string, any>>; children: InterChildService; actions: InterActionService };
const failure = async (promise: Promise<unknown>): Promise<ApiError> => {
  try {
    await promise;
  } catch (e) {
    return e as ApiError;
  }
  throw new Error('expected the call to fail');
};

function describeServices(label: string, make: () => Services): void {
  describe(`vendedores activation and delete: ${label}`, () => {
    const history = async (services: Services, id: string) => (await services.children.list(id, 'activaciones')).items.map((r) => [r.motivo_activacion, r.estado]);

    it('S-ANX-1 a new vendedor lists exactly the INICIO activation and is active; the seeded ones list theirs', async () => {
      const services = make();
      const created = await services.catalog.create({ id_trabajador: '001', nombres: 'juan' });
      expect(await history(services, created.id_vendedor)).toEqual([['INICIO', 'A']]);
      expect(await history(services, sale(2))).toEqual([['INICIO', 'D'], ['REINGRESO', 'A']]);
      expect(await history(services, sale(3))).toEqual([['INICIO', 'D']]);
    });

    it('S-ANX-2 activar on an active vendedor is a 409 with the Vendedor sentence; on a deactivated one it turns the estado on', async () => {
      const services = make();
      const error = await failure(services.actions.run({ id: sale(1) }, 'activar', { fecha_inicio: '2026-03-12', motivo: 'otro' }));
      expect([error.status, error.code, error.message]).toEqual([409, 'ACTION_NOT_ALLOWED', 'Vendedor ya Esta Activado']);
      expect(await services.actions.run({ id: sale(3) }, 'activar', { fecha_inicio: '2026-03-12', motivo: 'reingreso' })).toMatchObject({ row: { id_vendedor: sale(3), estado: true }, message: 'Vendedor Activado' });
    });

    it('S-MOCK-44 / S-MD-10 deleting a vendedor with two activation rows deletes both: its nested route answers 404', async () => {
      const services = make();
      expect(await history(services, sale(2))).toHaveLength(2);
      await services.catalog.remove(sale(2));
      expect((await failure(services.children.list(sale(2), 'activaciones'))).status).toBe(404);
      expect((await services.catalog.list({})).items.map((r) => r.id_vendedor)).not.toContain(sale(2));
    });
  });
}

describeServices('in-browser mock', () => {
  const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => WRITER, delayMs: 0 });
  return { catalog: mock.catalog('vendedores'), children: mock.children('vendedores'), actions: mock.actions('vendedores') };
});
describeServices('http mock server', () => {
  const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => WRITER });
  return { catalog: createCatalogServiceHttp(client, 'vendedores'), children: createChildServiceHttp(client, 'vendedores'), actions: createActionServiceHttp(client, 'vendedores') };
});
