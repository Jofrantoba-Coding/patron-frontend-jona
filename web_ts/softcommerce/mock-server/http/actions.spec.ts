import { describe, expect, it } from 'vitest';
import { ACTION_REGISTRY, ACTION_SEED } from '../core/actions.fixture';
import { useTestServer } from './test-server';

const server = useTestServer({ seed: ACTION_SEED, registry: ACTION_REGISTRY });
const post = (path: string, body?: unknown, tenant = 'a') => server.call('POST', path, { tenant, body });

describe('R-MOCK-22 the action routes over HTTP', () => {
  it('POST /v1/{c}/{id}/actions/{a} runs an entry action and answers 200 with the row and the message', async () => {
    const res = await post('/v1/clientes/001/actions/cerrar');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ row: { id_clientes: '001', cerrado: 'S' }, message: 'Cliente Cerrado' });
  });

  it('POST /v1/{c}/{id}/{child}/{cid}/actions/{a} runs on the child row and answers it with the parent', async () => {
    const res = await post('/v1/clientes/001/activaciones/1/actions/desactivar', { fecha_fin: '2026-04-01' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ row: { id: '1', estado: 'D' }, parent: { id_clientes: '001' }, message: 'Cliente Desactivado' });
  });

  it('POST /v1/{c}/{id}/{child}/actions/{a} (the collection form) creates the row', async () => {
    const res = await post('/v1/clientes/002/activaciones/actions/activar', { fecha_inicio: '2026-05-01' });
    expect(res.status).toBe(200);
    expect(res.body.row).toMatchObject({ id: '2', estado: 'A' });
    expect((await server.call('GET', '/v1/clientes/002/activaciones', { tenant: 'a' })).body.items).toHaveLength(2);
  });

  it('answers 409 ACTION_NOT_ALLOWED with the rule message, 422 with the detail and 404 for what is not there', async () => {
    expect((await post('/v1/clientes/001/activaciones/actions/activar', { fecha_inicio: '2026-05-01' })).body).toMatchObject({ code: 'ACTION_NOT_ALLOWED', message: 'Cliente ya Esta Activado' });
    const bad = await post('/v1/clientes/001/activaciones/1/actions/desactivar', { fecha_fin: '2026-03-09' });
    expect([bad.status, bad.body.code, bad.body.details.map((d: any) => d.field)]).toEqual([422, 'VALIDATION_ERROR', ['fecha_fin']]);
    for (const path of ['/v1/clientes/001/actions/nada', '/v1/clientes/999/actions/cerrar', '/v1/clientes/001/activaciones/9/actions/desactivar', '/v1/clientes/001/nada/actions/activar']) {
      expect([path, (await post(path)).status]).toEqual([path, 404]);
    }
    expect((await post('/v1/clientes/001/activaciones/actions/avisar')).status).toBe(501);
    expect((await server.call('POST', '/v1/clientes/001/actions/cerrar')).status).toBe(400);
  });

  it('the other verbs on an action path are not routes', async () => {
    expect((await server.call('GET', '/v1/clientes/001/actions/cerrar', { tenant: 'a' })).status).toBe(404);
  });
});
