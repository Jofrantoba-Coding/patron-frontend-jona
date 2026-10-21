import { lazyService } from './lazyService';

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
