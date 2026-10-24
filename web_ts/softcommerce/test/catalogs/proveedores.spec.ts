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
import { PROVEEDOR_CASES } from './proveedores.cases';
import { describeRegistryContract } from './registryContract';

const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const session = () => ({ tenantId: 'demo' });
const WRITER = { userId: '7' };
const entry = REGISTRY.bySlug.get('proveedores');
const field = (name: string) => entry.fields.find((f: any) => f.name === name);

describe('R-MST-1 / R-MST-13 the proveedores entry', () => {
  it('is the anexo Proveedor: formId miProveedor, modes INSERT and UPDATE only (S-MST-1, S-MST-26)', () => {
    expect([entry.formId, entry.title, entry.entity, entry.modes]).toEqual(['miProveedor', 'Proveedor', 'un Proveedor', ['INSERT', 'UPDATE']]);
  });

  it('hangs under Generales with the menu node and the grant of the formId (R-REG-19)', () => {
    expect(entry.menu).toEqual({ parent: 'mnGenerales', label: 'Proveedor' });
    expect((menu as any[]).find((n) => n.nombre === 'miProveedor')).toMatchObject({ descripcion: 'Proveedor', menu_item: 'S' });
    expect((permissions as any).miProveedor).toMatchObject({ add: true, modify: true, eliminate: false, clone: false, details: false });
  });

  it('is the person block of R-MST-2 with the activacion and padron rules', () => {
    expect(entry.rules.map((r: any) => r.name)).toEqual(['docIdentidad', 'activacion', 'padron']);
    expect(entry.validation).toEqual(['id_tipo_doc_iden', { rule: 'docIdentidad' }, 'numero_doc', 'ap_paterno', 'ap_materno', 'nombres', 'descripcion', 'id_nacionalidad', 'direccion', 'sexo', 'telefono', 'celular', 'email']);
  });

  it('opens with no tipo (INSERT) on PERUANA and sexo M, stores the session user, the tipo anexo "1" and a 10-character code (R-ANX-9)', () => {
    expect(field('id_tipo_doc_iden').default).toBeUndefined();
    expect([field('id_nacionalidad').default, field('sexo').default]).toEqual([{ INSERT: '001' }, 'M']);
    expect([entry.scope, entry.stamp, entry.codeWidth, entry.constants]).toEqual(['tenant', ['id_usuario'], 10, { id_tipo_anexo: '1' }]);
  });

  it('S-MST-26 has the tabs Activación de Proveedor and Padrones and no address grid or padron configuration', () => {
    const kids = REGISTRY.childEntries.filter((c: any) => c.parent === 'proveedores');
    expect(kids.map((c: any) => [c.childName, c.tab])).toEqual([['activaciones', 'Activación de Proveedor'], ['padrones', 'Padrones']]);
  });

  it('shows the estado and the three padron flags read-only in every mode (R-ANX-8), in the desktop order', () => {
    const all = ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'];
    expect(field('estado').readOnlyOn).toEqual(all);
    const flags = ['flag_percepcion', 'flag_retencion', 'flag_buen_contrib'];
    expect(entry.fields.map((f: any) => f.name).filter((name: string) => flags.includes(name))).toEqual(flags);
    for (const name of flags) expect([field(name).kind, field(name).readOnlyOn]).toEqual(['boolean', all]);
  });
});

describeRegistryContract(
  'in-browser mock (proveedores)',
  (slug, ctx) => {
    const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 });
    return { catalog: mock.catalog(slug), lookup: mock.lookup };
  },
  PROVEEDOR_CASES,
);

const server = useTestServer({ seed: loadSeed(dataDir) });
describeRegistryContract(
  'http mock server (proveedores)',
  (slug, ctx) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    return { catalog: createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  },
  PROVEEDOR_CASES,
);

describe.each([
  ['in-browser mock', () => { const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => WRITER, delayMs: 0 }); return { catalog: mock.catalog('proveedores'), children: mock.children('proveedores'), actions: mock.actions('proveedores'), lookup: mock.lookup }; }],
  ['http mock server', () => { const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => WRITER }); return { catalog: createCatalogServiceHttp(client, 'proveedores'), children: createChildServiceHttp(client, 'proveedores'), actions: createActionServiceHttp(client, 'proveedores'), lookup: createLookupServiceHttp(client) }; }],
])('proveedores history and padron offer: %s', (_label, make) => {
  const history = async (services: ReturnType<typeof make>, id: string) => (await services.children.list(id, 'activaciones')).items.map((r) => [r.motivo_activacion, r.estado]);

  it('S-ANX-1 a new proveedor lists exactly the INICIO activation and is active', async () => {
    const services = make();
    const created = (await services.catalog.create({ id_tipo_doc_iden: '05', numero_doc: '20123456789', descripcion: 'acme sac' })) as Record<string, any>;
    expect(await history(services, created.id_proveedor)).toEqual([['INICIO', 'A']]);
    expect(created.estado).toBe(true);
  });

  it('S-MOCK-47 activar on a deactivated proveedor adds an active row and the estado turns on', async () => {
    const services = make();
    const out = await services.actions.run({ id: '0000000003' }, 'activar', { fecha_inicio: '2026-03-12', motivo: 'reingreso' });
    expect(out).toMatchObject({ row: { id_proveedor: '0000000003', estado: true }, message: 'Proveedor Activado' });
  });

  it('S-ANX-10 the padron lookup answers 02, 03 and 04 for a Proveedor (not 01)', async () => {
    const { lookup } = make();
    expect((await lookup.options('padrones', { para_proveedor: 'true' })).map((o) => o.id)).toEqual(['02', '03', '04']);
  });

  it('S-ANX-9 the refusal carries the desktop sentence as its message', async () => {
    const { catalog } = make();
    await expect(catalog.update('0000000001', { children: { padrones: [{ op: 'I', id_padron: '02', f_inicio: '2026-03-11' }] } })).rejects.toMatchObject({ status: 409, message: 'Padron ya se Encuentra Activado' });
    await expect(catalog.update('0000000001', { children: { padrones: [{ op: 'I', id_padron: '03', f_inicio: '2026-03-11' }, { op: 'I', id_padron: '03', f_inicio: '2026-03-12' }] } })).rejects.toMatchObject({ status: 409, message: 'Padron ya se Encuentra Activado' });
  });

  it('S-ANX-13 the padron history lists each activation: the seeded 04 of proveedor 2 and, after a re-activation, the old and the new row of proveedor 3', async () => {
    const services = make();
    expect((await services.children.list('0000000002', 'padrones')).items.map((r) => [r.id_padron, r.padron, r.estado])).toEqual([['04', 'BUEN CONTRIBUYENTE', 'A']]);
    await services.catalog.update('0000000003', { children: { padrones: [{ op: 'I', id_padron: '03', f_inicio: '2026-03-11' }] } });
    expect((await services.children.list('0000000003', 'padrones')).items.map((r) => [r.id_padron, r.estado])).toEqual([['03', 'D'], ['03', 'A']]);
  });
});
