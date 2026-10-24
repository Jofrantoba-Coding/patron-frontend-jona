import { describe, expect, it } from 'vitest';
import { CHILD_REGISTRY, CHILD_SEED, parentEntry } from '../core/children.fixture';
import { validateRegistry } from '../registry/schema.js';
import { useTestServer } from './test-server';

const server = useTestServer({ seed: CHILD_SEED, registry: CHILD_REGISTRY });
const call = (method: string, path: string, body?: unknown, tenant = 'a', headers: Record<string, string> = {}) => server.call(method, path, { tenant, body, headers });
const EMPRESA1 = { 'X-Empresa-Id': '1' };

describe('S-MOCK-39 nested list and get (R-MOCK-19)', () => {
  it('lists the deactivated rows, not the logically deleted ones, in the R-MOCK-3 envelope', async () => {
    const res = await call('GET', '/v1/clientes/001/direcciones');
    expect(res.status).toBe(200);
    expect(res.body.items.map((r: any) => [r.id, r.estado])).toEqual([['1', 'A'], ['2', 'D']]);
    expect(res.body.pagination).toEqual({ page: 1, pageSize: 20, total: 2 });
  });

  it('applies the generic filters to child fields and an unknown key is a 400', async () => {
    expect((await call('GET', '/v1/clientes/001/direcciones?direccion=av 2')).body.items.map((r: any) => r.id)).toEqual(['2']);
    expect((await call('GET', '/v1/clientes/001/direcciones?nope=1')).status).toBe(400);
  });

  it('resolves a deactivated row by id and answers 404 for a deleted or foreign one', async () => {
    expect((await call('GET', '/v1/clientes/001/direcciones/2')).body).toMatchObject({ id: '2', estado: 'D' });
    expect((await call('GET', '/v1/clientes/001/direcciones/3')).status).toBe(404);
    expect((await call('GET', '/v1/clientes/002/direcciones/1')).status).toBe(404);
  });
});

describe('S-MOCK-40 nested create and 404', () => {
  it('creates a child (201), links it to the parent and lists it', async () => {
    const res = await call('POST', '/v1/clientes/002/contactos', { nombre: 'ROSA' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: '3', id_clientes: '002', nombre: 'ROSA', estado: 'A' });
    expect((await call('GET', '/v1/clientes/002/contactos')).body.items.map((r: any) => r.nombre)).toEqual(['ROSA']);
  });

  it('validates a child write like a parent write (422 with the field)', async () => {
    const res = await call('POST', '/v1/clientes/002/contactos', { nombre: '' });
    expect([res.status, res.body.code, res.body.details.map((d: any) => d.field)]).toEqual([422, 'VALIDATION_ERROR', ['nombre']]);
  });

  it.each([
    ['unknown parent', '/v1/clientes/999/contactos', 'a'],
    ['unknown child name', '/v1/clientes/001/nada', 'a'],
    ['reserved name actions', '/v1/clientes/001/actions', 'a'],
    ['deleted parent', '/v1/clientes/003/contactos', 'a'],
    ['other-tenant parent', '/v1/clientes/002/contactos', 'b'],
  ])('answers 404 with the error shape: %s', async (_name, path, tenant) => {
    for (const [method, body] of [['GET', undefined], ['POST', { nombre: 'X' }]] as const) {
      const res = await call(method, path, body, tenant);
      expect([res.status, res.body.code]).toEqual([404, 'NOT_FOUND']);
      expect(res.body).toHaveProperty('traceId');
    }
  });

  it('answers 404 for a parent of another empresa and serves the session empresa', async () => {
    expect((await call('GET', '/v1/cuentas/002/contactos', undefined, 'a', EMPRESA1)).status).toBe(404);
    expect((await call('GET', '/v1/cuentas/001/contactos', undefined, 'a', EMPRESA1)).body.items).toHaveLength(1);
    const created = await call('POST', '/v1/cuentas/001/contactos', { nombre: 'DOS' }, 'a', EMPRESA1);
    expect(created.body).toMatchObject({ id_empresa: '1', id_cuentas: '001' });
  });

  it('updates and removes a child through its own route', async () => {
    expect((await call('PUT', '/v1/clientes/001/contactos/1', { nombre: 'ANITA' })).body).toMatchObject({ id: '1', nombre: 'ANITA' });
    expect((await call('DELETE', '/v1/clientes/001/contactos/1')).status).toBe(204);
    expect((await call('GET', '/v1/clientes/001/contactos/1')).status).toBe(404);
    expect((await call('PUT', '/v1/clientes/002/contactos/1', { nombre: 'X' })).status).toBe(404);
  });

  it('does not reach a child through a single-segment route', async () => {
    expect((await call('GET', '/v1/clientes%2Fdirecciones')).status).toBe(404);
  });
});

const STAMPED = validateRegistry([parentEntry('cuentas', { scope: 'empresa', stamp: ['id_usuario', 'id_empresa'] })]);
const stampedServer = useTestServer({ seed: CHILD_SEED, registry: STAMPED });
const asUser = (method: string, path: string, body?: unknown) => stampedServer.call(method, path, { tenant: 'a', body, headers: { 'X-Empresa-Id': '1', 'X-User-Id': '7' } });

describe('R-MD-8 a child row written through a nested write carries the session id_usuario stamp', () => {
  it('stamps the session user on a child created through the nested route and through the composite body', async () => {
    const nested = await asUser('POST', '/v1/cuentas/001/contactos', { nombre: 'ROSA' });
    expect([nested.status, nested.body.id_usuario]).toEqual([201, 7]);
    const composite = await asUser('PUT', '/v1/cuentas/001', { nombre: 'E1', children: { contactos: [{ op: 'I', nombre: 'LUZ' }] } });
    expect(composite.status).toBe(200);
    const rows = (await asUser('GET', '/v1/cuentas/001/contactos')).body.items;
    expect(rows.map((r: any) => [r.nombre, r.id_usuario])).toEqual([['UNO', undefined], ['ROSA', 7], ['LUZ', 7]]);
  });
});
