import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import menu from '../../mock-server/data/menu.json';
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
import { BANCO_CASES } from './bancos.cases';
import { describeRegistryContract } from './registryContract';

const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const WRITER = { userId: '7' };
const entry = REGISTRY.bySlug.get('bancos');
const field = (name: string) => entry.fields.find((f: any) => f.name === name);
const bank = (n: number) => String(n).padStart(10, '0');

describe('R-MST-1 / R-MST-3 the bancos entry', () => {
  it('is the anexo Banco: slug bancos, formId miBancoAnexo, modes INSERT UPDATE DETAIL CLONE (S-MST-1)', () => {
    expect([entry.formId, entry.title, entry.entity, entry.modes]).toEqual(['miBancoAnexo', 'Banco', 'un Banco', ['INSERT', 'UPDATE', 'DETAIL', 'CLONE']]);
  });

  it('hangs under Generales with the menu node of the formId (R-REG-19)', () => {
    expect(entry.menu).toEqual({ parent: 'mnGenerales', label: 'Banco' });
    expect((menu as any[]).find((n) => n.nombre === 'miBancoAnexo')).toMatchObject({ descripcion: 'Banco', menu_item: 'S' });
  });

  it('is the person block of R-MST-2 in the desktop validation order: tipo, the docIdentidad rule, then the razon social and the nacionalidad', () => {
    expect(entry.rules.map((r: any) => r.name)).toEqual(['docIdentidad', 'activacion']);
    expect(entry.validation).toEqual(['id_tipo_doc_iden', { rule: 'docIdentidad' }, 'numero_doc', 'ap_paterno', 'ap_materno', 'nombres', 'descripcion', 'id_nacionalidad', 'direccion', 'sexo', 'telefono', 'celular', 'email']);
    expect(entry.fields.map((f: any) => f.name)).toEqual([
      'id_banco', 'id_tipo_doc_iden', 'numero_doc', 'ap_paterno', 'ap_materno', 'nombres', 'descripcion', 'direccion', 'sexo', 'telefono', 'celular', 'id_nacionalidad', 'email', 'estado',
    ]);
  });

  it('opens on RUC and PERUANA (INSERT only) and stores the session user, the tipo anexo "3" and a 10-character code (R-ANX-9)', () => {
    expect([field('id_tipo_doc_iden').default, field('id_nacionalidad').default, field('sexo').default]).toEqual([{ INSERT: '05' }, { INSERT: '001' }, 'M']);
    expect([entry.scope, entry.stamp, entry.codeWidth, entry.constants]).toEqual(['tenant', ['id_usuario'], 10, { id_tipo_anexo: '3' }]);
  });

  it('shows the estado read-only in every mode (R-ACT-5) and the activation tab as its only child', () => {
    expect([field('estado').label, field('estado').readOnlyOn]).toEqual(['Estado', ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE']]);
    expect(REGISTRY.childEntries.filter((c: any) => c.parent === 'bancos').map((c: any) => c.tab)).toEqual(['Activación de Banco']);
  });

  it('does not port the padron flags the desktop sent without a tab (R-MST-3 [DEVIATION])', () => {
    expect(entry.fields.map((f: any) => f.name).filter((name: string) => /percepcion|retencion|exceptuado/.test(name))).toEqual([]);
  });
});

describeRegistryContract(
  'in-browser mock (bancos)',
  (slug, ctx) => {
    const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 });
    return { catalog: mock.catalog(slug), lookup: mock.lookup };
  },
  BANCO_CASES,
);

