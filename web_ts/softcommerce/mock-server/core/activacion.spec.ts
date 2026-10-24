import { afterEach, describe, expect, it } from 'vitest';
import { presets, TIPO_ANEXO } from '../registry/presets.js';
import { validateRegistry } from '../registry/schema.js';
import { runEntryAction } from './actions.js';
import { createRecord, getRecord, updateRecord } from './catalog.js';
import { parentEntry } from './children.fixture';
import { todayIso } from './dates.js';
import { listChild } from './nested.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers';

/**
 * The server half of the `activacion` rule (R-ANX-2..5, D13) and the real action endpoints (S-MOCK-47..49), over a test master built from the anexo preset.
 * Seeded masters: `001` active (one open row since 2026-03-10), `002` deactivated (closed 2026-02-01), `003` legacy (no rows at all).
 */
const anexo = presets.anexo({ entity: 'Banco', tipoAnexo: TIPO_ANEXO.banco });
const registry = validateRegistry([
  parentEntry('bancos', {
    fields: [{ name: 'id_bancos', kind: 'code', label: 'Codigo' }, { name: 'nombre', kind: 'text', label: 'Nombre', required: true, max: 30 }, { name: 'estado', preset: 'estado' }],
    children: anexo.children, actions: anexo.actions, rules: anexo.rules, constants: anexo.constants, codeWidth: 10,
  }),
]);
const seed = () => ({
  ...tinySeed(),
  bancos: {
    a: [
      { id_bancos: '0000000001', nombre: 'BCP', estado: true, activo: true, activaciones: [{ id: '1', estado: 'A', f_inicio: '2026-03-10', f_fin: '', motivo_activacion: 'INICIO', motivo_desactivacion: '' }] },
      { id_bancos: '0000000002', nombre: 'BBVA', estado: false, activo: true, activaciones: [{ id: '1', estado: 'D', f_inicio: '2026-01-01', f_fin: '2026-02-01', motivo_activacion: 'INICIO', motivo_desactivacion: 'CIERRE' }] },
      { id_bancos: '0000000003', nombre: 'LEGACY', estado: true, activo: true },
    ],
    b: [{ id_bancos: '0000000001', nombre: 'OTRO', estado: true, activo: true }],
  },
});
const store = createStore(seed(), registry);
afterEach(() => store.reset());

const rows = (id: string) => listChild(store, 'a', 'bancos', id, 'activaciones', {}, {}).items.map((r: any) => [r.id, r.estado, r.motivo_activacion, r.f_inicio, r.f_fin ?? '']);
const fails = (run: () => unknown) => {
  try {
    run();
  } catch (e: any) {
    return { status: e.status, code: e.code, message: e.message, details: e.details };
  }
  throw new Error('expected a failure');
};
const estado = (id: string) => getRecord(store, 'a', 'bancos', id, {}).estado;
const put = (id: string, activaciones: unknown[], extra: Record<string, unknown> = {}) => updateRecord(store, 'a', 'bancos', id, { ...extra, children: { activaciones } }, {});

describe('S-ANX-1 / R-ANX-2 the server owns the initial activation', () => {
  it('a create records the INICIO row whether or not the client sent it, and the master is active', () => {
    const created = createRecord(store, 'a', 'bancos', { nombre: 'NUEVO' }, {});
    // The ids of a history share one sequence per section (D-W3-4a-5): the seed holds 1.
    expect(rows(created.id_bancos)).toEqual([['2', 'A', 'INICIO', todayIso(), '']]);
    expect(created).toMatchObject({ estado: true, id_tipo_anexo: '3' });
  });

  it('a create that sends its own first row keeps that row and no INICIO', () => {
    const created = createRecord(store, 'a', 'bancos', { nombre: 'NUEVO', children: { activaciones: [{ op: 'I', f_inicio: '2026-03-01', motivo_activacion: 'apertura' }] } }, {});
    expect(rows(created.id_bancos)).toEqual([['2', 'A', 'APERTURA', '2026-03-01', '']]);
  });

  it('a legacy master with no rows gets INICIO at its first write that carries the history', () => {
    expect(rows('0000000003')).toEqual([]);
    put('0000000003', []);
    expect(rows('0000000003')).toEqual([['2', 'A', 'INICIO', todayIso(), '']]);
    expect(estado('0000000003')).toBe(true);
  });
});

