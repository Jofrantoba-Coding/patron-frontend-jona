import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import {
  getMenu, getParams, getPermissions, listEmpresas, listPuntosVenta, login, sessionOptions,
} from '../core/auth.js';
import { createRecord, deleteRecord, getRecord, listCatalog, updateRecord } from '../core/catalog.js';
import { MockError, notFound, toErrorBody } from '../core/errors.js';
import { createStore } from '../core/store.js';
import { REGISTRY } from '../registry/index.js';
import { childrenOf } from '../core/ubigeo.js';
import { loadSeed } from './loadSeed.js';

/**
 * @typedef {{ seed?: Record<string, any>, dataDir?: string, registry?: ReturnType<typeof import('../registry/schema.js').validateRegistry> }} AppOptions
 * @typedef {{ store: ReturnType<typeof createStore>, tenant: string, params: string[], query: Record<string, string>, body: any, ctx: import('../core/context.js').RequestContext }} Context
 * @typedef {{ method: string, pattern: RegExp, isPublic?: boolean, handle: (ctx: Context) => { status?: number, body?: unknown } }} Route
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Tenant-Id,X-Correlation-Id,X-User-Id,X-Empresa-Id',
  'Access-Control-Expose-Headers': 'X-Correlation-Id',
};

/**
 * Route table. Handlers delegate to `mock-server/core`; no business rule lives here.
 * The generic `/v1/{slug}` routes serve every registry entry (R-MOCK-9): the core resolves the slug.
 * @type {Route[]}
 */
const ROUTES = [
  { method: 'GET', pattern: /^\/auth\/session-options$/, isPublic: true, handle: ({ store }) => ({ body: sessionOptions(store) }) },
  { method: 'POST', pattern: /^\/auth\/login$/, handle: ({ store, tenant, body }) => ({ body: login(store, tenant, body) }) },
  { method: 'GET', pattern: /^\/menu$/, handle: ({ store }) => ({ body: getMenu(store) }) },
  { method: 'GET', pattern: /^\/forms\/([^/]+)\/permissions$/, handle: ({ store, params }) => ({ body: getPermissions(store, params[0]) }) },
  // Lookups come before the generic catalog routes so they win the match.
  { method: 'GET', pattern: /^\/v1\/ubigeo$/, handle: ({ store, query }) => ({ body: childrenOf(store, query.parent) }) },
  { method: 'GET', pattern: /^\/v1\/empresas$/, handle: ({ store, tenant }) => ({ body: listEmpresas(store, tenant) }) },
  { method: 'GET', pattern: /^\/v1\/puntos-venta$/, handle: ({ store, tenant, query }) => ({ body: listPuntosVenta(store, tenant, query) }) },
  { method: 'GET', pattern: /^\/v1\/params$/, handle: ({ store, tenant }) => ({ body: getParams(store, tenant) }) },
  { method: 'GET', pattern: /^\/v1\/([^/]+)$/, handle: ({ store, tenant, params, query, ctx }) => ({ body: listCatalog(store, tenant, params[0], query, ctx) }) },
  { method: 'POST', pattern: /^\/v1\/([^/]+)$/, handle: ({ store, tenant, params, body, ctx }) => ({ status: 201, body: createRecord(store, tenant, params[0], body ?? {}, ctx) }) },
  { method: 'GET', pattern: /^\/v1\/([^/]+)\/([^/]+)$/, handle: ({ store, tenant, params, ctx }) => ({ body: getRecord(store, tenant, params[0], params[1], ctx) }) },
  { method: 'PUT', pattern: /^\/v1\/([^/]+)\/([^/]+)$/, handle: ({ store, tenant, params, body, ctx }) => ({ body: updateRecord(store, tenant, params[0], params[1], body ?? {}, ctx) }) },
  {
    method: 'DELETE',
    pattern: /^\/v1\/([^/]+)\/([^/]+)$/,
    handle: ({ store, tenant, params, query, ctx }) => {
      // R-MOCK-7: only logical delete exists; any physical flag is refused.
      if ('physical' in query) throw new MockError(405, 'METHOD_NOT_ALLOWED', 'Physical delete is not supported');
      deleteRecord(store, tenant, params[0], params[1], ctx);
      return { status: 204 };
    },
  },
  { method: 'POST', pattern: /^\/__mock\/reset$/, isPublic: true, handle: ({ store }) => { store.reset(); return { status: 204 }; } },
];

/** @param {import('node:http').IncomingMessage} req */
async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString('utf8');
  if (text === '') return undefined;
  try {
    return JSON.parse(text);
  } catch {
    throw new MockError(400, 'INVALID_JSON', 'Request body is not valid JSON');
  }
}

/**
 * Creates the mock HTTP app over a JSON seed. The server is returned unstarted
 * so tests can listen on port 0.
 * @param {AppOptions} options
 */
export function createApp({ seed, dataDir, registry = REGISTRY }) {
  if (!seed && !dataDir) throw new Error('createApp needs a seed or a dataDir');
  const store = createStore(seed ?? loadSeed(/** @type {string} */ (dataDir), registry), registry);

  const server = createServer(async (req, res) => {
    const correlationId = String(req.headers['x-correlation-id'] || randomUUID());
    /** @param {number} status @param {unknown} [body] */
    const send = (status, body) => {
      const payload = body === undefined ? '' : JSON.stringify(body);
      res.writeHead(status, { ...CORS_HEADERS, 'X-Correlation-Id': correlationId, 'Content-Type': 'application/json' });
      res.end(payload);
    };
    try {
      if (req.method === 'OPTIONS') return send(204);
      const url = new URL(req.url ?? '/', 'http://localhost');
      let match = null;
      let route = null;
      for (const candidate of ROUTES) {
        if (candidate.method !== req.method) continue;
        match = candidate.pattern.exec(url.pathname);
        if (match) { route = candidate; break; }
      }
      if (!route || !match) throw notFound(`No route for ${req.method} ${url.pathname}`);

      const tenant = String(req.headers['x-tenant-id'] ?? '');
      if (!route.isPublic) {
        if (tenant === '') throw new MockError(400, 'TENANT_REQUIRED', 'The X-Tenant-Id header is required');
        if (!store.hasTenant(tenant)) throw new MockError(404, 'TENANT_NOT_FOUND', `Unknown tenant: ${tenant}`);
      }
      const result = route.handle({
        store,
        tenant,
        params: match.slice(1).map(decodeURIComponent),
        query: Object.fromEntries(url.searchParams),
        body: await readJson(req),
        // Session values for the core; only entries that need them read them (R-MOCK-13).
        ctx: { userId: String(req.headers['x-user-id'] ?? ''), empresaId: String(req.headers['x-empresa-id'] ?? '') },
      });
      send(result.status ?? 200, result.body);
    } catch (error) {
      const status = error instanceof MockError ? error.status : 500;
      send(status, toErrorBody(error, correlationId));
    }
  });

  return { server, store };
}
