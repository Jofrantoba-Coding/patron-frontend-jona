import { describe, expect, it } from 'vitest';
import { readSeed } from '../core/test-helpers.js';
import { validateRegistry } from '../registry/schema.js';
import { useTestServer } from './test-server.js';

/** Test-only entries for the options endpoint (R-MOCK-16); no real W2 catalog exists in this slice. */
const text = (name: string) => ({ name, kind: 'text', label: name, required: true, max: 20 });
const entry = (slug: string, over: Record<string, any> = {}): Record<string, any> => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'un item', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [text('descripcion')], columns: [{ key: 'descripcion', header: 'D' }], ...over,
});
const registry = validateRegistry([
  // The empresa-scope localidades hold the `$session.empresa` where of almacenes.
  entry('locs'),
  entry('punto-venta', { fields: [text('descripcion'), { name: 'id_localidad', kind: 'select', label: 'Localidad', required: true, source: { catalog: 'locs' } }] }),
  entry('almacenes', {
    fields: [
      text('descripcion'),
      { name: 'id_localidad', kind: 'select', label: 'Localidad', source: { catalog: 'locs', where: { id_empresa: '$session.empresa' } } },
      { name: 'id_pv', kind: 'select', label: 'Punto de venta', source: { catalog: 'punto-venta' }, dependsOn: [{ field: 'id_localidad', filterKey: 'id_localidad' }] },
    ],
  }),
  entry('etiquetas', { optionLabel: 'nombre', fields: [text('nombre')] }),
  entry('notas', { scope: 'empresa', stamp: ['id_empresa'] }),
  entry('monedas', { scope: 'shared', readOnly: true }),
]);

const row = (slug: string, id: string, extra: Record<string, any> = {}) => ({ [`id_${slug}`]: id, descripcion: `R${id}`, activo: true, ...extra });
const seed = {
  ...readSeed(),
  locs: { demo: [row('locs', '1', { id_empresa: '1' }), row('locs', '10', { id_empresa: '1' }), row('locs', '2', { id_empresa: '2' })] },
  'punto-venta': {
    demo: [
      row('punto-venta', '1', { id_localidad: '1', descripcion: 'PV UNO' }),
      row('punto-venta', '2', { id_localidad: '10', descripcion: 'PV DIEZ' }),
      row('punto-venta', '3', { id_localidad: '1', descripcion: 'PV BAJA', activo: false }),
      row('punto-venta', '4', { id_localidad: '2', descripcion: 'PV DOS' }),
    ],
  },
  etiquetas: { demo: [{ id_etiquetas: '1', nombre: 'ROJO', activo: true }] },
  notas: { demo: [row('notas', '1', { id_empresa: '1' }), row('notas', '2', { id_empresa: '2' })] },
  monedas: [row('monedas', '1')],
};

describe('GET /v1/lookups/{slug} (S-MOCK-30 core)', () => {
  const api = useTestServer({ seed, registry });
  const options = async (path: string, headers: Record<string, string> = {}) => api.call('GET', `/v1/lookups/${path}`, { tenant: 'demo', headers });
  const ids = (res: { body: any }) => res.body.items.map((i: { id: string }) => i.id);

  it('matches the filter exactly: ?id_localidad=1 never returns localidad 10, inactive rows are left out', async () => {
    const res = await options('punto-venta?id_localidad=1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ items: [{ id: '1', name: 'PV UNO' }] });
    expect(ids(await options('punto-venta?id_localidad=10'))).toEqual(['2']);
  });

  it('answers 200 with no items for an unknown value, and every active row without a filter', async () => {
    expect(await options('punto-venta?id_localidad=zzz')).toMatchObject({ status: 200, body: { items: [] } });
    expect(ids(await options('punto-venta'))).toEqual(['1', '2', '4']);
  });

  it('names options with optionLabel', async () => {
    expect((await options('etiquetas')).body).toEqual({ items: [{ id: '1', name: 'ROJO' }] });
  });

  it('keeps the generic list on substring matching', async () => {
    const res = await api.call('GET', '/v1/punto-venta?id_localidad=1', { tenant: 'demo' });
    expect(res.body.items.map((r: any) => r['id_punto-venta'])).toEqual(['1', '2']);
  });

  it('accepts the static where of a field and resolves $session.empresa from the header', async () => {
    const own = await options('locs?id_empresa=%24session.empresa', { 'X-Empresa-Id': '1' });
    expect(ids(own)).toEqual(['1', '10']);
    expect(ids(await options('locs?id_empresa=2'))).toEqual(['2']);
    const missing = await options('locs?id_empresa=%24session.empresa');
    expect([missing.status, missing.body.code]).toEqual([400, 'MISSING_SESSION_CONTEXT']);
  });

  it('limits an empresa-scope target to the session empresa and serves shared lookups', async () => {
    expect(ids(await options('notas', { 'X-Empresa-Id': '2' }))).toEqual(['2']);
    expect(ids(await options('monedas'))).toEqual(['1']);
  });

  it('refuses a key that is neither a ref field nor a dependsOn filterKey, and an unknown slug', async () => {
    const bad = await options('punto-venta?descripcion=PV');
    expect([bad.status, bad.body.code]).toEqual([400, 'INVALID_FILTER']);
    expect((await options('nope')).status).toBe(404);
  });
});
