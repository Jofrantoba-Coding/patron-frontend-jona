import { afterEach, describe, expect, it } from 'vitest';
import { padrones } from '../registry/catalogs/padrones.js';
import { presets } from '../registry/presets.js';
import { validateRegistry } from '../registry/schema.js';
import { createRecord, getRecord, updateRecord } from './catalog.js';
import { parentEntry } from './children.fixture';
import { todayIso } from './dates.js';
import { listChild } from './nested.js';
import { applyOps, checkOps, flagsOf, INCOMPATIBLE_EXCEPTUADO, INCOMPATIBLE_PERCEPCION, padron, YA_ACTIVADO } from './padronRule.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers';

/**
 * The named rule `padron` (R-ANX-7, R-ANX-8, `FormAnexoPadron.verificarPadron`): the pure checks (one active row per padron, `01` against `02` / `03`), the
 * derived master flags, and the server half over a test Proveedor built from the preset. Rows: `{ id, id_padron, estado, f_inicio, f_fin }`.
 */
const FLAGS = { '02': 'flag_retencion', '03': 'flag_percepcion', '04': 'flag_buen_contrib' };
const row = (id: string, id_padron: string, estado = 'A') => ({ id, id_padron, estado, f_inicio: '2026-03-01', f_fin: estado === 'D' ? '2026-03-05' : '' });
const add = (id_padron: string, extra: Record<string, unknown> = {}) => ({ op: 'I', id_padron, f_inicio: '2026-03-11', ...extra });
const deactivate = (id: string) => ({ op: 'A', id, estado: 'D', f_fin: '2026-03-11' });
const check = (stored: any[], ops: any[]) => checkOps(stored, ops, { child: 'padrones' });

describe('S-ANX-9 the incompatibility checks of verificarPadron', () => {
  it('refuses the same padron while it is active', () => {
    expect(check([row('1', '02')], [add('02')])).toEqual({ conflict: YA_ACTIVADO, index: 0 });
    expect(YA_ACTIVADO).toBe('Padron ya se Encuentra Activado');
  });

  it.each([
    ['02', '02'],
    ['03', '03'],
  ])('refuses 01 while %s is active (the 03 case the desktop missed [DEVIATION])', (active) => {
    expect(check([row('1', active)], [add('01')])).toEqual({ conflict: INCOMPATIBLE_PERCEPCION, index: 0 });
    expect(INCOMPATIBLE_PERCEPCION).toBe('Configuracion incompatible, Desactive AG. Percepcion y/o AG. Retencion');
  });

  it.each(['02', '03'])('refuses %s while 01 is active', (id) => {
    expect(check([row('1', '01')], [add(id)])).toEqual({ conflict: INCOMPATIBLE_EXCEPTUADO, index: 0 });
    expect(INCOMPATIBLE_EXCEPTUADO).toBe('Configuracion incompatible, Desactive Exceptuado');
  });

  it('accepts a padron the active ones do not clash with, and ignores the deactivated rows', () => {
    expect(check([row('1', '02')], [add('03')])).toBeNull();
    expect(check([row('1', '02'), row('2', '04')], [add('03')])).toBeNull();
    expect(check([row('1', '02', 'D')], [add('02')])).toBeNull();
    expect(check([row('1', '01', 'D')], [add('02')])).toBeNull();
  });

  it('replays the ops in order: a deactivation and a re-activation in one body is fine, two inserts of one padron are not', () => {
    expect(check([row('1', '02')], [deactivate('1'), add('02')])).toBeNull();
    expect(check([], [add('02'), add('02')])).toEqual({ conflict: YA_ACTIVADO, index: 1 });
    expect(check([], [add('02'), add('01')])).toEqual({ conflict: INCOMPATIBLE_PERCEPCION, index: 1 });
  });

  it('a delete op frees the padron', () => {
    expect(check([row('1', '02')], [{ op: 'E', id: '1' }, add('02')])).toBeNull();
  });
});

describe('R-ANX-8 the flags follow the active rows by padron id', () => {
  it('derives each flag from the active rows only', () => {
    const rows = [row('1', '02'), row('2', '03', 'D'), row('3', '04')];
    expect(flagsOf(rows, FLAGS)).toEqual({ flag_retencion: true, flag_percepcion: false, flag_buen_contrib: true });
  });

  it('applyOps adds an active row for an insert and closes a row for a deactivation', () => {
    const out = applyOps([row('1', '02')], [deactivate('1'), add('04')], '2026-03-12');
    expect(out.map((r: any) => [r.id_padron, r.estado])).toEqual([['02', 'D'], ['04', 'A']]);
  });

  it('the entry rule owns the flags so a body never writes them', () => {
    expect(padron.owns({ flags: FLAGS })).toEqual(['flag_retencion', 'flag_percepcion', 'flag_buen_contrib']);
  });
});

