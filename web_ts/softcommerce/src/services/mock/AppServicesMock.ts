import {
  getAllPermissions,
  getMenu,
  getParams,
  getPermissions,
  listEmpresas,
  listPuntosVenta,
  login,
  sessionOptions,
} from '../../../mock-server/core/auth.js';
import { runChildAction, runEntryAction } from '../../../mock-server/core/actions.js';
import { createRecord, deleteRecord, getRecord, listCatalog, updateRecord } from '../../../mock-server/core/catalog.js';
import { MockError } from '../../../mock-server/core/errors.js';
import { getPerfilMenu, getPerfilPermiso, getPerfilPermisos, putPerfilMenu, putPerfilPermisos } from '../../../mock-server/core/grants.js';
import { lookupOptions } from '../../../mock-server/core/lookups.js';
import { createChild, getChild, listChild, removeChild, updateChild } from '../../../mock-server/core/nested.js';
import { getSocioAcciones, putSocioAcciones, withSocioAccionesSeed } from '../../../mock-server/core/socioAcciones.js';
import { createStore } from '../../../mock-server/core/store.js';
import { childrenOf } from '../../../mock-server/core/ubigeo.js';
import socioAccionesSeed from '../../../mock-server/data/catalogs/socio-acciones.json';
import { ApiError } from '../ApiError';
import type { InterAuthService } from '../InterAuthService';
import type { InterActionService } from '../InterActionService';
import type { InterCatalogService, Page } from '../InterCatalogService';
import type { InterChildService } from '../InterChildService';
import type { InterGrantsService } from '../InterGrantsService';
import type { InterLookupService } from '../InterLookupService';
import type { Permissions } from '../../domain/permissions';
import type { InterPerfilGrantsService, PerfilForm } from '../InterPerfilGrantsService';
import type { InterSocioAccionesService } from '../InterSocioAccionesService';
import type { InterShellService } from '../InterShellService';
import type { RequestContext, SessionContext } from '../httpClient';
import type { ApiScenario } from '../serviceComposer';
import { errorServidorFixture } from './fixtures/errorServidor.fixture';
import { exitosoFixture } from './fixtures/exitoso.fixture';
import type { ScenarioFixture } from './fixtures/types';
import { vacioFixture } from './fixtures/vacio.fixture';

const FIXTURES: Record<ApiScenario, ScenarioFixture> = {
  exitoso: exitosoFixture,
  vacio: vacioFixture,
  errorServidor: errorServidorFixture,
};

const DEFAULT_DELAY_MS = 150;

export interface AppServicesMockOptions {
  getSession?: () => SessionContext;
  /** Live user and empresa, the same values the HTTP client sends as headers (D13). */
  getRequestContext?: () => RequestContext;
  /** Simulated latency; tests pass 0. */
  delayMs?: number;
  /** Registry and seed under test; default to the real ones (the same the HTTP server loads). */
  registry?: Store['registry'];
  seed?: Record<string, any>;
}

export interface AppServicesMock {
  auth: InterAuthService;
  shell: InterShellService;
  /** The login snapshot of the acting user's grants (R-AUTH-11). */
  grants: InterGrantsService;
  /** The perfil permission editor (R-PRM-5), over the same store as the HTTP routes. */
  perfilGrants: InterPerfilGrantsService;
  /** The Socio acciones screen (R-MOCK-26), over the same store as the HTTP routes. */
  socioAcciones: InterSocioAccionesService;
  lookup: InterLookupService;
  /** One service per catalog name, all over the same store. */
  catalog<T>(catalog: string): InterCatalogService<T>;
  /** The nested child routes of one catalog (R-MOCK-19), over the same store. */
  children(catalog: string): InterChildService;
  /** The immediate row actions of one catalog (R-MOCK-22), over the same store. */
  actions(catalog: string): InterActionService;
}

type Store = ReturnType<typeof createStore>;

const newTraceId = () => crypto.randomUUID();

/** Same `ApiError` the http client produces, from a core `MockError`. */
function toApiError(error: unknown): ApiError {
  const traceId = newTraceId();
  return error instanceof MockError
    ? new ApiError(error.status, { code: error.code, message: error.message, details: error.details, traceId })
    : new ApiError(500, { code: 'INTERNAL_ERROR', message: 'Unexpected server error', details: [], traceId });
}

/**
 * All in-browser mock services over `mock-server/core` and the shared seed, so
 * mock mode applies the same rules as the HTTP server. One module for every
 * domain: it lands in a single lazy chunk.
 */
