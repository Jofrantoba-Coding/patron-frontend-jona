import { ApiError, toApiError } from './ApiError';

/** What the client needs from the current session; empty before login. */
export interface SessionContext {
  tenantId?: string;
  token?: string;
}

/** Who is acting, when known: sent as `X-User-Id` / `X-Empresa-Id` (D13). Never required by W1 routes. */
export interface RequestContext {
  userId?: string;
  empresaId?: string;
}

export interface HttpClientOptions {
  baseUrl: string;
  fetchFn?: typeof fetch;
  /** Reads the live session at request time (tenant and token). */
  getSession?: () => SessionContext;
  /** Reads the live user and empresa at request time; each header is sent only when present. */
  getRequestContext?: () => RequestContext;
  newCorrelationId?: () => string;
}

export interface RequestOptions {
  /** Explicit tenant, used at login before a session exists; wins over the session. */
  tenantId?: string;
  query?: Record<string, string | undefined>;
  body?: unknown;
}

export interface HttpClient {
  request<T = unknown>(method: string, path: string, options?: RequestOptions): Promise<T>;
}

function buildUrl(baseUrl: string, path: string, query: RequestOptions['query']): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) params.set(key, value);
  }
  const qs = params.toString();
  return `${baseUrl}${path}${qs ? `?${qs}` : ''}`;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

export function createHttpClient({
  baseUrl,
  fetchFn = (...args) => fetch(...args),
  getSession = () => ({}),
  getRequestContext = () => ({}),
  newCorrelationId = () => crypto.randomUUID(),
}: HttpClientOptions): HttpClient {
  return {
    async request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
      const session = getSession();
      const tenantId = options.tenantId ?? session.tenantId;
      const correlationId = newCorrelationId();

      const headers: Record<string, string> = { 'X-Correlation-Id': correlationId };
      if (tenantId) headers['X-Tenant-Id'] = tenantId;
      if (session.token) headers.Authorization = `Bearer ${session.token}`;
      const { userId, empresaId } = getRequestContext();
      if (userId) headers['X-User-Id'] = userId;
      if (empresaId) headers['X-Empresa-Id'] = empresaId;
      if (options.body !== undefined) headers['Content-Type'] = 'application/json';

      let response: Response;
      try {
        response = await fetchFn(buildUrl(baseUrl, path, options.query), {
          method,
          headers,
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
        });
      } catch {
        throw new ApiError(0, {
          code: 'NETWORK_ERROR',
          message: 'Could not reach the server',
          details: [],
          traceId: correlationId,
        });
      }

      const body = await readJson(response);
      if (!response.ok) throw toApiError(response.status, body, correlationId);
      return body as T;
    },
  };
}
