import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import menu from '../../mock-server/data/menu.json';
import permissions from '../../mock-server/data/permissions.json';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { describeRegistryContract } from './registryContract';
import { USUARIO_CASES } from './usuarios.cases';

/** The Usuario master (R-MST-7, S-MST-13..16, S-MOCK-38, S-MOCK-51, S-MOCK-55): the entry and both sources through the shared contract. */
const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const entry = REGISTRY.bySlug.get('usuarios');
const field = (name: string) => entry.fields.find((f: any) => f.name === name);

describe('R-MST-1 / R-MST-7 the usuarios entry', () => {
  it('is the Usuario master: formId mi_usuario, every mode, backed by the users store, tenant scope and no stamp', () => {
    expect([entry.formId, entry.title, entry.entity, entry.modes, entry.backing, entry.scope, entry.seed, entry.stamp, entry.readOnly]).toEqual([
      'mi_usuario', 'Usuario', 'un usuario', ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'], 'users', 'tenant', null, [], undefined,
    ]);
  });

  it('keeps the W2 contract: slug, idKey, optionLabel and the lookup row keys', () => {
    expect([entry.slug, entry.idKey, entry.optionLabel]).toEqual(['usuarios', 'id_usuario', 'nombre']);
    expect(entry.columns.slice(0, 3).map((c: any) => c.key)).toEqual(['id_usuario', 'usuario', 'nombre']);
  });

  it('has the desktop fields in order: trabajador, cargo, nombre de usuario, clave, the four flags', () => {
    expect(entry.fields.map((f: any) => f.name)).toEqual(['id_usuario', 'id_trabajador', 'cargo', 'usuario', 'clave', 'escritorio', 'web', 'contable', 'habilitado']);
    expect(field('id_trabajador')).toMatchObject({ kind: 'lookup', label: 'Trabajador', required: true, fill: { cargo: 'tipo_trabajador' }, fillReadOnly: ['cargo'], source: { catalog: 'trabajadores', where: { estado: true } } });
    expect(field('clave')).toMatchObject({ kind: 'password', label: 'Contraseña', max: 20, confirm: true });
    expect(['escritorio', 'web', 'contable', 'habilitado'].map((name) => [field(name).kind, field(name).default])).toEqual(Array(4).fill(['boolean', false]));
  });

  it('hangs under Generales with the menu leaf and the 13-flag grant (R-REG-19)', () => {
    expect(entry.menu).toEqual({ parent: 'mnGenerales', label: 'Usuario' });
    expect((menu as any[]).find((n) => n.nombre === 'mi_usuario')).toMatchObject({ descripcion: 'Usuario', menu_item: 'S', id_menu_padre: 2 });
    const grant = (permissions as any).mi_usuario;
    expect(Object.keys(grant)).toHaveLength(13);
    expect(grant).toMatchObject({ add: true, modify: true, eliminate: true, clone: true, details: true });
  });
});

describeRegistryContract(
  'in-browser mock (usuarios)',
  (slug, ctx) => {
    const mock = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ctx, delayMs: 0 });
    return { catalog: mock.catalog(slug), lookup: mock.lookup };
  },
  USUARIO_CASES,
);

const server = useTestServer({ seed: loadSeed(dataDir) });
describeRegistryContract(
  'http mock server (usuarios)',
  (slug, ctx) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ctx });
    return { catalog: createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  },
  USUARIO_CASES,
);

describe('S-MOCK-38 usuarios per tenant', () => {
  it('each tenant lists only its own users on both transports', async () => {
    for (const [tenant, names] of [['demo', ['admin', 'cajero', 'bloqueado', 'soloweb']], ['botica', ['admin']]] as const) {
      const http = await server.call('GET', '/v1/usuarios', { tenant });
      expect(http.body.items.map((u: any) => u.usuario)).toEqual(names);
      const mock = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: tenant }), getRequestContext: () => ({}), delayMs: 0 });
      expect((await mock.catalog('usuarios').list({})).items.map((u: any) => u.usuario)).toEqual(names);
    }
  });
});
