import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { listCatalog } from '../../mock-server/core/catalog.js';
import { createStore } from '../../mock-server/core/store.js';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import type { InterCatalogService } from '../../src/services/InterCatalogService';
import type { InterLookupService } from '../../src/services/InterLookupService';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import type { CatalogCase } from './cases';
import { describeRegistryContract } from './registryContract';

const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
// S-REF-43 (R-MST-18 exception 2): trabajadores is a writable master from Wave 3, so its three write cases expect the master outcome instead of the 405.
const WRITER = { userId: '7', empresaId: '1' };
const MASTER_BODY = { id_tipo_trabajador: '001', id_tipo_perfil: '1', ap_paterno: 'x', ap_materno: 'y', nombres: 'z', dni: '1' };
const USUARIOS = 'usuarios';
const USUARIO_BODY = { id_trabajador: '001', usuario: 'nuevo', clave: 'secreto1', clave_confirmacion: 'secreto1' };
const TRABAJADORES = 'trabajadores';

// usuarios (R-REF-11, S-MOCK-38): the users of the tenant, projected from the auth users.json; the desktop listarGeneral() lists them all by nombre.
const DEMO_USUARIOS = [{ id: '1', name: 'Administrador' }, { id: '2', name: 'Cajero Uno' }, { id: '3', name: 'Usuario Deshabilitado' }, { id: '4', name: 'Sin Acceso Escritorio' }];
// trabajadores: minimal demo rows, shown by their nombre (the TrabajadorPuntoVenta picker, R-REF-12).
const DEMO_TRABAJADORES = [{ id: '001', name: 'JUAN PEREZ LOPEZ' }, { id: '002', name: 'MARIA GARCIA RAMOS' }, { id: '003', name: 'CARLOS TORRES DIAZ' }];
const CASES: CatalogCase[] = [
  { name: `${USUARIOS} S-REF-43 create is 201, no longer 405`, slug: USUARIOS, steps: [{ op: 'create', body: USUARIO_BODY }], expect: { ok: true } },
  { name: `${USUARIOS} S-REF-43 update is allowed, no longer 405`, slug: USUARIOS, steps: [{ op: 'update', id: '1', body: { id_trabajador: '001', usuario: 'admin' } }], expect: { ok: true } },
  { name: `${USUARIOS} S-REF-43 remove is the logical delete, no longer 405`, slug: USUARIOS, steps: [{ op: 'remove', id: '1' }], expect: { ok: true } },
  { name: `${USUARIOS} S-MOCK-15 lists the tenant users without any session context`, slug: USUARIOS, steps: [{ op: 'list' }], expect: { ok: true, total: 4 } },
  { name: `${USUARIOS} get resolves a user by its id`, slug: USUARIOS, steps: [{ op: 'get', id: '2' }], expect: { ok: true, match: { id_usuario: '2', usuario: 'cajero', nombre: 'Cajero Uno' } } },
  { name: `${USUARIOS} R-REF-11 the options carry the id and the nombre`, slug: USUARIOS, steps: [{ op: 'options' }], expect: { ok: true, items: DEMO_USUARIOS } },
  { name: `${TRABAJADORES} S-REF-43 create is 201, no longer 405`, slug: TRABAJADORES, ctx: WRITER, steps: [{ op: 'create', body: MASTER_BODY }], expect: { ok: true } },
  { name: `${TRABAJADORES} S-REF-43 update is allowed, no longer 405`, slug: TRABAJADORES, ctx: WRITER, steps: [{ op: 'update', id: '001', body: { telefono: '1' } }], expect: { ok: true } },
  { name: `${TRABAJADORES} S-REF-43 remove is 405 MODE_NOT_SUPPORTED and the row stays`, slug: TRABAJADORES, ctx: WRITER, steps: [{ op: 'remove', id: '001' }], expect: { status: 405, code: 'MODE_NOT_SUPPORTED' } },
  { name: `${TRABAJADORES} S-MOCK-15 lists the active rows without any session context`, slug: TRABAJADORES, steps: [{ op: 'list' }], expect: { ok: true, total: 3 } },
  { name: `${TRABAJADORES} S-MOCK-15 get resolves a retired row`, slug: TRABAJADORES, steps: [{ op: 'get', id: '004' }], expect: { ok: true, match: { activo: false } } },
  { name: `${TRABAJADORES} R-REF-11 the options carry the id and the nombre`, slug: TRABAJADORES, steps: [{ op: 'options' }], expect: { ok: true, items: DEMO_TRABAJADORES } },
];

