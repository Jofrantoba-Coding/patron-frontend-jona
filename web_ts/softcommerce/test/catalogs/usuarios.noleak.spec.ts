import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { ApiError } from '../../src/services/ApiError';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';

/**
 * No-leak contract (S-MOCK-50, S-MST-17, S-AUTH-24, R-MOCK-23, R-AUTH-12): no response of any `usuarios` route, of `/v1/lookups/usuarios` or of `/auth/login`, success or
 * failure, ever carries a password property (`clave`, `clave_confirmacion`, `clave_hash`, `password`) or the tenants of a user, and no value in it repeats a password. The
 * 422 that names the field `clave` in `details[].field` is the field NAME, which the contract requires (S-MOCK-51); a key is what the walk forbids. Both transports.
 */
const dataDir = fileURLToPath(new URL('../../mock-server/data', import.meta.url));
const FORBIDDEN_KEYS = ['clave', 'clave_confirmacion', 'clave_hash', 'password', 'tenants'];
const SECRETS = ['secreto1', 'otra-clave', 'distinta-xyz', 'admin123', 'cajero123', 'bloq123', 'web123', 'x'.repeat(21)];
const NEW = { id_trabajador: '001', usuario: 'nuevo', clave: 'secreto1', clave_confirmacion: 'secreto1', habilitado: true, escritorio: true };

/** Every property name and string value of a JSON value. */
function walk(value: unknown, keys: string[] = [], strings: string[] = []): { keys: string[]; strings: string[] } {
  if (typeof value === 'string') strings.push(value);
  else if (Array.isArray(value)) value.forEach((item) => walk(item, keys, strings));
  else if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) { keys.push(key); walk(item, keys, strings); }
  return { keys, strings };
}
function expectClean(label: string, response: unknown): void {
  const { keys, strings } = walk(response);
  expect(keys.filter((key) => FORBIDDEN_KEYS.includes(key)), `${label}: forbidden key`).toEqual([]);
  expect(strings.filter((text) => SECRETS.some((secret) => text.includes(secret))), `${label}: a password value`).toEqual([]);
}

type Call = (method: string, path: string, body?: unknown) => Promise<{ status: number; body: unknown }>;

/** The routes of the contract, in order, each answer checked. */
async function walkRoutes(call: Call): Promise<void> {
  const answers: [string, { status: number; body: unknown }][] = [];
  const run = async (label: string, method: string, path: string, body?: unknown) => answers.push([label, await call(method, path, body)]);
  await run('POST create', 'POST', '/v1/usuarios', NEW);
  await run('GET list', 'GET', '/v1/usuarios');
  await run('GET one', 'GET', '/v1/usuarios/5');
  await run('GET seeded one', 'GET', '/v1/usuarios/1');
  await run('PUT', 'PUT', '/v1/usuarios/5', { clave: 'otra-clave', clave_confirmacion: 'otra-clave' });
  await run('GET lookup', 'GET', '/v1/lookups/usuarios');
  await run('login ok', 'POST', '/auth/login', { usuario: 'nuevo', clave: 'otra-clave' });
  await run('login wrong password', 'POST', '/auth/login', { usuario: 'nuevo', clave: 'secreto1' });
  await run('login disabled', 'POST', '/auth/login', { usuario: 'bloqueado', clave: 'bloq123' });
  await run('422 no clave', 'POST', '/v1/usuarios', { id_trabajador: '001', usuario: 'otro' });
  await run('422 clave too long', 'POST', '/v1/usuarios', { ...NEW, usuario: 'otro', clave: 'x'.repeat(21), clave_confirmacion: 'x'.repeat(21) });
  await run('422 mismatch', 'POST', '/v1/usuarios', { ...NEW, usuario: 'otro', clave_confirmacion: 'distinta-xyz' });
  await run('422 PUT mismatch', 'PUT', '/v1/usuarios/5', { clave: 'otra-clave', clave_confirmacion: 'distinta-xyz' });
  await run('409 duplicate', 'POST', '/v1/usuarios', NEW);
  await run('422 trabajador', 'POST', '/v1/usuarios', { ...NEW, usuario: 'otro', id_trabajador: '999' });
  await run('404', 'GET', '/v1/usuarios/99');
  await run('400 filter', 'GET', '/v1/usuarios?clave=secreto1');
  await run('DELETE', 'DELETE', '/v1/usuarios/5');
  // The walk really exercised both outcomes: the successes carry data, the failures an error body.
  expect(answers.filter(([label]) => label.startsWith('422')).map(([, a]) => a.status)).toEqual([422, 422, 422, 422, 422]);
  expect(answers.find(([label]) => label === 'login ok')?.[1].status).toBe(200);
  for (const [label, answer] of answers) expectClean(label, answer.body);
}

describe('S-MOCK-50 / S-MST-17 / S-AUTH-24 no response ever carries a password', () => {
  const server = useTestServer({ seed: loadSeed(dataDir) });

  it('http mock server: raw bodies of every route, success and failure', async () => {
    await walkRoutes(async (method, path, body) => {
      const answer = await server.call(method, path, { tenant: 'demo', body, headers: { 'X-User-Id': '1', 'X-Empresa-Id': '1' } });
      return { status: answer.status, body: answer.body };
    });
  });

  it('in-browser mock: the same routes through the services, ApiError bodies included', async () => {
    const mock = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '1', empresaId: '1' }), delayMs: 0 });
    const users = mock.catalog('usuarios');
    const asBody = (error: unknown) => {
      const api = error as ApiError;
      return { status: api.status, body: { code: api.code, message: api.message, details: api.details, traceId: api.traceId } };
    };
    await walkRoutes(async (method, path, body) => {
      try {
        const id = /\/v1\/usuarios\/(\d+)/.exec(path)?.[1] ?? '';
        const input = (body ?? {}) as Record<string, unknown>;
        if (path === '/auth/login') return { status: 200, body: await mock.auth.login('demo', input as { usuario: string; clave: string }) };
        if (path.startsWith('/v1/lookups/usuarios')) return { status: 200, body: { items: await mock.lookup.options('usuarios') } };
        if (method === 'POST') return { status: 201, body: await users.create(input) };
        if (method === 'PUT') return { status: 200, body: await users.update(id, input) };
        if (method === 'DELETE') return { status: 204, body: await users.remove(id) };
        if (path.includes('?clave=')) return { status: 400, body: await users.list({ filters: { clave: 'secreto1' } }) };
        return { status: 200, body: id ? await users.get(id) : await users.list({}) };
      } catch (error) {
        return asBody(error);
      }
    });
  });

  it('the walk itself catches a leak: a clave key or a repeated password fails it', () => {
    expect(() => expectClean('x', { items: [{ clave: 'a' }] })).toThrow();
    expect(() => expectClean('x', { message: 'tu clave secreto1 no vale' })).toThrow();
    expect(() => expectClean('x', { details: [{ field: 'clave', message: 'Para agregar un usuario, debes especificar su clave.' }] })).not.toThrow();
  });
});