/** The server half: a test Proveedor over the preset and the real `padrones` catalog. */
const padronPreset = presets.padron({ master: 'proveedor' });
const registry = validateRegistry([
  padrones,
  parentEntry('proveedores', {
    fields: [{ name: 'id_proveedores', kind: 'code', label: 'Codigo' }, { name: 'nombre', kind: 'text', label: 'Nombre', required: true, max: 30 }, ...padronPreset.fields],
    children: padronPreset.children, rules: padronPreset.rules,
  }),
]);
const seed = () => ({
  ...tinySeed(),
  padrones: [
    { id_padron: '01', descripcion: 'EXCEPTUADO', para_proveedor: false, para_cliente: true, activo: true },
    { id_padron: '02', descripcion: 'AG. RETENCION', para_proveedor: true, para_cliente: true, activo: true },
    { id_padron: '03', descripcion: 'AG. PERCEPCION', para_proveedor: true, para_cliente: true, activo: true },
    { id_padron: '04', descripcion: 'BUEN CONTRIBUYENTE', para_proveedor: true, para_cliente: false, activo: true },
  ],
  proveedores: {
    a: [
      { id_proveedores: '001', nombre: 'ACME', activo: true, flag_retencion: true, flag_percepcion: false, flag_buen_contrib: false, padrones: [{ id: '1', id_padron: '02', estado: 'A', f_inicio: '2026-01-01', f_fin: '' }] },
      { id_proveedores: '002', nombre: 'BETA', activo: true, flag_retencion: false, flag_percepcion: false, flag_buen_contrib: false },
    ],
    b: [],
  },
});
const store = createStore(seed(), registry);
afterEach(() => store.reset());

const rows = (id: string) => listChild(store, 'a', 'proveedores', id, 'padrones', {}, {}).items.map((r: any) => [r.id, r.id_padron, r.estado, r.f_inicio, r.f_fin ?? '']);
const flags = (id: string) => {
  const r: any = getRecord(store, 'a', 'proveedores', id, {});
  return [r.flag_retencion, r.flag_percepcion, r.flag_buen_contrib];
};
const put = (id: string, ops: unknown[], extra: Record<string, unknown> = {}) => updateRecord(store, 'a', 'proveedores', id, { ...extra, children: { padrones: ops } }, {});
const fails = (run: () => unknown) => {
  try {
    run();
  } catch (e: any) {
    return { status: e.status, code: e.code, message: e.message, details: e.details };
  }
  throw new Error('expected a failure');
};

describe('S-ANX-9 the server refuses before any write (check before write)', () => {
  it('409 ACTION_NOT_ALLOWED with the desktop sentence, and nothing is stored', () => {
    expect(fails(() => put('001', [add('02')]))).toMatchObject({ status: 409, code: 'ACTION_NOT_ALLOWED', message: 'Padron ya se Encuentra Activado' });
    expect(rows('001')).toEqual([['1', '02', 'A', '2026-01-01', '']]);
  });

  it('a body whose first op is valid and second is not writes neither', () => {
    expect(fails(() => put('002', [add('03'), add('03')]))).toMatchObject({ status: 409, message: 'Padron ya se Encuentra Activado' });
    expect(rows('002')).toEqual([]);
    expect(flags('002')).toEqual([false, false, false]);
  });

  it('01 over an active 02 gives the percepcion sentence; a padron the master does not offer is a 422 on the indexed field', () => {
    expect(fails(() => put('001', [add('03'), add('02')]))).toMatchObject({ status: 409 });
    expect(fails(() => put('002', [add('01')]))).toMatchObject({ status: 422, details: [{ field: 'padrones[0].id_padron' }] });
  });

  it('a blank padron says Seleccione Padron', () => {
    expect(fails(() => put('002', [{ op: 'I', f_inicio: '2026-03-11' }]))).toMatchObject({ status: 422, details: [{ field: 'padrones[0].id_padron', message: 'Seleccione Padron' }] });
  });
});

describe('S-ANX-12 / S-ANX-13 history and the derived flags', () => {
  it('an activation adds an active row dated as sent and turns its flag on', () => {
    put('002', [add('04')]);
    // The ids of a history share one sequence per section (D-W3-4a-5): the seed holds 1.
    expect(rows('002')).toEqual([['2', '04', 'A', '2026-03-11', '']]);
    expect(flags('002')).toEqual([false, false, true]);
  });

  it('a deactivation closes the row with fecha fin today when none is sent and unchecks the flag', () => {
    put('001', [{ op: 'A', id: '1', estado: 'D' }]);
    expect(rows('001')).toEqual([['1', '02', 'D', '2026-01-01', todayIso()]]);
    expect(flags('001')).toEqual([false, false, false]);
  });

  it('S-ANX-13 re-activating a deactivated padron adds a new active row and keeps the old one as history', () => {
    put('001', [deactivate('1')]);
    put('001', [add('02', { f_inicio: '2026-03-12' })]);
    expect(rows('001')).toEqual([['1', '02', 'D', '2026-01-01', '2026-03-11'], ['2', '02', 'A', '2026-03-12', '']]);
    expect(flags('001')).toEqual([true, false, false]);
  });

  it('a body never writes the flags: they stay what the rows say', () => {
    put('002', [], { flag_retencion: true, flag_buen_contrib: true });
    expect(flags('002')).toEqual([false, false, false]);
  });

  it('a create with padron rows derives the flags, one without leaves them off', () => {
    const withRows = createRecord(store, 'a', 'proveedores', { nombre: 'NUEVO', flag_percepcion: false, children: { padrones: [add('03'), add('04')] } }, {});
    expect([withRows.flag_retencion, withRows.flag_percepcion, withRows.flag_buen_contrib]).toEqual([false, true, true]);
    const none = createRecord(store, 'a', 'proveedores', { nombre: 'OTRO' }, {});
    expect([none.flag_retencion, none.flag_percepcion, none.flag_buen_contrib]).toEqual([false, false, false]);
  });
});