const server = useTestServer({ seed: loadSeed(dataDir) });
type Services = { catalog: (slug: string) => InterCatalogService<Record<string, any>>; lookup: InterLookupService };
const sources = (tenantId: string): [string, (ctx: object) => Services][] => [
  ['in-browser mock', (ctx) => {
    const mock = createAppServicesMock('exitoso', { getSession: () => ({ tenantId }), getRequestContext: () => ctx, delayMs: 0 });
    return { catalog: (slug) => mock.catalog<Record<string, any>>(slug), lookup: mock.lookup };
  }],
  ['http mock server', (ctx) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: () => ({ tenantId }), getRequestContext: () => ctx });
    return { catalog: (slug) => createCatalogServiceHttp<Record<string, any>>(client, slug), lookup: createLookupServiceHttp(client) };
  }],
];

for (const [label, make] of sources('demo')) {
  describeRegistryContract(`${label} (usuarios, trabajadores)`, (slug, ctx) => {
    const services = make(ctx);
    return { catalog: services.catalog(slug), lookup: services.lookup };
  }, CASES);
}

// S-MOCK-38: the users are per tenant, each tenant sees only its own.
describe.each(sources('botica'))('S-MOCK-38 a tenant sees only its own people (%s)', (_label, make) => {
  it('botica lists its only user, and its options carry that one', async () => {
    const services = make({});
    expect(await services.lookup.options(USUARIOS)).toEqual([{ id: '1', name: 'Administrador' }]);
    expect((await services.catalog(USUARIOS).list()).pagination.total).toBe(1);
  });

  it('botica has no trabajadores: the demo rows belong to demo', async () => {
    expect(await make({}).lookup.options(TRABAJADORES)).toEqual([]);
  });

  it('a demo-only user is not found in botica', async () => {
    await expect(make({}).catalog(USUARIOS).get('2')).rejects.toMatchObject({ status: 404 });
  });
});

describe('usuarios are projected from the auth users seed, never copied', () => {
  const seed = loadSeed(dataDir);

  it('is a writable tenant master backed by the W1 users section (S-REF-43): no seed file of its own', () => {
    const entry = REGISTRY.bySlug.get(USUARIOS);
    expect([entry.scope, entry.readOnly, entry.seed, entry.backing, entry.formId, entry.menu]).toEqual(['tenant', undefined, null, 'users', 'mi_usuario', { parent: 'mnGenerales', label: 'Usuario' }]);
    expect(Object.keys(seed)).not.toContain(USUARIOS);
  });

  it('every row mirrors a user of users.json that may log in to the tenant, and never carries the password', () => {
    const store = createStore(seed);
    for (const tenant of ['demo', 'botica']) {
      const rows = listCatalog(store, tenant, USUARIOS).items;
      expect(rows.map((r: any) => r.id_usuario)).toEqual(seed.users.filter((u: any) => u.tenants.includes(tenant)).map((u: any) => String(u.id_usuario)));
      for (const row of rows) expect(row).not.toHaveProperty('clave');
    }
  });

  it('follows the users seed: a user added there shows up with no other change', () => {
    const extended = { ...seed, users: [...seed.users, { id_usuario: 9, usuario: 'nuevo', clave: 'x', nombre: 'Nuevo', flaghabilitado: 'A', flagEscritorio: 'S', tenants: ['botica'] }] };
    expect(listCatalog(createStore(extended), 'botica', USUARIOS).items.map((r: any) => r.nombre)).toEqual(['Administrador', 'Nuevo']);
  });

  it('trabajadores is a writable tenant master with a demo-only seed and its own screen (S-REF-43)', () => {
    const entry = REGISTRY.bySlug.get(TRABAJADORES);
    expect([entry.scope, entry.readOnly, entry.formId, entry.menu, Object.keys(seed[TRABAJADORES])]).toEqual(['tenant', undefined, 'miTrabajador', { parent: 'mnGenerales', label: 'Trabajador' }, ['demo']]);
  });
});
