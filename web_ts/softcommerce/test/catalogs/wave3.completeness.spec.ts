import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import menu from '../../mock-server/data/menu.json';
import permissions from '../../mock-server/data/permissions.json';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { PERMISSION_FLAGS } from '../../src/domain/permissions';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { CUSTOM_SCREENS, customScreenProblems } from './menuPermissions';

/**
 * W3-20 20.5: the cross-cutting checks of Wave 3 (S-MOCK-35, S-MST-37, S-REG-29, S-CRUD-50, S-REF-39, the security spec and the cross-UI specs). Wave 3 adds
 * eight masters and two custom screens; every requirement R-MST / R-ANX / R-PRM names a test that proves it, and the W1 / W2 suites changed only where R-MST-18 says.
 */
const MASTERS = ['bancos', 'trabajadores', 'vendedores', 'transportistas', 'proveedores', 'clientes', 'items', 'usuarios'];
const here = (path: string) => fileURLToPath(new URL(`../../${path}`, import.meta.url));
const entries = REGISTRY.entries as any[];

describe('every Wave 3 master and custom screen is reachable and granted (R-MST-1, R-REG-9, R-REG-19)', () => {
  it('the registry has the eight masters as writable entries (usuarios and trabajadores included)', () => {
    for (const slug of MASTERS) expect(entries.find((e) => e.slug === slug)?.readOnly, `${slug} writable`).toBeFalsy();
  });

  it.each(MASTERS)('%s has a menu node and the 13 permission flags (its form is checked in formRegistry.wave3.spec)', (slug) => {
    const entry = REGISTRY.bySlug.get(slug);
    expect(entry.formId, `${slug} formId`).toBeTruthy();
    expect((menu as any[]).find((n) => n.nombre === entry.formId)?.descripcion, `${slug} menu node`).toBe(entry.menu.label);
    const grant = (permissions as Record<string, any>)[entry.formId];
    expect(PERMISSION_FLAGS.map((flag) => typeof grant?.[flag])).toEqual(PERMISSION_FLAGS.map(() => 'boolean'));
  });

  it('the two custom screens (Seguridad - Perfil and Acciones de Socio) have node and grant', () => {
    expect(CUSTOM_SCREENS.map((s) => s.formId)).toEqual(['mi_SeguridadPerfil', 'miAccionSocio']);
    expect(customScreenProblems(CUSTOM_SCREENS, menu, permissions)).toEqual([]);
  });
});