export function createAppServicesMock(
  scenario: ApiScenario,
  { getSession = () => ({}), getRequestContext = () => ({}), delayMs = DEFAULT_DELAY_MS, registry, seed }: AppServicesMockOptions = {},
): AppServicesMock {
  const fixture = FIXTURES[scenario];
  const store = fixture.kind === 'data' ? createStore(seed ?? withSocioAccionesSeed(fixture.seed, socioAccionesSeed), registry) : undefined;

  /** One simulated request: latency, scenario failure, then the core rule mapped to ApiError. */
  const call = async <T>(rule: (store: Store) => T): Promise<T> => {
    await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    if (fixture.kind === 'error') {
      throw new ApiError(fixture.status, {
        code: fixture.code,
        message: fixture.message,
        details: [],
        traceId: newTraceId(),
      });
    }
    try {
      return rule(store!);
    } catch (error) {
      throw toApiError(error);
    }
  };

  /** Mirrors the HTTP tenant gate: 400 when missing, 404 when unknown. */
  const tenantGate = (s: Store, explicit?: string): string => {
    const tenantId = explicit ?? getSession().tenantId;
    if (!tenantId) throw new MockError(400, 'TENANT_REQUIRED', 'X-Tenant-Id header is required');
    if (!s.hasTenant(tenantId)) throw new MockError(404, 'TENANT_NOT_FOUND', `Unknown tenant: ${tenantId}`);
    return tenantId;
  };

  /** The acting user and the tenant the grants resolve for, like `X-User-Id` and `X-Tenant-Id` over HTTP. */
  const grantContext = (s: Store) => ({ ...getRequestContext(), tenantId: tenantGate(s) });

  const auth: InterAuthService = {
    sessionOptions: () => call((s) => sessionOptions(s).items),
    login: (tenantId, credentials) => call((s) => login(s, tenantGate(s, tenantId), credentials)),
    empresas: () => call((s) => listEmpresas(s, tenantGate(s)).items),
    puntosVenta: (idEmpresa) => call((s) => listPuntosVenta(s, tenantGate(s), { id_empresa: idEmpresa }).items),
    params: () => call((s) => getParams(s, tenantGate(s))),
  };

  const shell: InterShellService = {
    menu: () =>
      call((s) => {
        tenantGate(s);
        return getMenu(s, grantContext(s)).items;
      }),
    permissions: (formId) =>
      call((s) => {
        tenantGate(s);
        return getPermissions(s, formId, grantContext(s));
      }),
  };

  const grants: InterGrantsService = {
    snapshot: () =>
      call((s) => {
        const ctx = grantContext(s);
        return { menu: getMenu(s, ctx).items, permissions: getAllPermissions(s, ctx) as any };
      }),
  };

  const perfilGrants: InterPerfilGrantsService = {
    menu: (perfilId) => call((s) => getPerfilMenu(s, tenantGate(s), perfilId).items),
    saveMenu: (perfilId, changes) => call((s) => putPerfilMenu(s, tenantGate(s), perfilId, changes).items),
    permisos: (perfilId) => call((s) => getPerfilPermisos(s, tenantGate(s), perfilId).items as PerfilForm[]),
    permiso: (perfilId, formId) => call((s) => getPerfilPermiso(s, tenantGate(s), perfilId, formId) as Permissions),
    savePermisos: (perfilId, changes) => call((s) => (putPerfilPermisos(s, tenantGate(s), perfilId, changes) as { items: PerfilForm[] }).items),
    savePermiso: (perfilId, formId, changes) => call((s) => putPerfilPermisos(s, tenantGate(s), perfilId, changes, formId) as Permissions),
  };

  const socioAcciones: InterSocioAccionesService = {
    load: () => call((s) => getSocioAcciones(s, tenantGate(s)) as any),
    save: (body) => call((s) => putSocioAcciones(s, tenantGate(s), body) as any),
  };

  const lookup: InterLookupService = {
    empresas: () => call((s) => listEmpresas(s, tenantGate(s)).items),
    ubigeoChildren: (parent) => call((s) => childrenOf(s, parent).items),
    options: (slug, filters) => call((s) => lookupOptions(s, tenantGate(s), slug, filters, getRequestContext()).items),
  };

  const catalog = <T>(name: string): InterCatalogService<T> => ({
    list: ({ page, pageSize, filters } = {}) =>
      call((s) => listCatalog(s, tenantGate(s), name, { page, pageSize, ...filters }, getRequestContext()) as Page<T>),
    get: (id) => call((s) => getRecord(s, tenantGate(s), name, id, getRequestContext()) as T),
    create: (values) => call((s) => createRecord(s, tenantGate(s), name, values, getRequestContext()) as T),
    update: (id, values) => call((s) => updateRecord(s, tenantGate(s), name, id, values, getRequestContext()) as T),
    remove: (id) => call((s) => deleteRecord(s, tenantGate(s), name, id, getRequestContext())),
  });

  const children = (name: string): InterChildService => ({
    list: (parentId, child, { page, pageSize, filters } = {}) =>
      call((s) => listChild(s, tenantGate(s), name, parentId, child, { page, pageSize, ...filters }, getRequestContext()) as Page<any>),
    get: (parentId, child, id) => call((s) => getChild(s, tenantGate(s), name, parentId, child, id, getRequestContext())),
    create: (parentId, child, values) => call((s) => createChild(s, tenantGate(s), name, parentId, child, values, getRequestContext())),
    update: (parentId, child, id, values) => call((s) => updateChild(s, tenantGate(s), name, parentId, child, id, values, getRequestContext())),
    remove: (parentId, child, id) => call((s) => removeChild(s, tenantGate(s), name, parentId, child, id, getRequestContext())),
  });

  const actions = (name: string): InterActionService => ({
    run: (target, action, input = {}) =>
      call((s) =>
        target.child === undefined
          ? runEntryAction(s, tenantGate(s), name, target.id, action, input, getRequestContext())
          : runChildAction(s, tenantGate(s), name, target.id, target.child, target.childId, action, input, getRequestContext()),
      ) as Promise<any>,
  });

  return { auth, shell, grants, perfilGrants, socioAcciones, lookup, catalog, children, actions };
}