const server = useTestServer({ seed: loadSeed(dataDir) });
describeRegistryContract(
  'http mock server (bancos)',
  (slug, ctx) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    return { catalog: createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  },
  BANCO_CASES,
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
const shape = (e: ApiError) => [e.status, e.code, e.message, e.details.map((d) => d.field)];

/** The history, the clone and the endpoints on both sources (S-MOCK-35): same status, code, message and rows. */
function describeBancoServices(label: string, make: () => Services): void {
  describe(`bancos activation history: ${label}`, () => {
    const history = async (services: Services, id: string) => (await services.children.list(id, 'activaciones')).items.map((r) => [r.motivo_activacion, r.estado]);

    it('S-ANX-1 / R-ANX-2 a new banco lists exactly the INICIO activation, dated today, and is active', async () => {
      const services = make();
      const created = await services.catalog.create({ id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme sac' });
      const rows = (await services.children.list(created.id_banco, 'activaciones')).items;
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({ motivo_activacion: 'INICIO', estado: 'A', f_inicio: new Date().toISOString().slice(0, 10) });
      expect(created.estado).toBe(true);
    });

    it('S-MD-12 CLONE sends no children: the copy has the one INICIO row and the original keeps its three', async () => {
      const services = make();
      expect(await history(services, bank(3))).toEqual([['INICIO', 'D'], ['REINGRESO', 'D'], ['REINGRESO', 'A']]);
      const copy = await services.catalog.create({ id_tipo_doc_iden: '05', numero_doc: '20100053455', descripcion: 'COPIA DE INTERBANK' });
      expect(await history(services, copy.id_banco)).toEqual([['INICIO', 'A']]);
      expect(await history(services, bank(3))).toHaveLength(3);
    });

    it('R-ANX-1 the history child has no DELETE (removal none) and its rows answer GET', async () => {
      const services = make();
      expect(await services.children.get(bank(4), 'activaciones', '1')).toMatchObject({ estado: 'D', motivo_desactivacion: 'CIERRE' });
      expect((await failure(services.children.remove(bank(4), 'activaciones', '1'))).status).toBe(405);
    });

    it('S-MOCK-47 activar on a deactivated banco adds an active row and the estado turns on', async () => {
      const services = make();
      expect((await services.catalog.get(bank(4))).estado).toBe(false);
      const out = await services.actions.run({ id: bank(4) }, 'activar', { fecha_inicio: '2026-03-12', motivo: 'reingreso' });
      expect(out).toMatchObject({ row: { id_banco: bank(4), estado: true }, message: 'Banco Activado' });
      expect(await history(services, bank(4))).toEqual([['INICIO', 'D'], ['REINGRESO', 'A']]);
    });

    it('S-MOCK-48 activar on an active banco is a 409 ACTION_NOT_ALLOWED and changes nothing; an unknown action is a 404', async () => {
      const services = make();
      expect(shape(await failure(services.actions.run({ id: bank(1) }, 'activar', { fecha_inicio: '2026-03-12', motivo: 'otro' })))).toEqual([409, 'ACTION_NOT_ALLOWED', 'Banco ya Esta Activado', []]);
      expect(await history(services, bank(1))).toEqual([['INICIO', 'A']]);
      expect((await failure(services.actions.run({ id: bank(1) }, 'nada'))).status).toBe(404);
    });

    it('S-MOCK-49 desactivar with a fecha fin before the start is a 422 on fecha_fin; a valid one turns the banco off', async () => {
      const services = make();
      expect(shape(await failure(services.actions.run({ id: bank(1) }, 'desactivar', { fecha_fin: '2024-12-31', motivo: 'cierre' })))).toEqual([422, 'VALIDATION_ERROR', 'Validation failed', ['fecha_fin']]);
      expect(await services.actions.run({ id: bank(1) }, 'desactivar', { fecha_fin: '2026-03-12', motivo: 'cierre' })).toMatchObject({ row: { estado: false }, message: 'Banco Desactivado' });
      expect(await history(services, bank(1))).toEqual([['INICIO', 'D']]);
    });

    it('the activation is saved atomically with the banco: a failing second op persists nothing', async () => {
      const services = make();
      const body = { telefono: '999', children: { activaciones: [{ op: 'A', id: '2', estado: 'D', f_fin: '2026-03-12', motivo_desactivacion: 'cierre' }, { op: 'I', f_inicio: '2026-03-13', motivo_activacion: '' }] } };
      expect((await failure(services.catalog.update(bank(1), body))).status).toBe(422);
      expect((await services.catalog.get(bank(1))).telefono).toBe('3112000');
      expect(await history(services, bank(1))).toEqual([['INICIO', 'A']]);
    });
  });
}

describeBancoServices('in-browser mock', () => {
  const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => WRITER, delayMs: 0 });
  return { catalog: mock.catalog('bancos'), children: mock.children('bancos'), actions: mock.actions('bancos') };
});
describeBancoServices('http mock server', () => {
  const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => WRITER });
  return { catalog: createCatalogServiceHttp(client, 'bancos'), children: createChildServiceHttp(client, 'bancos'), actions: createActionServiceHttp(client, 'bancos') };
});
