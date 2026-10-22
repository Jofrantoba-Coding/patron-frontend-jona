import { describe, expect, it } from 'vitest';
import { useTestServer } from './test-server.js';

const NEW_LOCALIDAD = { id_empresa: '1', descripcion: 'LOCAL NUEVO', direccion: 'AV. X 1', id_ubigeo: '150101' };

describe('mock http app: catalog and lookup routes', () => {
  const api = useTestServer();

  it('POST /v1/localidades creates with 201 and the new record is listed', async () => {
    const created = await api.call('POST', '/v1/localidades', { tenant: 'demo', body: NEW_LOCALIDAD });
    expect(created.status).toBe(201);
    expect(created.body.descripcion).toBe('LOCAL NUEVO');
    const fetched = await api.call('GET', `/v1/localidades/${created.body.id_localidad}`, { tenant: 'demo' });
    expect(fetched.status).toBe(200);
  });

  it('S-MOCK-12 POST without descripcion gives 422 with details naming the field', async () => {
    const { descripcion: _omit, ...body } = NEW_LOCALIDAD;
    const res = await api.call('POST', '/v1/localidades', { tenant: 'demo', body });
    expect(res.status).toBe(422);
    expect(res.body.details.map((d: { field: string }) => d.field)).toContain('descripcion');
  });

  it('PUT updates with 200', async () => {
    const res = await api.call('PUT', '/v1/localidades/1', { tenant: 'demo', body: { direccion: 'NUEVA DIR' } });
    expect(res.status).toBe(200);
    expect(res.body.direccion).toBe('NUEVA DIR');
  });

  it('S-MOCK-10 DELETE is logical: 204, excluded from lists, still resolvable as inactive', async () => {
    const del = await api.call('DELETE', '/v1/localidades/1', { tenant: 'demo' });
    expect(del.status).toBe(204);
    const list = await api.call('GET', '/v1/localidades?pageSize=1000', { tenant: 'demo' });
    expect(list.body.items.some((r: { id_localidad: string }) => r.id_localidad === '1')).toBe(false);
    const one = await api.call('GET', '/v1/localidades/1', { tenant: 'demo' });
    expect(one.body.activo).toBe(false);
  });

  it('S-MOCK-11 physical delete is rejected with the error shape', async () => {
    const query = await api.call('DELETE', '/v1/localidades/1?physical=true', { tenant: 'demo' });
    expect(query.status).toBe(405);
    expect(Object.keys(query.body).sort()).toEqual(['code', 'details', 'message', 'traceId']);
    const path = await api.call('DELETE', '/v1/localidades/1/fisico', { tenant: 'demo' });
    expect([404, 405]).toContain(path.status);
    expect(path.body.code).toBeTruthy();
    const still = await api.call('GET', '/v1/localidades/1', { tenant: 'demo' });
    expect(still.body.activo).toBe(true);
  });

  it('GET /v1/ubigeo returns children by parent level (S-MOCK-8, S-MOCK-9)', async () => {
    const deps = await api.call('GET', '/v1/ubigeo?parent=', { tenant: 'demo' });
    expect(deps.body.items.every((u: { id: string }) => u.id.length === 2)).toBe(true);
    const provs = await api.call('GET', '/v1/ubigeo?parent=15', { tenant: 'demo' });
    expect(provs.body.items.every((u: { id: string }) => u.id.length === 4 && u.id.startsWith('15'))).toBe(true);
    const none = await api.call('GET', '/v1/ubigeo?parent=99', { tenant: 'demo' });
    expect(none.body).toEqual({ items: [] });
  });

  it('GET /v1/empresas and /v1/puntos-venta?id_empresa= are tenant-scoped lookups', async () => {
    const empresas = await api.call('GET', '/v1/empresas', { tenant: 'demo' });
    expect(empresas.body.items.length).toBeGreaterThan(0);
    expect(empresas.body.pagination).toBeUndefined();
    const all = await api.call('GET', '/v1/puntos-venta', { tenant: 'demo' });
    const filtered = await api.call('GET', '/v1/puntos-venta?id_empresa=1', { tenant: 'demo' });
    expect(filtered.body.items.length).toBeLessThan(all.body.items.length);
    expect(filtered.body.items.every((p: { id_empresa: string }) => p.id_empresa === '1')).toBe(true);
  });

  it('GET /v1/params returns the seeded flags', async () => {
    const res = await api.call('GET', '/v1/params', { tenant: 'demo' });
    expect(res.status).toBe(200);
    expect(res.body.INICIO_ACTIVIDADES).toBeTruthy();
  });

  it('S-MOCK-14 POST /__mock/reset restores the seed over HTTP', async () => {
    await api.call('POST', '/v1/localidades', { tenant: 'demo', body: NEW_LOCALIDAD });
    const before = await api.call('GET', '/v1/localidades', { tenant: 'demo' });
    const reset = await api.call('POST', '/__mock/reset');
    expect(reset.status).toBe(204);
    const after = await api.call('GET', '/v1/localidades', { tenant: 'demo' });
    expect(after.body.pagination.total).toBe(before.body.pagination.total - 1);
  });
});
