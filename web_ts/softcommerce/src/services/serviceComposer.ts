import { createAuthServiceHttp } from './AuthServiceHttp';
import type { InterAuthService } from './InterAuthService';
import { createCatalogServiceHttp } from './CatalogServiceHttp';
import type { InterCatalogService } from './InterCatalogService';
import type { InterLookupService } from './InterLookupService';
import type { InterShellService } from './InterShellService';
import { createLookupServiceHttp } from './LookupServiceHttp';
import { createShellServiceHttp } from './ShellServiceHttp';
import { createHttpClient, type RequestContext, type SessionContext } from './httpClient';
import { lazyService } from './lazyService';
import type { AppServicesMock } from './mock/AppServicesMock';

export const API_MODES = ['mock', 'http'] as const;
export const API_SCENARIOS = ['exitoso', 'vacio', 'errorServidor'] as const;

export type ApiMode = (typeof API_MODES)[number];
export type ApiScenario = (typeof API_SCENARIOS)[number];

/** Raw `import.meta.env` slice the composer reads. */
export interface ApiEnv {
  VITE_API_MODE?: string;
  VITE_API_SCENARIO?: string;
  VITE_API_URL?: string;
}

/** Validated configuration; `baseUrl` exists only in http mode. */
export type ApiConfig =
  | { mode: 'mock'; scenario: ApiScenario }
  | { mode: 'http'; scenario: ApiScenario; baseUrl: string };

function oneOf<T extends string>(name: string, value: string, allowed: readonly T[]): T {
  if (!(allowed as readonly string[]).includes(value)) {
    throw new Error(`${name} is invalid: "${value}". Allowed values: ${allowed.join(', ')}.`);
  }
  return value as T;
}

function parseBaseUrl(raw: string | undefined): string {
  if (!raw) throw new Error('VITE_API_URL is required when VITE_API_MODE=http.');
  try {
    new URL(raw);
  } catch {
    throw new Error(`VITE_API_URL is not a valid URL: "${raw}".`);
  }
  return raw.replace(/\/+$/, '');
}

/** Pure env parser: empty means undeclared (defaults apply); invalid values fail at startup. */
export function parseApiEnv(env: ApiEnv): ApiConfig {
  const mode = oneOf('VITE_API_MODE', env.VITE_API_MODE || 'mock', API_MODES);
  // The scenario is validated in every mode, even though only the mock consumes it.
  const scenario = oneOf('VITE_API_SCENARIO', env.VITE_API_SCENARIO || 'exitoso', API_SCENARIOS);
  return mode === 'http' ? { mode, scenario, baseUrl: parseBaseUrl(env.VITE_API_URL) } : { mode, scenario };
}

export interface ServiceSources<T> {
  createHttp: (baseUrl: string) => T;
  /** Must use a dynamic `import()` so the mock lands in its own chunk. */
  loadMock: (scenario: ApiScenario) => Promise<T>;
}

/** Picks the http implementation, or a lazy proxy that loads the mock on first call. */
export function composeService<T extends object>(config: ApiConfig, sources: ServiceSources<T>): T {
  return config.mode === 'http'
    ? sources.createHttp(config.baseUrl)
    : lazyService(() => sources.loadMock(config.scenario));
}

export interface ComposeDeps {
  fetchFn?: typeof fetch;
  /** Live session (tenant and token) read by every post-login request. */
  getSession?: () => SessionContext;
  /** Live user and empresa sent as session headers (D13). */
  getRequestContext?: () => RequestContext;
}

export interface AppServices {
  auth: InterAuthService;
  shell: InterShellService;
  lookup: InterLookupService;
  /** A service for one catalog (`/v1/{catalog}`); cheap to build, nothing loads until a call. */
  catalog<T>(catalog: string): InterCatalogService<T>;
}

/** Validates the env and builds every service. Throws a configuration error at startup. */
export function composeServices(env: ApiEnv, { fetchFn, getSession, getRequestContext }: ComposeDeps = {}): AppServices {
  const config = parseApiEnv(env);
  const client = (baseUrl: string) => createHttpClient({ baseUrl, fetchFn, getSession, getRequestContext });

  // One mock instance (one store) shared by every domain's lazy proxy.
  let mock: Promise<AppServicesMock> | undefined;
  const loadMock = (scenario: ApiScenario) =>
    (mock ??= import('./mock/AppServicesMock').then((m) => m.createAppServicesMock(scenario, { getSession, getRequestContext })));

  return {
    // Dynamic import: fixtures, seed and core land in a separate chunk, never in the entry.
    auth: composeService<InterAuthService>(config, {
      createHttp: (baseUrl) => createAuthServiceHttp(client(baseUrl)),
      loadMock: async (scenario) => (await loadMock(scenario)).auth,
    }),
    shell: composeService<InterShellService>(config, {
      createHttp: (baseUrl) => createShellServiceHttp(client(baseUrl)),
      loadMock: async (scenario) => (await loadMock(scenario)).shell,
    }),
    lookup: composeService<InterLookupService>(config, {
      createHttp: (baseUrl) => createLookupServiceHttp(client(baseUrl)),
      loadMock: async (scenario) => (await loadMock(scenario)).lookup,
    }),
    catalog: <T>(name: string) =>
      composeService<InterCatalogService<T>>(config, {
        createHttp: (baseUrl) => createCatalogServiceHttp<T>(client(baseUrl), name),
        loadMock: async (scenario) => (await loadMock(scenario)).catalog<T>(name),
      }),
  };
}
