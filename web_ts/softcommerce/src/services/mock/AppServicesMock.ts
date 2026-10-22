import {
  getMenu,
  getParams,
  getPermissions,
  listEmpresas,
  listPuntosVenta,
  login,
  sessionOptions,
} from '../../../mock-server/core/auth.js';
import { createRecord, deleteRecord, getRecord, listCatalog, updateRecord } from '../../../mock-server/core/catalog.js';
import { MockError } from '../../../mock-server/core/errors.js';
import { createStore } from '../../../mock-server/core/store.js';
import { childrenOf } from '../../../mock-server/core/ubigeo.js';
import { ApiError } from '../ApiError';
import type { InterAuthService } from '../InterAuthService';
import type { InterCatalogService, Page } from '../InterCatalogService';
import type { InterLookupService } from '../InterLookupService';
import type { InterShellService } from '../InterShellService';
import type { SessionContext } from '../httpClient';
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
  /** Simulated latency; tests pass 0. */
  delayMs?: number;
}

export interface AppServicesMock {
  auth: InterAuthService;
  shell: InterShellService;
  lookup: InterLookupService;
  /** One service per catalog name, all over the same store. */
  catalog<T>(catalog: string): InterCatalogService<T>;
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
  { getSession = () => ({}), delayMs = DEFAULT_DELAY_MS }: AppServicesMockOptions = {},
): AppServicesMock {
  const fixture = FIXTURES[scenario];
  const store = fixture.kind === 'data' ? createStore(fixture.seed) : undefined;

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
        return getMenu(s).items;
      }),
    permissions: (formId) =>
      call((s) => {
        tenantGate(s);
        return getPermissions(s, formId);
      }),
  };

  const lookup: InterLookupService = {
    empresas: () => call((s) => listEmpresas(s, tenantGate(s)).items),
    ubigeoChildren: (parent) => call((s) => childrenOf(s, parent).items),
  };

  const catalog = <T>(name: string): InterCatalogService<T> => ({
    list: ({ page, pageSize, filters } = {}) =>
      call((s) => listCatalog(s, tenantGate(s), name, { page, pageSize, ...filters }) as Page<T>),
    get: (id) => call((s) => getRecord(s, tenantGate(s), name, id) as T),
    create: (values) => call((s) => createRecord(s, tenantGate(s), name, values) as T),
    update: (id, values) => call((s) => updateRecord(s, tenantGate(s), name, id, values) as T),
    remove: (id) => call((s) => deleteRecord(s, tenantGate(s), name, id)),
  });

  return { auth, shell, lookup, catalog };
}
