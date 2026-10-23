import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { readSeed } from '../core/test-helpers.js';
import { localidades } from '../registry/catalogs/localidades.js';
import { validateRegistry } from '../registry/schema.js';
import { useTestServer } from './test-server.js';

/** W1 responses captured from the hand-written routes BEFORE `app.js` became registry-driven. */
const GOLDEN: Record<string, { status: number; body: string }> = JSON.parse(
  readFileSync(new URL('./golden/w1-routes.json', import.meta.url), 'utf8'),
);
const ERROR_SHAPE = ['code', 'details', 'message', 'traceId'];

const text = (name: string) => ({ name, kind: 'text', label: name, required: true, max: 20 });
const testEntry = (slug: string, over: Record<string, any> = {}) => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'un item', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [text('name')], columns: [{ key: 'name', header: 'Nombre' }], ...over,
});
const registry = validateRegistry([
  localidades,
  // Route slug `lugares` over the W1 storage section `puntosVenta` (R-MOCK-9).
  testEntry('lugares', {
    section: 'puntosVenta',
    idKey: 'id',
    fields: [text('name'), { name: 'id_empresa', kind: 'select', label: 'Empresa', source: { catalog: 'empresas' } }],
  }),
  testEntry('lookup', { scope: 'shared', readOnly: true }),
  testEntry('modal', { modes: ['UPDATE', 'DETAIL'] }),
]);

describe('registry-driven generic routes', () => {
  const api = useTestServer({ seed: readSeed(), registry });

  it('S-MOCK-16 an unknown slug is a 404 with the error shape', async () => {
    for (const method of ['GET', 'POST']) {
      const res = await api.call(method, '/v1/nope', { tenant: 'demo', body: method === 'POST' ? {} : undefined });
      expect(res.status).toBe(404);
      expect(Object.keys(res.body).sort()).toEqual(ERROR_SHAPE);
    }
  });

  it('serves a route slug that differs from its storage section', async () => {
    const created = await api.call('POST', '/v1/lugares', { tenant: 'demo', body: { name: 'NUEVO', id_empresa: '1' } });
    expect(created.status).toBe(201);
    const w1 = await api.call('GET', '/v1/puntos-venta?id_empresa=1', { tenant: 'demo' });
    expect(w1.body.items.map((p: { name: string }) => p.name)).toContain('NUEVO');
  });

  it('S-MOCK-34 GET /v1/empresas stays byte-identical to the W1 golden after writes through the new route', async () => {
    await api.call('POST', '/v1/lugares', { tenant: 'demo', body: { name: 'OTRO', id_empresa: '1' } });
    const res = await api.call('GET', '/v1/empresas', { tenant: 'demo' });
    expect([res.status, JSON.stringify(res.body)]).toEqual([GOLDEN['/v1/empresas'].status, GOLDEN['/v1/empresas'].body]);
  });

  it('R-REG-11 a read-only lookup answers 405 METHOD_NOT_ALLOWED with the error shape', async () => {
    const res = await api.call('POST', '/v1/lookup', { tenant: 'demo', body: { name: 'X' } });
    expect([res.status, res.body.code]).toEqual([405, 'METHOD_NOT_ALLOWED']);
    expect(Object.keys(res.body).sort()).toEqual(ERROR_SHAPE);
    expect((await api.call('GET', '/v1/lookup', { tenant: 'demo' })).status).toBe(200);
  });

  it('R-REG-10 a write outside the entry modes answers 405 MODE_NOT_SUPPORTED', async () => {
    const res = await api.call('POST', '/v1/modal', { tenant: 'demo', body: { name: 'X' } });
    expect([res.status, res.body.code]).toEqual([405, 'MODE_NOT_SUPPORTED']);
  });

  it('answers a field error as 422 over HTTP', async () => {
    const res = await api.call('POST', '/v1/lugares', { tenant: 'demo', body: { name: '' } });
    expect([res.status, res.body.code]).toEqual([422, 'VALIDATION_ERROR']);
  });
});

describe('W1 routes keep their exact responses (S-MOCK-34)', () => {
  const api = useTestServer();

  it.each(Object.keys(GOLDEN))('%s is byte-identical to the W1 golden', async (path) => {
    const res = await api.call('GET', path, { tenant: 'demo' });
    expect([res.status, JSON.stringify(res.body)]).toEqual([GOLDEN[path].status, GOLDEN[path].body]);
  });
});
