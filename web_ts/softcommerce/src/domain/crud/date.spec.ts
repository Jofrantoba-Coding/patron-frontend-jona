import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import type { FieldConfig } from '../../catalogs/CatalogConfig';
import { toCatalogConfig } from '../../catalogs/registry';
import { decodeValue, encodeValue, encodeValues } from './codec';
import { sortRows } from './filterSort';
import { formatRows } from './listView';
import { applyModeDefaults, initialValues, isFieldReadOnly } from './modeDefaults';
import { validate } from './validate';

const fecha: FieldConfig = { kind: 'date', name: 'fecha', label: 'Fecha', required: true, default: { INSERT: 'today', CLONE: 'today' } };

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 5, 15, 12, 0));
});
afterEach(() => vi.useRealTimers());

describe('codec: date fields (D7, S-CRUD-27)', () => {
  it('shows a stored ISO date as dd/MM/yyyy', () => {
    expect(decodeValue(fecha, '2026-01-15')).toBe('15/01/2026');
    expect(decodeValue(fecha, undefined)).toBe('');
    expect(decodeValue(fecha, '')).toBe('');
  });

  it('sends a typed dd/MM/yyyy date as ISO', () => {
    expect(encodeValue(fecha, '15/01/2026')).toBe('2026-01-15');
    expect(encodeValues([fecha], { fecha: '05/12/1999' })).toEqual({ fecha: '1999-12-05' });
  });

  it('leaves a blank or an impossible date as typed, for the rules to judge', () => {
    expect(encodeValue(fecha, '')).toBe('');
    expect(encodeValue(fecha, '31/02/2026')).toBe('31/02/2026');
  });
});

describe('R-CRUD-15 date defaults: today, per mode', () => {
  it('INSERT starts today as dd/MM/yyyy', () => {
    expect(initialValues([fecha], 'INSERT')).toEqual({ fecha: '15/06/2026' });
  });

  it('CLONE overrides the cloned date with today; UPDATE keeps the stored one', () => {
    expect(applyModeDefaults([fecha], { fecha: '15/01/2026' }, 'CLONE')).toEqual({ fecha: '15/06/2026' });
    expect(applyModeDefaults([fecha], { fecha: '15/01/2026' }, 'UPDATE')).toEqual({ fecha: '15/01/2026' });
  });

  it('a fixed ISO default is shown as dd/MM/yyyy, and a scalar default is for INSERT only', () => {
    const fixed: FieldConfig = { kind: 'date', name: 'f', label: 'F', default: '2026-02-01' };
    expect(initialValues([fixed], 'INSERT')).toEqual({ f: '01/02/2026' });
    expect(initialValues([fixed], 'UPDATE')).toEqual({ f: '' });
    expect(applyModeDefaults([fixed], { f: '15/01/2026' }, 'CLONE')).toEqual({ f: '15/01/2026' });
  });

  it('readOnlyOn also covers a select and a date', () => {
    const moneda: FieldConfig = { kind: 'select', name: 'id_moneda', label: 'Moneda', source: { catalog: 'monedas' }, default: '00004', readOnlyOn: ['INSERT', 'UPDATE', 'CLONE'] };
    expect(initialValues([moneda], 'INSERT')).toEqual({ id_moneda: '00004' });
    expect([isFieldReadOnly(moneda, 'INSERT', false), isFieldReadOnly(moneda, 'CLONE', false), isFieldReadOnly(moneda, 'DETAIL', true)]).toEqual([true, true, true]);
    expect(isFieldReadOnly({ ...moneda, readOnlyOn: ['CLONE'] }, 'INSERT', false)).toBe(false);
  });
});

