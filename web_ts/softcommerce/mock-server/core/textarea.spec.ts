import { describe, expect, it } from 'vitest';
import { createRecord, updateRecord } from './catalog.js';
import type { MockError } from './errors.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers.js';
import { validateRegistry } from '../registry/schema.js';

/** The `textarea` kind (R-REG-13, R-CRUD-18): the core treats it as a `text` with its own `rows`. */
const notes = (over: Record<string, any> = {}) => ({
  slug: 'notas', idKey: 'id_notas', codeWidth: 0, entity: 'una nota', scope: 'tenant', seed: 'notas', messages: { style: 'M1' },
  fields: [
    { name: 'titulo', kind: 'text', label: 'Titulo', max: 10 },
    { name: 'comentario', kind: 'textarea', label: 'Comentario', max: 500, rows: 3, normalize: ['upper'], ...over },
  ],
  columns: [{ key: 'titulo', header: 'T' }],
});
const store = (over: Record<string, any> = {}) => createStore({ ...tinySeed(), notas: { a: [] } }, validateRegistry([notes(over)]));
const caught = (fn: () => unknown): MockError => {
  try { fn(); } catch (e) { return e as MockError; }
  throw new Error('expected function to throw');
};

describe('R-REG-13 the textarea kind at load', () => {
  it('is a known kind that keeps its rows and max', () => {
    const field = validateRegistry([notes()]).bySlug.get('notas').fields.find((f: any) => f.name === 'comentario');
    expect(field).toMatchObject({ kind: 'textarea', rows: 3, max: 500 });
  });

  it.each([0, -1, 1.5, '4'])('rejects rows %s', (rows) => {
    expect(() => validateRegistry([notes({ rows })])).toThrow(/field "comentario": rows must be a positive integer/);
  });

  it('rejects rows on a field that is not a textarea', () => {
    const entry = notes();
    entry.fields[0] = { ...entry.fields[0], rows: 2 };
    expect(() => validateRegistry([entry])).toThrow(/field "titulo": rows needs a textarea field/);
  });
});

describe('R-CRUD-18 the core treats a textarea as a text', () => {
  it('trims the value, keeps its line breaks and applies the normalize steps', () => {
    const created = createRecord(store(), 'a', 'notas', { comentario: '  uno\ndos  ' });
    expect(created.comentario).toBe('UNO\nDOS');
  });

  it('S-CRUD-46 a value over the max is a 422 MAX_LENGTH on the field, 500 characters pass', () => {
    const s = store();
    expect(createRecord(s, 'a', 'notas', { comentario: 'a'.repeat(500) }).comentario).toHaveLength(500);
    const error = caught(() => createRecord(s, 'a', 'notas', { comentario: 'a'.repeat(501) }));
    expect([error.status, error.details.map((d) => [d.field, d.code])]).toEqual([422, [['comentario', 'MAX_LENGTH']]]);
  });

  it('a required textarea blank after the trim is a 422 REQUIRED', () => {
    const error = caught(() => createRecord(store({ required: true }), 'a', 'notas', { comentario: '  \n ' }));
    expect(error.details.map((d) => [d.field, d.code])).toEqual([['comentario', 'REQUIRED']]);
  });

  it('is optional by default and an UPDATE stores the new text', () => {
    const s = store();
    const created = createRecord(s, 'a', 'notas', { titulo: 'x' });
    expect(updateRecord(s, 'a', 'notas', created.id_notas, { comentario: 'nuevo' }).comentario).toBe('NUEVO');
  });
});
