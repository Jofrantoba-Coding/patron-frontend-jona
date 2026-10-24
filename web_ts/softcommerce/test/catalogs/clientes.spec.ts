import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import menu from '../../mock-server/data/menu.json';
import permissions from '../../mock-server/data/permissions.json';
import { fieldState } from '../../mock-server/core/predicates.js';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createChildServiceHttp } from '../../src/services/ChildServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { seed } from '../../src/services/mock/seed';
import { CLIENTE_CASES } from './clientes.cases';
import { describeRegistryContract } from './registryContract';

const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const WRITER = { userId: '7' };
const entry = REGISTRY.bySlug.get('clientes');
const field = (name: string) => entry.fields.find((f: any) => f.name === name);

describe('R-MST-1 / R-MST-10 the clientes entry', () => {
  it('is the anexo Cliente: formId miCliente, modes INSERT and UPDATE only (S-MST-1)', () => {
    expect([entry.formId, entry.title, entry.entity, entry.modes]).toEqual(['miCliente', 'Cliente', 'un Cliente', ['INSERT', 'UPDATE']]);
  });

  it('hangs under Generales with the menu node and the grant of the formId (R-REG-19)', () => {
    expect(entry.menu).toEqual({ parent: 'mnGenerales', label: 'Cliente' });
    expect((menu as any[]).find((n) => n.nombre === 'miCliente')).toMatchObject({ descripcion: 'Cliente', menu_item: 'S' });
    expect((permissions as any).miCliente).toMatchObject({ add: true, modify: true, eliminate: false, clone: false, details: false });
  });

  it('is the person block of R-MST-2 plus the tipo de cliente and the condición de pago, in the order of isRegisterValid, with the activacion rule', () => {
    expect(entry.rules.map((r: any) => r.name)).toEqual(['docIdentidad', 'activacion', 'padron']);
    expect(entry.validation).toEqual(['id_tipo_doc_iden', { rule: 'docIdentidad' }, 'numero_doc', 'ap_paterno', 'ap_materno', 'nombres', 'descripcion', 'id_clasif_cliente', 'id_nacionalidad', 'direccion', 'sexo', 'telefono', 'celular', 'email', 'condicion_pago', 'numero_dias']);
  });

  it('opens with no tipo (INSERT) on PERUANA and sexo M, stores the session user, the tipo anexo "2" and a 10-character code (R-ANX-9)', () => {
    expect(field('id_tipo_doc_iden').default).toBeUndefined();
    expect([field('id_nacionalidad').default, field('sexo').default]).toEqual([{ INSERT: '001' }, 'M']);
    expect([entry.scope, entry.stamp, entry.codeWidth, entry.constants]).toEqual(['tenant', ['id_usuario'], 10, { id_tipo_anexo: '2' }]);
  });

  it('S-MST-20 the tipo de cliente is a select over the active clasificaciones, required unless the tipo de documento is OTROS', () => {
    const tipo = field('id_clasif_cliente');
    expect([tipo.kind, tipo.label, tipo.source]).toEqual(['select', 'Tipo Cliente', { catalog: 'clasif-clientes', where: { estado: true } }]);
    expect(fieldState(tipo, { id_tipo_doc_iden: '05' }).required).toBe(true);
    // No seeded tipo is OTROS [INFERRED]: an id outside the offered ones stands for it and skips the step.
    expect(fieldState(tipo, { id_tipo_doc_iden: 'OTROS' }).required).toBe(false);
  });

  it('has the activation tab; the grids are covered by clientes.grids.spec', () => {
    expect(REGISTRY.childEntries.filter((c: any) => c.parent === 'clientes').map((c: any) => c.childName)).toContain('activaciones');
  });
});

describeRegistryContract(
  'in-browser mock (clientes)',
  (slug, ctx) => {
    const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 });
    return { catalog: mock.catalog(slug), lookup: mock.lookup };
  },
  CLIENTE_CASES,
);

const server = useTestServer({ seed: loadSeed(dataDir) });
describeRegistryContract(
  'http mock server (clientes)',
  (slug, ctx) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    return { catalog: createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  },
  CLIENTE_CASES,
);

describe.each([
  ['in-browser mock', () => { const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => WRITER, delayMs: 0 }); return { catalog: mock.catalog('clientes'), children: mock.children('clientes') }; }],
  ['http mock server', () => { const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => WRITER }); return { catalog: createCatalogServiceHttp(client, 'clientes'), children: createChildServiceHttp(client, 'clientes') }; }],
])('clientes activation history: %s', (_label, make) => {
  it('S-ANX-1 a new cliente lists exactly the INICIO activation and is active', async () => {
    const services = make();
    const created = (await services.catalog.create({ id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme sac', id_clasif_cliente: '1' })) as Record<string, any>;
    expect((await services.children.list(created.id_cliente, 'activaciones')).items.map((r) => [r.motivo_activacion, r.estado])).toEqual([['INICIO', 'A']]);
    expect(created.estado).toBe(true);
  });
});

/** The same data with the Cliente condición de pago parameter off for `demo` (a tenant that has it off, like botica, has no clasificaciones seeded). */
const withoutParam = (base: any) => ({ ...base, params: { ...base.params, demo: { ...base.params.demo, IS_CLIENTE_CONDICION_PAGO: false } } });
const offServer = useTestServer({ seed: withoutParam(loadSeed(dataDir)) });
describe.each([
  ['in-browser mock', () => createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => WRITER, delayMs: 0, seed: withoutParam(seed) }).catalog('clientes')],
  ['http mock server', () => createCatalogServiceHttp(createHttpClient({ baseUrl: offServer.url(), getSession: session, getRequestContext: () => WRITER }), 'clientes')],
])('S-MD-14 / S-REG-25 the condición de pago gate with the parameter off: %s', (_label, make) => {
  const body = { id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme sac', id_clasif_cliente: '1' };

  it('the fields are absent: a body value is ignored, the blank días are not validated and nothing is stored for them', async () => {
    const created = (await make().create({ ...body, condicion_pago: 'CREDITO', numero_dias: '' })) as Record<string, unknown>;
    expect([created.condicion_pago, created.numero_dias]).toEqual([undefined, undefined]);
  });

  it('the rest of the form is unchanged: the tipo de cliente sentence still applies', async () => {
    await expect(make().create({ ...body, id_clasif_cliente: '' })).rejects.toMatchObject({ status: 422, details: [{ field: 'id_clasif_cliente' }] });
  });
});