describe('S-ANX-7 one active row', () => {
  it('a body that adds a second active row is a 409 with the entity sentence and changes nothing', () => {
    const before = JSON.stringify(store.data('a'));
    expect(fails(() => put('0000000001', [{ op: 'I', f_inicio: '2026-03-11', motivo_activacion: 'otro' }]))).toMatchObject({ status: 409, code: 'ACTION_NOT_ALLOWED', message: 'Banco ya Esta Activado' });
    expect(JSON.stringify(store.data('a'))).toBe(before);
  });

  it('a deactivation and a new activation in one body leave one active row, and the master follows the last row', () => {
    put('0000000001', [{ op: 'A', id: '1', estado: 'D', f_fin: '2026-03-11', motivo_desactivacion: 'cierre' }, { op: 'I', f_inicio: '2026-03-12', motivo_activacion: 'reingreso' }]);
    expect(rows('0000000001')).toEqual([['1', 'D', 'INICIO', '2026-03-10', '2026-03-11'], ['2', 'A', 'REINGRESO', '2026-03-12', '']]);
    expect(estado('0000000001')).toBe(true);
  });

  it('a deactivation alone turns the master estado off; an activation turns it back on', () => {
    put('0000000001', [{ op: 'A', id: '1', estado: 'D', f_fin: '2026-03-10', motivo_desactivacion: 'cierre' }]);
    expect([estado('0000000001'), rows('0000000001')[0]]).toEqual([false, ['1', 'D', 'INICIO', '2026-03-10', '2026-03-10']]);
    put('0000000001', [{ op: 'I', f_inicio: '2026-03-12', motivo_activacion: 'reingreso' }]);
    expect(estado('0000000001')).toBe(true);
  });

  it('the history is never reactivated by an op: estado A on a deactivated row leaves it deactivated', () => {
    put('0000000002', [{ op: 'A', id: '1', estado: 'A', motivo_activacion: 'X' }]);
    expect(rows('0000000002')[0].slice(0, 2)).toEqual(['1', 'D']);
    expect(estado('0000000002')).toBe(false);
  });
});

describe('S-ANX-6 / R-ANX-4 the fecha fin rule on the server', () => {
  it('rejects a fecha fin before the start with a 422 on the indexed field', () => {
    expect(fails(() => put('0000000001', [{ op: 'A', id: '1', estado: 'D', f_fin: '2026-03-09', motivo_desactivacion: 'cierre' }]))).toMatchObject({
      status: 422, details: [{ field: 'activaciones[0].f_fin', message: 'Fecha es menor a fecha inicial' }],
    });
    expect(rows('0000000001')[0].slice(0, 2)).toEqual(['1', 'A']);
  });

  it('rejects a deactivation without a motivo with Ingrese Motivo, and accepts the same day', () => {
    expect(fails(() => put('0000000001', [{ op: 'A', id: '1', estado: 'D', f_fin: '2026-03-10' }]))).toMatchObject({ status: 422, details: [{ field: 'activaciones[0].motivo_desactivacion', message: 'Ingrese Motivo' }] });
    put('0000000001', [{ op: 'A', id: '1', estado: 'D', f_fin: '2026-03-10', motivo_desactivacion: 'cierre' }]);
    expect(estado('0000000001')).toBe(false);
  });
});