/** Requirement -> the id a test file mentions (the requirement or one of its scenarios) and up to two files that do. */
const REQUIREMENT_CASES: { id: string; token: string; files: string[] }[] = [
  { id: 'R-MST-1', token: 'R-MST-1', files: ['src/catalogs/registry.trabajadores.ui.spec.tsx', 'test/catalogs/bancos.cases.ts'] },
  { id: 'R-MST-2', token: 'R-MST-2', files: ['src/catalogs/registry.bancos.ui.spec.tsx', 'src/catalogs/registry.transportistas.ui.spec.tsx'] },
  { id: 'R-MST-3', token: 'R-MST-3', files: ['test/catalogs/bancos.cases.ts', 'test/catalogs/bancos.spec.ts'] },
  { id: 'R-MST-4', token: 'R-MST-4', files: ['test/catalogs/trabajadores.cases.ts', 'test/catalogs/trabajadores.spec.ts'] },
  { id: 'R-MST-5', token: 'R-MST-5', files: ['test/catalogs/transportistas.cases.ts', 'test/catalogs/transportistas.spec.ts'] },
  { id: 'R-MST-6', token: 'R-MST-6', files: ['src/catalogs/registry.vehiculos.propietario.ui.spec.tsx', 'src/catalogs/registry.vehiculos.ui.spec.tsx'] },
  { id: 'R-MST-7', token: 'R-MST-7', files: ['mock-server/core/backings.spec.ts', 'src/catalogs/registry.usuarios.ui.spec.tsx'] },
  { id: 'R-MST-8', token: 'S-MST-15', files: ['test/catalogs/usuarios.cases.ts'] },
  { id: 'R-MST-9', token: 'R-MST-9', files: ['src/shared/ui/LookupField/fill.spec.tsx', 'test/catalogs/vendedores.cases.ts'] },
  { id: 'R-MST-10', token: 'R-MST-10', files: ['mock-server/registry/schema.columns.gate.spec.ts', 'src/catalogs/registry.clientes.padrones.ui.spec.tsx'] },
  { id: 'R-MST-11', token: 'R-MST-11', files: ['mock-server/core/messages.dialog.spec.ts', 'mock-server/core/predicates.byParam.spec.ts'] },
  { id: 'R-MST-12', token: 'R-MST-12', files: ['src/catalogs/registry.clientes.creditos.ui.spec.tsx', 'src/catalogs/registry.clientes.sustitutos.ui.spec.tsx'] },
  { id: 'R-MST-13', token: 'R-MST-13', files: ['test/catalogs/proveedores.cases.ts', 'test/catalogs/proveedores.spec.ts'] },
  { id: 'R-MST-14', token: 'R-MST-14', files: ['src/catalogs/registry.items.ui.spec.tsx', 'test/catalogs/items.cases.ts'] },
  { id: 'R-MST-15', token: 'R-MST-15', files: ['test/catalogs/items.almacenes.spec.ts', 'test/catalogs/items.cases.ts'] },
  { id: 'R-MST-16', token: 'R-MST-16', files: ['src/views/uisocioacciones/UiSocioAcciones.spec.tsx'] },
  { id: 'R-MST-17', token: 'R-MST-17', files: ['test/catalogs/trabajadores.spec.ts', 'test/catalogs/usuarios.cases.ts'] },
  { id: 'R-MST-18', token: 'R-MST-18', files: ['src/catalogs/registry.trabajadorPuntoVenta.ui.spec.tsx', 'test/catalogs/completeness.spec.ts'] },
  { id: 'R-ANX-1', token: 'R-ANX-1', files: ['mock-server/registry/presets.anexo.spec.ts', 'test/catalogs/bancos.spec.ts'] },
  { id: 'R-ANX-2', token: 'R-ANX-2', files: ['mock-server/core/activacion.spec.ts', 'src/views/uimasterregister/anexoActions.spec.tsx'] },
  { id: 'R-ANX-3', token: 'R-ANX-3', files: ['mock-server/core/rules.activacion.spec.ts', 'src/domain/crud/anexoRules.spec.ts'] },
  { id: 'R-ANX-4', token: 'R-ANX-4', files: ['mock-server/core/activacion.spec.ts', 'mock-server/core/rules.activacion.spec.ts'] },
  { id: 'R-ANX-5', token: 'R-ANX-5', files: ['mock-server/core/rules.activacion.spec.ts'] },
  { id: 'R-ANX-6', token: 'S-ANX-8', files: ['src/catalogs/registry.vendedores.ui.spec.tsx', 'src/views/uimasterregister/anexoActions.spec.tsx'] },
  { id: 'R-ANX-7', token: 'R-ANX-7', files: ['mock-server/core/rules.padron.spec.ts', 'src/domain/crud/padronRules.spec.ts'] },
  { id: 'R-ANX-8', token: 'R-ANX-8', files: ['mock-server/core/rules.padron.spec.ts', 'test/catalogs/clientes.padrones.spec.ts'] },
  { id: 'R-ANX-9', token: 'R-ANX-9', files: ['mock-server/registry/presets.anexo.spec.ts', 'test/catalogs/bancos.cases.ts'] },
  { id: 'R-ANX-10', token: 'R-ANX-10', files: ['test/catalogs/choferes.activacion.spec.ts'] },
  { id: 'R-PRM-1', token: 'R-PRM-1', files: ['src/views/uiseguridadperfil/perfilList.spec.tsx'] },
  { id: 'R-PRM-2', token: 'R-PRM-2', files: ['src/views/uiseguridadperfil/perfilList.spec.tsx', 'src/views/uiseguridadperfil/perfilTree.spec.tsx'] },
  { id: 'R-PRM-3', token: 'R-PRM-3', files: ['src/views/uiseguridadperfil/perfilPermisos.spec.tsx'] },
  { id: 'R-PRM-4', token: 'R-PRM-4', files: ['src/views/uiseguridadperfil/perfilPermisos.spec.tsx'] },
  { id: 'R-PRM-5', token: 'R-PRM-5', files: ['mock-server/registry/schema.reserved.spec.ts'] },
  { id: 'R-PRM-6', token: 'R-PRM-6', files: ['src/catalogs/registry.usuarios.series.spec.ts', 'src/views/uicrudlist/UiCrudList.listActions.spec.tsx'] },
  { id: 'R-PRM-7', token: 'R-PRM-7', files: ['mock-server/http/series.actions.spec.ts', 'mock-server/registry/usuarioCorrelativos.series.spec.ts'] },
  { id: 'R-PRM-8', token: 'S-PRM-16', files: ['src/session/grantSnapshot.spec.ts'] },
];
const REQUIREMENT_IDS = [
  ...Array.from({ length: 18 }, (_, i) => `R-MST-${i + 1}`),
  ...Array.from({ length: 10 }, (_, i) => `R-ANX-${i + 1}`),
  ...Array.from({ length: 8 }, (_, i) => `R-PRM-${i + 1}`),
];

