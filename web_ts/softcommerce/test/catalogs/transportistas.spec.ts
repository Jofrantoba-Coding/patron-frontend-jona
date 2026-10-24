import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import menu from '../../mock-server/data/menu.json';
import permissions from '../../mock-server/data/permissions.json';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { createActionServiceHttp } from '../../src/services/ActionServiceHttp';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createChildServiceHttp } from '../../src/services/ChildServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { describeRegistryContract } from './registryContract';
import { TRANSPORTISTA_CASES } from './transportistas.cases';

const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const WRITER = { userId: '7' };
const entry = REGISTRY.bySlug.get('transportistas');
const field = (name: string) => entry.fields.find((f: any) => f.name === name);

describe('R-MST-1 / R-MST-5 the transportistas entry', () => {
  it('is the anexo Transportista: formId miTransportista, modes INSERT UPDATE DETAIL CLONE (S-MST-1)', () => {
    expect([entry.formId, entry.title, entry.entity, entry.modes]).toEqual(['miTransportista', 'Transportista', 'un Transportista', ['INSERT', 'UPDATE', 'DETAIL', 'CLONE']]);
  });

  it('hangs under Generales with the menu node and the grant of the formId (R-REG-19)', () => {
    expect(entry.menu).toEqual({ parent: 'mnGenerales', label: 'Transportista' });
    expect((menu as any[]).find((n) => n.nombre === 'miTransportista')).toMatchObject({ descripcion: 'Transportista', menu_item: 'S' });
    expect((permissions as any).miTransportista).toMatchObject({ add: true, modify: true, eliminate: false, clone: true, details: true });
  });

  it('is the person block of R-MST-2 with the activation rule', () => {
    expect(entry.rules.map((r: any) => r.name)).toEqual(['docIdentidad', 'activacion']);
    expect(entry.validation).toEqual(['id_tipo_doc_iden', { rule: 'docIdentidad' }, 'numero_doc', 'ap_paterno', 'ap_materno', 'nombres', 'descripcion', 'id_nacionalidad', 'direccion', 'sexo', 'telefono', 'celular', 'email']);
  });

  it('opens on RUC and PERUANA (INSERT only) and stores the session user, the tipo anexo "6" and a 10-character code (R-ANX-9)', () => {
    expect([field('id_tipo_doc_iden').default, field('id_nacionalidad').default, field('sexo').default]).toEqual([{ INSERT: '05' }, { INSERT: '001' }, 'M']);
    expect([entry.scope, entry.stamp, entry.codeWidth, entry.constants]).toEqual(['tenant', ['id_usuario'], 10, { id_tipo_anexo: '6' }]);
  });

  it('shows the estado read-only in every mode and the activation tab', () => {
    expect(field('estado').readOnlyOn).toEqual(['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE']);
    expect(REGISTRY.childEntries.filter((c: any) => c.parent === 'transportistas').map((c: any) => c.tab)).toContain('Activación de Transportista');
  });
});

describeRegistryContract(
  'in-browser mock (transportistas)',
  (slug, ctx) => {
    const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 });
    return { catalog: mock.catalog(slug), lookup: mock.lookup };
  },
  TRANSPORTISTA_CASES,
);

const server = useTestServer({ seed: loadSeed(dataDir) });
describeRegistryContract(
  'http mock server (transportistas)',
  (slug, ctx) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    return { catalog: createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  },
  TRANSPORTISTA_CASES,
);

describe.each([
  ['in-browser mock', () => { const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => WRITER, delayMs: 0 }); return { catalog: mock.catalog('transportistas'), children: mock.children('transportistas'), actions: mock.actions('transportistas') }; }],
  ['http mock server', () => { const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => WRITER }); return { catalog: createCatalogServiceHttp(client, 'transportistas'), children: createChildServiceHttp(client, 'transportistas'), actions: createActionServiceHttp(client, 'transportistas') }; }],
])('transportistas activation history: %s', (_label, make) => {
  const history = async (services: ReturnType<typeof make>, id: string) => (await services.children.list(id, 'activaciones')).items.map((r) => [r.motivo_activacion, r.estado]);

  it('S-ANX-1 a new transportista lists exactly the INICIO activation and is active', async () => {
    const services = make();
    const created = (await services.catalog.create({ id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme sac' })) as Record<string, any>;
    expect(await history(services, created.id_transportista)).toEqual([['INICIO', 'A']]);
    expect(created.estado).toBe(true);
  });

  it('S-MOCK-47 activar on a deactivated transportista adds an active row and the estado turns on', async () => {
    const services = make();
    const out = await services.actions.run({ id: '0000000003' }, 'activar', { fecha_inicio: '2026-03-12', motivo: 'reingreso' });
    expect(out).toMatchObject({ row: { id_transportista: '0000000003', estado: true }, message: 'Transportista Activado' });
  });
});
