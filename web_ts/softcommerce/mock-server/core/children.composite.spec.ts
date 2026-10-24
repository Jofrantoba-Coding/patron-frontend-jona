import { afterEach, describe, expect, it } from 'vitest';
import { createRecord, getRecord, listCatalog, updateRecord } from './catalog.js';
import { CHILD_RULE_HOOKS } from './children.js';
import { CHILD_REGISTRY, CHILD_SEED } from './children.fixture';
import { listChild } from './nested.js';
import { createStore } from './store.js';
import { validationError } from './errors.js';

const store = createStore(CHILD_SEED, CHILD_REGISTRY);
afterEach(() => { store.reset(); for (const key of Object.keys(CHILD_RULE_HOOKS)) delete CHILD_RULE_HOOKS[key]; });

const create = (body: Record<string, unknown>) => createRecord(store, 'a', 'clientes', body, {});
const update = (id: string, body: Record<string, unknown>) => updateRecord(store, 'a', 'clientes', id, body, {});
const rows = (id: string, child: string) => listChild(store, 'a', 'clientes', id, child, {}, {}).items;
const parents = () => listCatalog(store, 'a', 'clientes', {}, {}).items.map((r: any) => r.nombre);
const fails = (run: () => unknown) => { try { run(); } catch (e: any) { return { status: e.status, code: e.code, fields: e.details.map((d: any) => d.field) }; } throw new Error('expected a failure'); };

describe('S-MOCK-42 composite atomic write (R-MOCK-19)', () => {
  it('a valid parent with a second invalid child: 422 on direcciones[1].direccion, no parent and no child persisted', () => {
    const before = JSON.stringify(store.data('a'));
    const result = fails(() => create({ nombre: 'NUEVO', children: { direcciones: [{ op: 'I', direccion: 'AV OK' }, { op: 'I', direccion: '' }], contactos: [{ op: 'I', nombre: 'X' }] } }));
    expect(result).toEqual({ status: 422, code: 'VALIDATION_ERROR', fields: ['direcciones[1].direccion'] });
    expect(JSON.stringify(store.data('a'))).toBe(before);
    expect(parents()).not.toContain('NUEVO');
  });

  it('all valid: the parent and every child persist, linked to the new parent', () => {
    const parent = create({ nombre: 'NUEVO', children: { direcciones: [{ op: 'I', direccion: 'AV 9' }, { op: 'I', direccion: 'AV 10', distrito: 'LIMA' }], contactos: [{ op: 'I', nombre: 'ROSA' }] } });
    expect(parent.id_clientes).toBe('004');
    expect(rows('004', 'direcciones').map((r: any) => [r.id, r.direccion, r.estado, r.id_clientes])).toEqual([['4', 'AV 9', 'A', '004'], ['5', 'AV 10', 'A', '004']]);
    expect(rows('004', 'contactos').map((r: any) => r.nombre)).toEqual(['ROSA']);
  });

  it('CLONE sends no child ops: the new record has no children (R-MD-9)', () => {
    create({ nombre: 'COPIA DE ACME' });
    expect(rows('004', 'direcciones')).toEqual([]);
  });

  it('a body without children, or with an empty list, leaves the children alone', () => {
    update('001', { nombre: 'ACME 2' });
    update('001', { nombre: 'ACME 3', children: { direcciones: [] } });
    expect(rows('001', 'direcciones')).toHaveLength(2);
  });
});

describe('S-MOCK-57 index in the sent array', () => {
  it('with one stored row and two sent ops, the failing second sent op is [1]', () => {
    // 001 holds two stored direcciones; the sent array has two ops, the second invalid: the index is 1, not 2.
    const result = fails(() => update('001', { children: { direcciones: [{ op: 'A', id: '1', direccion: 'AV 1 NUEVA' }, { op: 'I', direccion: '' }] } }));
    expect(result.fields).toEqual(['direcciones[1].direccion']);
    expect(rows('001', 'direcciones').map((r: any) => r.direccion)).toEqual(['AV 1', 'AV 2']);
  });
});

