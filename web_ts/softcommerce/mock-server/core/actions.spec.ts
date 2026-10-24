import { afterEach, describe, expect, it } from 'vitest';
import { ACTION_HOOKS, runChildAction, runEntryAction } from './actions.js';
import { ACTION_REGISTRY, ACTION_SEED, installActionHooks } from './actions.fixture';
import { createStore } from './store.js';
import { rowsOf } from './validators.js';

const store = createStore(ACTION_SEED, ACTION_REGISTRY);
afterEach(() => {
  store.reset();
  installActionHooks();
});

const entryAction = (id: string, action: string, body: unknown = {}, tenant = 'a') => runEntryAction(store, tenant, 'clientes', id, action, body, {});
const childAction = (id: string, child: string, childId: string | undefined, action: string, body: unknown = {}, tenant = 'a') =>
  runChildAction(store, tenant, 'clientes', id, child, childId, action, body, {});
const fails = (run: () => unknown) => {
  try { run(); } catch (e: any) { return [e.status, e.code, e.message, e.details.map((d: any) => d.field)]; }
  throw new Error('expected a failure');
};
const activaciones = (id: string) => rowsOf(store, 'a', ACTION_REGISTRY.bySlug.get('clientes/activaciones')).filter((r: any) => r.id_clientes === id);

describe('R-MOCK-22 the three route forms (S-MOCK-47)', () => {
  it('entry form: runs the server action on the row and answers the updated row and the message', () => {
    expect(entryAction('001', 'cerrar')).toMatchObject({ row: { id_clientes: '001', cerrado: 'S' }, message: 'Cliente Cerrado' });
  });

  it('child row form: runs on the child row and answers it with the parent state', () => {
    const out = childAction('001', 'activaciones', '1', 'desactivar', { fecha_fin: '2026-04-01' });
    expect(out).toMatchObject({ row: { id: '1', estado: 'D', fecha_fin: '2026-04-01' }, parent: { id_clientes: '001' }, message: 'Cliente Desactivado' });
  });

  it('collection form: an action that targets no row creates one and answers it', () => {
    const out = childAction('002', 'activaciones', undefined, 'activar', { fecha_inicio: '2026-05-01', motivo: 'VUELVE' });
    expect(out).toMatchObject({ row: { id: '2', estado: 'A', motivo: 'VUELVE' }, parent: { id_clientes: '002' }, message: 'Cliente Activado' });
    expect(activaciones('002').map((r: any) => [r.id, r.estado])).toEqual([['1', 'D'], ['2', 'A']]);
  });

  it('hands the hook the store, entry, row and the input of the body', () => {
    let seen: any;
    ACTION_HOOKS.demoCerrar = (call: any) => { seen = call; return {}; };
    entryAction('001', 'cerrar', { a: 1 });
    expect(seen).toMatchObject({ tenantId: 'a', entry: { slug: 'clientes' }, row: { id_clientes: '001' }, input: { a: 1 } });
  });
});

describe('R-MOCK-22 404 for what does not exist', () => {
  it.each([
    ['an unknown entry action', () => entryAction('001', 'nada')],
    ['an unknown child action', () => childAction('001', 'activaciones', '1', 'nada')],
    ['a deferred action, which has no endpoint', () => childAction('001', 'activaciones', '1', 'diferir')],
    ['an entry deferred action', () => entryAction('001', 'rotar')],
    ['an unknown parent', () => entryAction('999', 'cerrar')],
    ['a logically deleted parent', () => entryAction('003', 'cerrar')],
    ['a parent of another tenant', () => entryAction('002', 'cerrar', {}, 'b')],
    ['an unknown child', () => childAction('001', 'nada', '1', 'desactivar')],
    ['the reserved child actions', () => childAction('001', 'actions', '1', 'desactivar')],
    ['an unknown child row', () => childAction('001', 'activaciones', '9', 'desactivar')],
    ['a child row of another parent', () => childAction('002', 'activaciones', '7', 'desactivar')],
  ])('%s', (_name, run) => {
    expect(fails(run).slice(0, 2)).toEqual([404, 'NOT_FOUND']);
  });
});

describe('S-MOCK-48 action not allowed', () => {
  it('answers 409 ACTION_NOT_ALLOWED with the message of the rule and leaves the data unchanged', () => {
    expect(fails(() => childAction('001', 'activaciones', undefined, 'activar', { fecha_inicio: '2026-05-01' }))).toEqual([409, 'ACTION_NOT_ALLOWED', 'Cliente ya Esta Activado', []]);
    expect(activaciones('001')).toHaveLength(1);
    entryAction('001', 'cerrar');
    expect(fails(() => entryAction('001', 'cerrar'))).toEqual([409, 'ACTION_NOT_ALLOWED', 'Cliente ya Esta Cerrado', []]);
  });
});

describe('S-MOCK-49 action validation', () => {
  it('answers 422 with a detail on the field and leaves the data unchanged', () => {
    const [status, code, , fields] = fails(() => childAction('001', 'activaciones', '1', 'desactivar', { fecha_fin: '2026-03-09' }));
    expect([status, code, fields]).toEqual([422, 'VALIDATION_ERROR', ['fecha_fin']]);
    expect(activaciones('001')[0]).toMatchObject({ estado: 'A', fecha_fin: '' });
  });

  it('a body that is not an object is a 422 on the body', () => {
    expect(fails(() => entryAction('001', 'cerrar', [1]))).toEqual([422, 'VALIDATION_ERROR', 'Validation failed', ['body']]);
  });

  it('an empty body is an empty input', () => {
    expect(fails(() => childAction('002', 'activaciones', undefined, 'activar', undefined))[3]).toEqual(['fecha_inicio']);
  });
});

describe('a declared action nobody implements', () => {
  it('answers 501 NOT_IMPLEMENTED', () => {
    expect(fails(() => childAction('001', 'activaciones', undefined, 'avisar')).slice(0, 2)).toEqual([501, 'NOT_IMPLEMENTED']);
  });
});
