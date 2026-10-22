import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../registry/schema.js';
import { createRecord, updateRecord } from './catalog.js';
import type { MockError } from './errors.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers.js';
import { firstServerOnlyStep } from './validators.js';

/** Test-only entries: no real W2 catalog exists in this slice. */
const text = (name: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label: name, required: true, max: 5, ...extra });
const entry = (slug: string, over: Record<string, any> = {}): Record<string, any> => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'un item', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  columns: [{ key: 'a', header: 'A' }], fields: [text('a'), text('b')],
  unique: [{ fields: ['a'], errorField: 'a', message: 'Ya existe.' }], ...over,
});
const ENTRIES = [
  entry('padres', { fields: [text('a')], unique: undefined }),
  // S-REG-17: the unique check sits between a and b.
  entry('declarado', { validation: ['a', { unique: 0 }, 'b'] }),
  // Default order: fields, then refs, then unique.
  entry('porDefecto', {
    fields: [text('a'), { name: 'id_padre', kind: 'select', label: 'Padre', required: true, source: { catalog: 'padres' } }],
  }),
  entry('compat', { compat: { messages: 'w1' }, unique: undefined }),
];
const row = (slug: string, extra: Record<string, any>) => ({ [`id_${slug}`]: '1', activo: true, ...extra });
const SEED = {
  padres: { a: [row('padres', { a: 'P' })] },
  declarado: { a: [row('declarado', { a: 'X', b: 'Y' })] },
  porDefecto: { a: [row('porDefecto', { a: 'X', id_padre: '1' })] },
  compat: { a: [] },
};
const registry = validateRegistry(ENTRIES);
const store = () => createStore({ ...tinySeed(), ...structuredClone(SEED) }, registry);
const caught = (fn: () => unknown): MockError => {
  try { fn(); } catch (e) { return e as MockError; }
  throw new Error('expected function to throw');
};
const create = (slug: string, body: Record<string, any>) => caught(() => createRecord(store(), 'a', slug, body));
const outcome = (e: MockError) => [e.status, e.code, e.details.map((d) => d.field)];

describe('S-REG-17 declared validation order', () => {
  it('returns the unique error before a later field', () => {
    expect(outcome(create('declarado', { a: 'X', b: '' }))).toEqual([409, 'DUPLICATE', ['a']]);
  });

  it('a failing earlier field comes before the unique check', () => {
    expect(outcome(create('declarado', { a: '', b: '' }))).toEqual([422, 'VALIDATION_ERROR', ['a']]);
  });

  it('after a passing unique the later field is reported', () => {
    expect(outcome(create('declarado', { a: 'Z', b: '' }))).toEqual([422, 'VALIDATION_ERROR', ['b']]);
  });
});

describe('default order: fields, then refs, then unique', () => {
  it('a blank field is reported before a bad ref', () => {
    expect(outcome(create('porDefecto', { a: ' ', id_padre: '99' }))).toEqual([422, 'VALIDATION_ERROR', ['a']]);
  });

  it('a bad ref is reported before a duplicate', () => {
    expect(outcome(create('porDefecto', { a: 'X', id_padre: '99' }))).toEqual([422, 'VALIDATION_ERROR', ['id_padre']]);
  });

  it('a duplicate is the 409 once fields and refs pass', () => {
    expect(outcome(create('porDefecto', { a: 'X', id_padre: '1' }))).toEqual([409, 'DUPLICATE', ['a']]);
  });
});

describe('W2 entries stop at the first failing step', () => {
  it('reports exactly one detail, the first in declared order', () => {
    expect(outcome(create('declarado', { a: '', b: '' }))[2]).toEqual(['a']);
    expect(outcome(create('porDefecto', { a: '', id_padre: '' }))[2]).toEqual(['a']);
  });

  it('applies on update too', () => {
    const s = store();
    expect(outcome(caught(() => updateRecord(s, 'a', 'declarado', '1', { a: '', b: '' })))).toEqual([422, 'VALIDATION_ERROR', ['a']]);
  });

  it('Localidad-style compat entries keep every failing field in one 422', () => {
    expect(outcome(create('compat', { a: '', b: '' }))).toEqual([422, 'VALIDATION_ERROR', ['a', 'b']]);
  });
});

describe('firstServerOnlyStep: the client validates the prefix before it', () => {
  const step = (slug: string) => firstServerOnlyStep(registry.bySlug.get(slug));

  it('is the index of the first unique or ref step', () => {
    expect(step('declarado')).toBe(1);
    expect(step('porDefecto')).toBe(2);
  });

  it('is the whole list when no step is server-only', () => {
    expect(step('padres')).toBe(1);
  });
});