describe('every requirement R-MST-1..18, R-ANX-1..10 and R-PRM-1..8 has a case', () => {
  it('lists each requirement exactly once', () => {
    expect(REQUIREMENT_CASES.map((c) => c.id)).toEqual(REQUIREMENT_IDS);
  });

  it.each(REQUIREMENT_CASES)('$id is proved in $files', ({ token, files }) => {
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      expect(existsSync(here(file)), `${file} exists`).toBe(true);
      expect(readFileSync(here(file), 'utf8'), `${file} names ${token}`).toMatch(new RegExp(`\\b${token}\\b`));
    }
  });
});

/** The cross-UI and compatibility scenarios of the closeout, each with the suite that proves it. */
const CROSS_CASES = [
  { token: 'S-PRM-14', file: 'test/cross/seriesCorrelativo.spec.tsx', what: 'an authorization made in Autorizar Series shows in the Usuario correlativos register' },
  { token: 'S-MST-11', file: 'test/catalogs/transportistas.vehiculos.spec.ts', what: 'a vehiculo created in the Transportista grid is in the Vehiculos catalog' },
  { token: 'S-AUTH-23', file: 'test/catalogs/usuarios.login.spec.ts', what: 'a created user logs in with its password' },
  { token: 'S-PRM-16', file: 'src/session/grantSnapshot.spec.ts', what: 'a perfil edit applies at the next login' },
  { token: 'S-REF-39', file: 'src/catalogs/registry.excluded.ui.spec.tsx', what: 'no excluded behavior is rendered' },
  { token: 'S-INV-19', file: 'scripts/inventory/inventory.realtree.spec.ts', what: 'the W3 bucket of the inventory is exactly the 23 classes' },
  { token: 'S-MST-33', file: 'src/views/uisocioacciones/UiSocioAcciones.spec.tsx', what: 'Socio acciones price side' },
  { token: 'S-MOCK-54', file: 'mock-server/core/socioAcciones.spec.ts', what: 'socio-acciones composite' },
];

describe('the cross-UI and compatibility scenarios stay in place', () => {
  it.each(CROSS_CASES)('$token: $what', ({ token, file }) => {
    expect(existsSync(here(file)), `${file} exists`).toBe(true);
    expect(readFileSync(here(file), 'utf8')).toMatch(new RegExp(`\\b${token}\\b`));
  });
});

/**
 * R-MST-18 / S-REG-29 / S-CRUD-50: the W1 and W2 test files that Wave 3 changed, against the commit that archived Wave 2. Each is recorded in R-MST-18 (and in the
 * apply-progress of its slice); a W1 / W2 test edited without a record fails here. The check needs the git history, so it is skipped where the base is not available.
 * The range ends at the merge that closed Wave 3: later fixes that edit a W1 / W2 test are outside what R-MST-18 records.
 */
const W2_BASE = '7c99e11';
const W3_END = '7c3d915c';
const RECORDED_W2_TEST_EDITS = [
  'scripts/inventory/inventory.spec.ts',
  'src/catalogs/registry.choferes.ui.spec.tsx',
  'src/catalogs/registry.excluded.ui.spec.tsx',
  'src/catalogs/registry.trabajadorPuntoVenta.ui.spec.tsx',
  'src/catalogs/registry.vehiculos.ui.spec.tsx',
  'test/catalogs/completeness.spec.ts',
  'test/catalogs/docIdentidad.spec.ts',
  'test/catalogs/lookups.people.spec.ts',
  'test/catalogs/lookups.spec.ts',
  'test/catalogs/menuPermissions.spec.ts',
  'test/catalogs/menuPermissions.ts',
  'test/catalogs/reference.cases.ts',
  'test/catalogs/reference.spec.ts',
];

