import { describe, expect, it } from 'vitest';
import { useTestServer } from '../http/test-server.js';
import { validateRegistry } from '../registry/schema.js';
import { createRecord, deleteRecord, getRecord, listCatalog, updateRecord } from './catalog.js';
import type { MockError } from './errors.js';
import { createStore } from './store.js';
import { readSeed, tinySeed } from './test-helpers.js';

/** Test-only entries: no real empresa-scope catalog exists in this slice. */
const text = (name: string) => ({ name, kind: 'text', label: name, required: true, max: 10 });
const entry = (slug: string, over: Record<string, any> = {}): Record<string, any> => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'un item', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [text('descripcion')], columns: [{ key: 'descripcion', header: 'D' }], ...over,
});
const ENTRIES = [
  entry('notas', { scope: 'empresa', stamp: ['id_usuario', 'id_empresa'] }),
  entry('padres'),
  entry('locs'),
  entry('depositos', {
    fields: [text('descripcion'), { name: 'id_loc', kind: 'select', label: 'Loc', source: { catalog: 'locs', where: { id_empresa: '$session.empresa' } } }],
  }),
];

const row = (slug: string, id: string, extra: Record<string, any> = {}) => ({ [`id_${slug}`]: id, descripcion: `R${id}`, activo: true, ...extra });
const SEED = {
  notas: { a: [row('notas', '1', { id_empresa: '1' }), row('notas', '2', { id_empresa: '2' })] },
  padres: { a: [row('padres', '1')] },
  locs: { a: [row('locs', '1', { id_empresa: '1' }), row('locs', '2', { id_empresa: '2' })] },
};
const seed = () => ({ ...tinySeed(), empresas: { a: [{ id: '1', name: 'E1' }, { id: '2', name: 'E2' }], b: [] }, ...structuredClone(SEED) });
const registry = validateRegistry(ENTRIES);
const store = () => createStore(seed(), registry);
const caught = (fn: () => unknown): MockError => {
  try { fn(); } catch (e) { return e as MockError; }
  throw new Error('expected function to throw');
};
const ctx1 = { userId: '5', empresaId: '1' };

describe('S-MOCK-27 empresa scope (core)', () => {
  it('limits list, get, update and delete to the session empresa', () => {
    const s = store();
    expect(listCatalog(s, 'a', 'notas', {}, ctx1).items.map((r: any) => r.id_notas)).toEqual(['1']);
    expect(caught(() => getRecord(s, 'a', 'notas', '2', ctx1)).status).toBe(404);
    expect(caught(() => updateRecord(s, 'a', 'notas', '2', { descripcion: 'X' }, ctx1)).status).toBe(404);
    expect(caught(() => deleteRecord(s, 'a', 'notas', '2', ctx1)).status).toBe(404);
    expect(listCatalog(s, 'a', 'notas', {}, { empresaId: '2' }).items.map((r: any) => r.id_notas)).toEqual(['2']);
  });
});

describe('S-MOCK-26 session values (core)', () => {
  it('stamps empresa and user from the context even when the body says otherwise', () => {
    const created = createRecord(store(), 'a', 'notas', { descripcion: 'X', id_usuario: '9', id_empresa: '9' }, ctx1);
    expect(created).toMatchObject({ id_empresa: '1', id_usuario: 5, activo: true });
  });

  it('stamps the user again on update and keeps the empresa', () => {
    const updated = updateRecord(store(), 'a', 'notas', '1', { descripcion: 'Y', id_usuario: '9' }, { userId: '7', empresaId: '1' });
    expect(updated).toMatchObject({ descripcion: 'Y', id_empresa: '1', id_usuario: 7 });
  });

  it('a static where can reference $session.empresa for refs', () => {
    const s = store();
    expect(createRecord(s, 'a', 'depositos', { descripcion: 'X', id_loc: '1' }, ctx1)).toMatchObject({ id_loc: '1' });
    const err = caught(() => createRecord(s, 'a', 'depositos', { descripcion: 'X', id_loc: '2' }, ctx1));
    expect(err.details.map((d) => d.field)).toEqual(['id_loc']);
  });
});

describe('S-MOCK-36 session context errors (core)', () => {
  it('a missing header is 400 MISSING_SESSION_CONTEXT', () => {
    const s = store();
    for (const run of [
      () => listCatalog(s, 'a', 'notas'),
      () => createRecord(s, 'a', 'notas', { descripcion: 'X' }),
      () => createRecord(s, 'a', 'notas', { descripcion: 'X' }, { empresaId: '1' }),
      () => createRecord(s, 'a', 'depositos', { descripcion: 'X', id_loc: '1' }),
    ]) {
      const err = caught(run);
      expect([err.status, err.code]).toEqual([400, 'MISSING_SESSION_CONTEXT']);
    }
  });

  it('an empresa outside the tenant is 400 INVALID_SESSION_CONTEXT', () => {
    const err = caught(() => listCatalog(store(), 'a', 'notas', {}, { empresaId: '999' }));
    expect([err.status, err.code]).toEqual([400, 'INVALID_SESSION_CONTEXT']);
  });

  it('entries without session scope never need the context', () => {
    const s = store();
    expect(listCatalog(s, 'a', 'padres').items).toHaveLength(1);
    expect(createRecord(s, 'a', 'padres', { descripcion: 'X' })).toMatchObject({ activo: true });
    expect(listCatalog(s, 'a', 'padres', {}, { empresaId: '999' }).items).toHaveLength(2);
  });
});

describe('S-MOCK-26/27/36 over HTTP', () => {
  const api = useTestServer({ seed: { ...readSeed(), notas: { demo: SEED.notas.a } }, registry: validateRegistry([ENTRIES[0]]) });
  const headers = { 'X-Empresa-Id': '1', 'X-User-Id': '5' };

  it('reads X-User-Id and X-Empresa-Id', async () => {
    const created = await api.call('POST', '/v1/notas', { tenant: 'demo', headers, body: { descripcion: 'X', id_usuario: '9', id_empresa: '9' } });
    expect([created.status, created.body.id_empresa, created.body.id_usuario]).toEqual([201, '1', 5]);
    const list = await api.call('GET', '/v1/notas', { tenant: 'demo', headers });
    expect(list.body.items.every((r: any) => r.id_empresa === '1')).toBe(true);
  });

  it('answers 400 for a missing or unknown empresa, and W1 routes need no headers', async () => {
    const missing = await api.call('GET', '/v1/notas', { tenant: 'demo' });
    expect([missing.status, missing.body.code]).toEqual([400, 'MISSING_SESSION_CONTEXT']);
    const unknown = await api.call('GET', '/v1/notas', { tenant: 'demo', headers: { 'X-Empresa-Id': '999' } });
    expect([unknown.status, unknown.body.code]).toEqual([400, 'INVALID_SESSION_CONTEXT']);
    expect((await api.call('GET', '/v1/empresas', { tenant: 'demo' })).status).toBe(200);
  });

  it('allows the session headers in CORS preflight', async () => {
    const res = await fetch(`${api.url()}/v1/notas`, { method: 'OPTIONS' });
    expect(res.headers.get('Access-Control-Allow-Headers')).toMatch(/X-User-Id.*X-Empresa-Id|X-Empresa-Id.*X-User-Id/);
  });
});
