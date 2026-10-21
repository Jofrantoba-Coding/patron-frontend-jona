import { describe, expect, it } from 'vitest';
import { useTestServer } from './test-server.js';

describe('mock http app: correlation, tenant gate and error shape', () => {
  const api = useTestServer();

  it('S-MOCK-1 echoes X-Correlation-Id', async () => {
    const res = await api.call('GET', '/menu', { tenant: 'demo', headers: { 'X-Correlation-Id': 'abc' } });
    expect(res.status).toBe(200);
    expect(res.headers.get('x-correlation-id')).toBe('abc');
  });

  it('S-MOCK-2 generates X-Correlation-Id when absent (also on public routes)', async () => {
    const a = await api.call('GET', '/auth/session-options');
    const b = await api.call('GET', '/auth/session-options');
    expect(a.headers.get('x-correlation-id')).toBeTruthy();
    expect(a.headers.get('x-correlation-id')).not.toBe(b.headers.get('x-correlation-id'));
  });

  it('S-MOCK-3 unknown record gives 404 with the error shape and traceId = correlation id', async () => {
    const res = await api.call('GET', '/v1/localidades/does-not-exist', { tenant: 'demo' });
    expect(res.status).toBe(404);
    expect(Object.keys(res.body).sort()).toEqual(['code', 'details', 'message', 'traceId']);
    expect(res.body.traceId).toBe(res.headers.get('x-correlation-id'));
  });

  it('S-MOCK-3 traceId follows an echoed correlation id', async () => {
    const res = await api.call('GET', '/v1/localidades/nope', { tenant: 'demo', headers: { 'X-Correlation-Id': 'trace-9' } });
    expect(res.body.traceId).toBe('trace-9');
  });

  it('S-MOCK-4 missing tenant gives 400 TENANT_REQUIRED', async () => {
    const res = await api.call('GET', '/menu');
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('TENANT_REQUIRED');
    expect(res.body.traceId).toBe(res.headers.get('x-correlation-id'));
  });

  it('S-MOCK-5 unknown tenant gives 404 TENANT_NOT_FOUND and leaks no data', async () => {
    const res = await api.call('GET', '/v1/localidades', { tenant: 'nope' });
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('TENANT_NOT_FOUND');
    expect(res.body.items).toBeUndefined();
  });

  it('S-MOCK-6 session-options is public and lists tenants', async () => {
    const res = await api.call('GET', '/auth/session-options');
    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([
      { id: 'demo', name: 'Comercial Demo SAC' },
      { id: 'botica', name: 'Botica Salud EIRL' },
    ]);
  });

  it('routes login, menu, permissions and list through the core', async () => {
    const login = await api.call('POST', '/auth/login', { tenant: 'demo', body: { usuario: 'admin', clave: 'admin123' } });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeTruthy();

    const menu = await api.call('GET', '/menu', { tenant: 'demo' });
    expect(Array.isArray(menu.body.items)).toBe(true);

    const perms = await api.call('GET', '/forms/unknown/permissions', { tenant: 'demo' });
    expect(Object.values(perms.body).every((v) => v === false)).toBe(true);

    const list = await api.call('GET', '/v1/localidades?page=1&pageSize=2', { tenant: 'demo' });
    expect(list.body.items).toHaveLength(2);
    expect(list.body.pagination).toMatchObject({ page: 1, pageSize: 2 });
  });

  it('maps core errors on login (401, 403) to the error shape', async () => {
    const bad = await api.call('POST', '/auth/login', { tenant: 'demo', body: { usuario: 'admin', clave: 'x' } });
    expect(bad.status).toBe(401);
    expect(bad.body.code).toBe('INVALID_CREDENTIALS');
    const off = await api.call('POST', '/auth/login', { tenant: 'demo', body: { usuario: 'bloqueado', clave: 'bloq123' } });
    expect(off.status).toBe(403);
    expect(off.body.code).toBe('USER_DISABLED');
  });

  it('returns the error shape for unknown routes and malformed JSON', async () => {
    const unknown = await api.call('GET', '/nowhere', { tenant: 'demo' });
    expect(unknown.status).toBe(404);
    expect(unknown.body.code).toBe('NOT_FOUND');
    const res = await fetch(`${api.url()}/auth/login`, {
      method: 'POST',
      headers: { 'X-Tenant-Id': 'demo', 'Content-Type': 'application/json' },
      body: '{bad',
    });
    expect(res.status).toBe(400);
    expect(((await res.json()) as { code: string }).code).toBe('INVALID_JSON');
  });

  it('answers CORS preflight so the browser app can call it', async () => {
    const res = await fetch(`${api.url()}/menu`, { method: 'OPTIONS' });
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    expect(res.headers.get('access-control-allow-headers')?.toLowerCase()).toContain('x-tenant-id');
    expect(res.headers.get('access-control-expose-headers')?.toLowerCase()).toContain('x-correlation-id');
  });
});