describe('S-ANX-14 / S-ACT-8 estado is derived', () => {
  it('a PUT carrying estado false and no deactivation keeps the master active', () => {
    expect(updateRecord(store, 'a', 'bancos', '0000000001', { nombre: 'BCP SAC', estado: false }, {})).toMatchObject({ nombre: 'BCP SAC', estado: true });
  });

  it('a PUT carrying estado true does not activate a deactivated master, and a POST ignores the body estado', () => {
    expect(updateRecord(store, 'a', 'bancos', '0000000002', { nombre: 'BBVA SAC', estado: true }, {})).toMatchObject({ estado: false });
    expect(createRecord(store, 'a', 'bancos', { nombre: 'NUEVO', estado: false }, {})).toMatchObject({ estado: true });
  });
});

describe('S-MOCK-47..49 the real action endpoints', () => {
  const run = (id: string, action: string, body: unknown) => runEntryAction(store, 'a', 'bancos', id, action, body, {});

  it('S-MOCK-47 activar on a deactivated master adds an active row and derives estado A', () => {
    const answer = run('0000000002', 'activar', { fecha_inicio: '2026-03-12', motivo: 'reingreso' });
    expect(answer).toMatchObject({ row: { estado: true }, message: 'Banco Activado' });
    expect(rows('0000000002')).toEqual([['1', 'D', 'INICIO', '2026-01-01', '2026-02-01'], ['2', 'A', 'REINGRESO', '2026-03-12', '']]);
  });

  it('S-MOCK-48 activar on an active master is a 409 ACTION_NOT_ALLOWED with the rule message and the data unchanged', () => {
    const before = JSON.stringify(store.data('a'));
    expect(fails(() => run('0000000001', 'activar', { fecha_inicio: '2026-03-12', motivo: 'otra' }))).toMatchObject({ status: 409, code: 'ACTION_NOT_ALLOWED', message: 'Banco ya Esta Activado' });
    expect(JSON.stringify(store.data('a'))).toBe(before);
    expect(fails(() => run('0000000001', 'nada', {}))).toMatchObject({ status: 404 });
  });

  it('S-MOCK-49 desactivar with a fecha fin before the start is a 422 on fecha_fin', () => {
    expect(fails(() => run('0000000001', 'desactivar', { fecha_fin: '2026-03-09', motivo: 'cierre' }))).toMatchObject({
      status: 422, details: [{ field: 'fecha_fin', message: 'Fecha es menor a fecha inicial' }],
    });
  });

  it('desactivar closes the active row and turns the master off; a second one says it is already deactivated', () => {
    expect(run('0000000001', 'desactivar', { fecha_fin: '2026-03-10', motivo: 'cierre' })).toMatchObject({ row: { estado: false }, message: 'Banco Desactivado' });
    expect(rows('0000000001')).toEqual([['1', 'D', 'INICIO', '2026-03-10', '2026-03-10']]);
    expect(fails(() => run('0000000001', 'desactivar', { fecha_fin: '2026-03-11', motivo: 'cierre' }))).toMatchObject({ status: 409, message: 'Registro ya esta Desactivado' });
  });

  it('a blank motivo is a 422 Ingrese Motivo on the motivo of the action, and the dates default to today', () => {
    expect(fails(() => run('0000000002', 'activar', { fecha_inicio: '2026-03-12', motivo: ' ' }))).toMatchObject({ status: 422, details: [{ field: 'motivo_activacion', message: 'Ingrese Motivo' }] });
    expect(fails(() => run('0000000001', 'desactivar', { fecha_fin: '2026-03-12' }))).toMatchObject({ status: 422, details: [{ field: 'motivo_desactivacion', message: 'Ingrese Motivo' }] });
    run('0000000002', 'activar', { motivo: 'hoy' });
    expect(rows('0000000002')[1]).toEqual(['2', 'A', 'HOY', todayIso(), '']);
  });

  it('a legacy master with no history is active: activar says so, and the first write of a history gives it INICIO', () => {
    expect(fails(() => run('0000000003', 'activar', { motivo: 'x' }))).toMatchObject({ status: 409, message: 'Banco ya Esta Activado' });
  });

  it('the master of another tenant is a 404', () => {
    expect(fails(() => runEntryAction(store, 'b', 'bancos', '0000000002', 'activar', { motivo: 'x' }, {}))).toMatchObject({ status: 404 });
  });
});
