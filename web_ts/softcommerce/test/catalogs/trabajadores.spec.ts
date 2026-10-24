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
import { TRABAJADOR_CASES } from './trabajadores.cases';

/** The Trabajador master (R-MST-4, S-MST-6..9, S-REF-43, S-MST-36): the entry, both sources through the shared contract, and the activation history. */
const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const WRITER = { userId: '7', empresaId: '1' };
const entry = REGISTRY.bySlug.get('trabajadores');
const field = (name: string) => entry.fields.find((f: any) => f.name === name);

describe('R-MST-4 the trabajadores entry', () => {
  it('is a writable master that keeps the W2 slug, id key, label, scope and lookup shape (R-MST-17)', () => {
    expect([entry.slug, entry.idKey, entry.optionLabel, entry.scope, entry.readOnly ?? false]).toEqual(['trabajadores', 'id_trabajador', 'nombre', 'tenant', false]);
    expect([entry.formId, entry.title, entry.entity, entry.modes]).toEqual(['miTrabajador', 'Trabajador', 'un Trabajador', ['INSERT', 'UPDATE', 'DETAIL']]);
  });

  it('does not offer CLONE: PanelTFTrabajador.controlClone is empty, so the entry offers no CLONE mode (R-CRUD-16, R-MST-1; the toolbar drop is asserted in the UI spec)', () => {
    expect(entry.modes).not.toContain('CLONE');
  });

  it('has the fields in the desktop order, the derived nombre and the read-only estado', () => {
    expect(entry.fields.map((f: any) => f.name)).toEqual([
      'id_trabajador', 'id_tipo_trabajador', 'id_tipo_perfil', 'ap_paterno', 'ap_materno', 'nombres', 'nombre', 'direccion', 'email', 'sexo', 'fecha_nac', 'dni', 'telefono', 'celular', 'estado',
    ]);
    expect(entry.validation).toEqual(['id_tipo_trabajador', 'id_tipo_perfil', 'ap_paterno', 'ap_materno', 'nombres', 'dni', 'fecha_nac', 'direccion', 'email', 'sexo', 'telefono', 'celular']);
    expect(entry.rules.map((r: any) => r.name)).toEqual(['nombreCompuesto', 'activacion']);
    expect(field('estado').readOnlyOn).toEqual(['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE']);
  });

  it('chains the perfil to the tipo and stamps the session user and empresa, the tipo anexo is a placeholder (R-ANX-9)', () => {
    expect(field('id_tipo_perfil').dependsOn).toEqual([{ field: 'id_tipo_trabajador', filterKey: 'id_tipo_trabajador' }]);
    expect([entry.stamp, entry.codeWidth, entry.constants]).toEqual([['id_usuario', 'id_empresa'], 3, { id_tipo_anexo: '9' }]);
    expect(REGISTRY.childEntries.filter((c: any) => c.parent === 'trabajadores').map((c: any) => c.tab)).toEqual(['Activación de Trabajador']);
  });

  it('hangs under Generales with the menu node and the 13-flag grant of the formId, without eliminate (R-REG-19)', () => {
    expect(entry.menu).toEqual({ parent: 'mnGenerales', label: 'Trabajador' });
    expect((menu as any[]).find((n) => n.nombre === 'miTrabajador')).toMatchObject({ descripcion: 'Trabajador', menu_item: 'S', id_menu_padre: 2 });
    const grant = (permissions as any).miTrabajador;
    expect(Object.keys(grant)).toHaveLength(13);
    expect(grant).toMatchObject({ add: true, modify: true, eliminate: false, clone: false, details: true });
  });
});

describeRegistryContract(
  'in-browser mock (trabajadores)',
  (slug, ctx) => {
    const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 });
    return { catalog: mock.catalog(slug), lookup: mock.lookup };
  },
  TRABAJADOR_CASES,
);

const server = useTestServer({ seed: loadSeed(dataDir) });
describeRegistryContract(
  'http mock server (trabajadores)',
  (slug, ctx) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    return { catalog: createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  },
  TRABAJADOR_CASES,
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
  describe(`trabajadores activation: ${label}`, () => {
    const history = async (services: Services, id: string) => (await services.children.list(id, 'activaciones')).items.map((r) => [r.motivo_activacion, r.estado]);

    it('S-ANX-1 / R-ANX-2 a new trabajador lists exactly the INICIO activation and is active; the seeded ones list theirs', async () => {
      const services = make();
      const created = await services.catalog.create({ id_tipo_trabajador: '001', id_tipo_perfil: '1', ap_paterno: 'a', ap_materno: 'b', nombres: 'c', dni: '1' });
      expect(await history(services, created.id_trabajador)).toEqual([['INICIO', 'A']]);
      expect(await history(services, '001')).toEqual([['INICIO', 'A']]);
      expect(await history(services, '003')).toEqual([['INICIO', 'D']]);
    });

    it('S-ANX-2 activar on an active trabajador is a 409 with the Trabajador sentence; on a deactivated one it turns the estado on', async () => {
      const services = make();
      const error = await failure(services.actions.run({ id: '001' }, 'activar', { fecha_inicio: '2026-03-12', motivo: 'otro' }));
      expect([error.status, error.code, error.message]).toEqual([409, 'ACTION_NOT_ALLOWED', 'Trabajador ya Esta Activado']);
      const out = await services.actions.run({ id: '003' }, 'activar', { fecha_inicio: '2026-03-12', motivo: 'reingreso' });
      expect(out).toMatchObject({ row: { id_trabajador: '003', estado: true }, message: 'Trabajador Activado' });
    });

    it('S-REF-43 the lookup lists the active records: a deactivated trabajador is still listed, a retired one is not', async () => {
      const services = make();
      await services.actions.run({ id: '001' }, 'desactivar', { fecha_fin: '2026-03-12', motivo: 'cese' });
      expect((await services.catalog.get('001')).estado).toBe(false);
      expect((await services.catalog.list({})).items).toHaveLength(3);
    });
  });
}

describeServices('in-browser mock', () => {
  const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => WRITER, delayMs: 0 });
  return { catalog: mock.catalog('trabajadores'), children: mock.children('trabajadores'), actions: mock.actions('trabajadores') };
});
describeServices('http mock server', () => {
  const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => WRITER });
  return { catalog: createCatalogServiceHttp(client, 'trabajadores'), children: createChildServiceHttp(client, 'trabajadores'), actions: createActionServiceHttp(client, 'trabajadores') };
});
