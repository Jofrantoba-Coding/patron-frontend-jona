import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../registry/schema.js';
import { createRecord, updateRecord } from './catalog.js';
import { normalizeValue } from './normalize.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers.js';

describe('normalizeValue', () => {
  it.each<[string, unknown, string[], string, { pad?: boolean }?]>([
    ['upper', 'rojo', ['upper'], 'ROJO'],
    ['lower', 'WWW.X.COM', ['lower'], 'www.x.com'],
    ['digits drops everything else', 'a1-2b3', ['digits'], '123'],
    ['padLeft pads with zeros', '5', ['padLeft:2'], '05'],
    ['trims first, then applies (S-MOCK-18)', '  rojo ', ['upper'], 'ROJO'],
    ['applies the list in order (padLeft then upper)', 'f1', ['padLeft:4', 'upper'], '00F1'],
    ['empty stays empty', '', ['padLeft:4', 'upper'], ''],
    ['blank stays empty', '   ', ['padLeft:4'], ''],
    ['digits that remove everything stay empty', 'abc', ['digits', 'padLeft:3'], ''],
    ['input typing skips padLeft (it pads on blur)', 'f1', ['padLeft:4', 'upper'], 'F1', { pad: false }],
    ['no steps only trims', ' x ', [], 'x'],
  ])('%s', (_name, value, steps, expected, options) => {
    expect(normalizeValue(value, steps, options)).toBe(expected);
  });

  it('leaves non-strings alone', () => {
    expect(normalizeValue(7, ['upper'])).toBe(7);
    expect(normalizeValue(false, ['upper'])).toBe(false);
  });
});

describe('S-MOCK-18 the write path normalizes before validating and storing', () => {
  const entry = (over: Record<string, any> = {}) => ({
    slug: 'colores', idKey: 'id_colores', codeWidth: 0, entity: 'un Color', scope: 'tenant', seed: 'colores', messages: { style: 'M1' },
    fields: [
      { name: 'descripcion', kind: 'text', label: 'Descripcion', required: true, max: 5, normalize: ['upper'] },
      { name: 'codigo', kind: 'text', label: 'Codigo', max: 4, normalize: ['digits', 'padLeft:4'] },
    ],
    columns: [{ key: 'descripcion', header: 'D' }], ...over,
  });
  const store = (e = entry()) => createStore({ ...tinySeed(), colores: { a: [] } }, validateRegistry([e]));

  it('stores the trimmed, uppercased value', () => {
    expect(createRecord(store(), 'a', 'colores', { descripcion: '  rojo ' })).toMatchObject({ descripcion: 'ROJO' });
  });

  it('applies padLeft and digits on the server too, and on update', () => {
    const s = store();
    const created = createRecord(s, 'a', 'colores', { descripcion: 'a', codigo: 'x7' });
    expect(created.codigo).toBe('0007');
    expect(updateRecord(s, 'a', 'colores', created.id_colores, { codigo: '12' }).codigo).toBe('0012');
  });

  it('a compat entry keeps the raw W1 value', () => {
    const s = store(entry({ compat: { messages: 'w1' } }));
    expect(createRecord(s, 'a', 'colores', { descripcion: ' rojo' })).toMatchObject({ descripcion: ' rojo' });
  });
});