function changedW2Tests(): string[] | undefined {
  const cwd = dirname(here('package.json'));
  try {
    for (const ref of [W2_BASE, W3_END]) execFileSync('git', ['cat-file', '-e', `${ref}^{commit}`], { cwd, stdio: 'ignore' });
    const out = execFileSync('git', ['diff', '--name-status', '--relative', W2_BASE, W3_END, '--', '.'], { cwd, encoding: 'utf8' });
    return out
      .split(/\r?\n/)
      .filter((line) => line !== '' && !line.startsWith('A'))
      .map((line) => line.split('\t').at(-1) as string)
      .filter((path) => /\.(spec|cases)\.tsx?$/.test(path) || /^test\//.test(path))
      .sort();
  } catch {
    return undefined;
  }
}

describe('S-REG-29 / S-CRUD-50 the W1 and W2 suites changed only where R-MST-18 records', () => {
  const changed = changedW2Tests();

  it.skipIf(changed === undefined)('the modified W1 / W2 test files are exactly the recorded ones', () => {
    expect(changed).toEqual([...RECORDED_W2_TEST_EDITS].sort());
  });
});

/** The security spec (R-AUTH-12, R-MOCK-23): no response of any route carries a password property or a hash. */
const FORBIDDEN_KEY = /^(clave|clave_confirmacion|clave_hash|password|passwordHash|hash)$/i;
const server = useTestServer({ dataDir: fileURLToPath(new URL('../../mock-server/data', import.meta.url)) });
const get = (path: string) => server.call('GET', path, { tenant: 'demo', headers: { 'X-Empresa-Id': '1', 'X-User-Id': '1' } });

function keysOf(value: unknown, keys: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((item) => keysOf(item, keys));
  else if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) { keys.push(key); keysOf(item, keys); }
  return keys;
}

describe('no `clave*` or hash property in any response of the mock server', () => {
  const slugs = entries.map((e) => e.slug);

  it.each(slugs)('GET /v1/%s, its first row and its lookup carry no password key', async (slug) => {
    const list = await get(`/v1/${slug}`);
    expect([slug, list.status]).toEqual([slug, 200]);
    expect(keysOf(list.body).filter((key) => FORBIDDEN_KEY.test(key))).toEqual([]);
    const first = list.body.items?.[0];
    if (first) {
      const one = await get(`/v1/${slug}/${first[REGISTRY.bySlug.get(slug).idKey]}`);
      expect(keysOf(one.body).filter((key) => FORBIDDEN_KEY.test(key))).toEqual([]);
    }
    expect(keysOf((await get(`/v1/lookups/${slug}`)).body).filter((key) => FORBIDDEN_KEY.test(key))).toEqual([]);
  });

  it.each(['/v1/socio-acciones', '/menu', '/forms/permissions', '/v1/params', '/auth/session-options', '/v1/tipos-trabajador-perfil/1/menu', '/v1/tipos-trabajador-perfil/1/permisos'])(
    '%s carries no password key',
    async (path) => {
      const res = await get(path);
      expect(res.status).toBe(200);
      expect(keysOf(res.body).filter((key) => FORBIDDEN_KEY.test(key))).toEqual([]);
    },
  );
});

/** S-MOCK-35 / S-MST-37: a probe of every master, run on the in-browser mock and the HTTP mock, must read the same. */
const session = () => ({ tenantId: 'demo' });
const ctx = { userId: '7', empresaId: '1' };

async function outcome(run: () => Promise<any>) {
  try {
    return { ok: true, value: await run() };
  } catch (e: any) {
    return { ok: false, status: e.status, code: e.code, fields: (e.details ?? []).map((d: any) => d.field), messages: (e.details ?? []).map((d: any) => d.message) };
  }
}

async function probe(catalog: any, lookup: any, slug: string) {
  const list: any = await catalog.list({});
  const first = list.items[0];
  const idKey = REGISTRY.bySlug.get(slug).idKey;
  return {
    total: list.pagination.total,
    keys: Object.keys(first).sort(),
    first,
    get: await outcome(() => catalog.get(String(first[idKey]))),
    empty: await outcome(() => catalog.create({})),
    options: await outcome(() => lookup.options(slug)),
  };
}

describe('S-MOCK-35 / S-MST-37 dual-source parity across the eight masters and Socio acciones', () => {
  it.each(MASTERS)('%s answers the same on the in-browser mock and the HTTP mock', async (slug) => {
    const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 });
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    const [a, b] = [await probe(mock.catalog(slug), mock.lookup, slug), await probe(createCatalogServiceHttp(client, slug), createLookupServiceHttp(client), slug)];
    expect(JSON.parse(JSON.stringify(b))).toEqual(JSON.parse(JSON.stringify(a)));
  });
});