describe('G13 date column', () => {
  const columns = [{ key: 'fecha' as const, format: 'date' as const }];
  const rows = [{ fecha: '2026-01-15' }, { fecha: '2025-12-01' }, { fecha: undefined }];

  it('renders dd/MM/yyyy; a missing date is empty', () => {
    expect(formatRows(columns, rows).map((r) => r.fecha)).toEqual(['15/01/2026', '01/12/2025', '']);
  });

  it('sorts by the date, not by its dd/MM/yyyy text', () => {
    const shown = formatRows(columns, rows);
    expect(sortRows(shown, { key: 'fecha', direction: 'asc' }).map((r) => r.fecha)).toEqual(['', '01/12/2025', '15/01/2026']);
    expect(sortRows(shown, { key: 'fecha', direction: 'desc' }).map((r) => r.fecha)).toEqual(['15/01/2026', '01/12/2025', '']);
  });
});

describe('S-CRUD-27 / S-CRUD-28 date rules before submit (shared messages, declared order)', () => {
  const entry = (...over: Record<string, any>[]) =>
    toCatalogConfig(
      validateRegistry([
        {
          slug: 'agenda', idKey: 'id_agenda', codeWidth: 0, entity: 'una Cita', scope: 'tenant', seed: 'agenda', messages: { style: 'M1' },
          fields: [
            { name: 'fecha', kind: 'date', label: 'Fecha', required: true, message: 'La fecha no es válida.', messages: { date: 'La fecha no es válida.' } },
            { name: 'limite', kind: 'date', label: 'Límite', notFuture: true, messages: { notFuture: 'El límite no puede ser futuro.' } },
            { name: 'desde', kind: 'date', label: 'Desde', min: '2026-01-01', messages: { min: 'Desde es muy antiguo.' } },
            { name: 'fecha_ini', kind: 'date', label: 'Fecha Ini' },
            { name: 'fecha_fin', kind: 'date', label: 'Fecha Fin', afterField: 'fecha_ini', messages: { afterField: 'Fecha Fin no puede ser menor que Fecha Ini.' } },
            ...over,
          ],
          columns: [{ key: 'fecha', header: 'F', type: 'date' }],
        },
      ]).entries[0],
    );
  const config = entry();
  const run = (values: Record<string, string>) => validate(config.fields, { fecha: '15/01/2026', limite: '', desde: '', fecha_ini: '', fecha_fin: '', ...values }, { entry: config.entry!, mode: 'INSERT' });
  const errors = (values: Record<string, string>) => run(values).map((e) => [e.name, e.message]);

  it('accepts a real date', () => {
    expect(run({})).toEqual([]);
  });

  it.each(['31/02/2026', '15/13/2026', '15/01/26', '15/01/____', 'abc'])('blocks %s with the date message', (value) => {
    expect(errors({ fecha: value })).toEqual([['fecha', 'La fecha no es válida.']]);
  });

  it('a blank required date shows the same message, first', () => {
    expect(errors({ fecha: '' })).toEqual([['fecha', 'La fecha no es válida.']]);
  });

  it('notFuture: today passes, tomorrow is blocked with the configured message', () => {
    expect(run({ limite: '15/06/2026' })).toEqual([]);
    expect(errors({ limite: '16/06/2026' })).toEqual([['limite', 'El límite no puede ser futuro.']]);
  });

  it('min is inclusive', () => {
    expect(run({ desde: '01/01/2026' })).toEqual([]);
    expect(errors({ desde: '31/12/2025' })).toEqual([['desde', 'Desde es muy antiguo.']]);
  });

  it('afterField: an earlier end is blocked on fecha_fin, equal dates are accepted', () => {
    expect(errors({ fecha_ini: '01/02/2026', fecha_fin: '01/01/2026' })).toEqual([['fecha_fin', 'Fecha Fin no puede ser menor que Fecha Ini.']]);
    expect(run({ fecha_ini: '01/02/2026', fecha_fin: '01/02/2026' })).toEqual([]);
  });

  it('afterField with a blank other date has nothing to compare; an invalid one is its own error first', () => {
    expect(run({ fecha_fin: '01/01/2020' })).toEqual([]);
    expect(errors({ fecha_ini: '31/02/2026', fecha_fin: '01/01/2020' }).map(([name]) => name)).toEqual(['fecha_ini']);
  });

});