describe('ops I, A and E on changed rows only', () => {
  it('inserts, updates and deletes in one call and leaves the unsent rows untouched', () => {
    update('001', { nombre: 'ACME', children: { direcciones: [{ op: 'A', id: '1', direccion: 'AV 1 B' }, { op: 'I', direccion: 'AV 4' }], contactos: [{ op: 'E', id: '1' }] } });
    expect(rows('001', 'direcciones').map((r: any) => [r.id, r.direccion, r.estado])).toEqual([['1', 'AV 1 B', 'A'], ['2', 'AV 2', 'D'], ['4', 'AV 4', 'A']]);
    expect(rows('001', 'contactos')).toEqual([]);
  });

  it('A deactivates a child whose removal is deactivate, never reactivates, and ignores estado elsewhere', () => {
    update('001', { children: { direcciones: [{ op: 'A', id: '1', direccion: 'AV 1', estado: 'D' }, { op: 'A', id: '2', direccion: 'AV 2', estado: 'A' }], contactos: [{ op: 'A', id: '1', nombre: 'ANA', estado: 'D' }] } });
    expect(rows('001', 'direcciones').map((r: any) => r.estado)).toEqual(['D', 'D']);
    expect(rows('001', 'contactos')[0].estado).toBe('A');
  });

  it('rejects an unknown op, an unknown row and another parent\'s row, naming the sent index', () => {
    expect(fails(() => update('001', { children: { direcciones: [{ op: 'X' }] } })).fields).toEqual(['direcciones[0].op']);
    expect(fails(() => update('001', { children: { contactos: [{ op: 'I', nombre: 'OK' }, { op: 'E', id: '99' }] } })).fields).toEqual(['contactos[1].id']);
    expect(fails(() => update('002', { children: { contactos: [{ op: 'E', id: '1' }] } })).fields).toEqual(['contactos[0].id']);
    expect(rows('001', 'contactos')).toHaveLength(1);
  });

  it('rejects an unknown child name and a malformed list', () => {
    expect(fails(() => update('001', { children: { nada: [] } })).fields).toEqual(['children.nada']);
    expect(fails(() => update('001', { children: { contactos: {} } })).fields).toEqual(['contactos']);
  });
});

describe('fail-first order (D6)', () => {
  it('the parent fails before any child, children in declared order, ops in list order', () => {
    const body = { nombre: '', children: { contactos: [{ op: 'I', nombre: '' }], direcciones: [{ op: 'I', direccion: '' }] } };
    expect(fails(() => create(body)).fields).toEqual(['nombre']);
    // contactos is sent first but direcciones is declared first
    expect(fails(() => create({ ...body, nombre: 'OK' })).fields).toEqual(['direcciones[0].direccion']);
    expect(fails(() => create({ nombre: 'OK', children: { direcciones: [{ op: 'I', direccion: 'A' }, { op: 'I', direccion: '' }, { op: 'X' }] } })).fields).toEqual(['direcciones[1].direccion']);
  });

  it('runs the named rules after every op validated and before the write; a rule failure persists nothing', () => {
    const seen: string[] = [];
    CHILD_RULE_HOOKS.spy = (_s, _t, _e, ops) => { seen.push(JSON.stringify(Object.keys(ops)), String(parents().length)); throw validationError([{ field: 'direcciones[0].direccion', code: 'RULE', message: 'rule' }]); };
    expect(fails(() => create({ nombre: 'RULED', children: { direcciones: [{ op: 'I', direccion: 'A' }] } })).code).toBe('VALIDATION_ERROR');
    expect(seen).toEqual(['["direcciones"]', '2']);
    expect(parents()).toEqual(['ACME', 'BETA', 'GONE'].filter((n) => n !== 'GONE'));
  });

  it('is atomic on update: a child failure leaves the parent unchanged', () => {
    fails(() => update('001', { nombre: 'CAMBIADO', children: { contactos: [{ op: 'I', nombre: '' }] } }));
    expect(getRecord(store, 'a', 'clientes', '001', {}).nombre).toBe('ACME');
  });
});
