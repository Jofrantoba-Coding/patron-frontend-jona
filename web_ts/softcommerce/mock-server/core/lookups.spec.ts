import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../registry/schema.js';
import type { MockError } from './errors.js';
import { lookupOptions } from './lookups.js';
import { createStore } from './store.js';
import { readSeed } from './test-helpers.js';

/** Test-only entries for the indirect (`via`) lookup filter of R-MOCK-16; the real pair lands in 6.5. */
const text = (name: string) => ({ name, kind: 'text', label: name, required: true, max: 10 });
const entry = (slug: string, over: Record<string, any> = {}): Record<string, any> => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'un item', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [text('descripcion')], columns: [{ key: 'descripcion', header: 'D' }], ...over,
});
const registry = validateRegistry([
  entry('familias', { fields: [text('descripcion'), { name: 'codigo_sunat', kind: 'text', label: 'Sunat', max: 10 }] }),
  entry('subs', {
    idKey: 'codigo', scope: 'shared', readOnly: true,
    fields: [{ name: 'codigo', kind: 'code', label: 'Código' }, text('descripcion'), { name: 'codigo_familia', kind: 'text', label: 'Familia', max: 10 }],
    lookupFilters: { id_familia: { via: { catalog: 'familias', key: 'codigo_sunat', as: 'codigo_familia' } } },
  }),
]);
const familia = (id: string, codigo_sunat: string) => ({ id_familias: id, descripcion: `F${id}`, codigo_sunat, activo: true });
const sub = (codigo: string, codigo_familia: string, activo = true) => ({ codigo, descripcion: `S${codigo}`, codigo_familia, activo });
const store = () =>
  createStore(
    {
      ...readSeed(),
      familias: { demo: [familia('1', '5010'), familia('2', ''), familia('3', '5011')] },
      subs: [sub('501001', '5010'), sub('501002', '5010'), sub('501003', '5010', false), sub('501101', '5011')],
    },
    registry,
  );
const caught = (fn: () => unknown): MockError => {
  try { fn(); } catch (e) { return e as MockError; }
  throw new Error('expected function to throw');
};
const ids = (result: { items: { id: string }[] }) => result.items.map((i) => i.id);

describe('S-MOCK-30 via: an indirect filter key is resolved server-side', () => {
  it('filters the options by the value the chosen row holds, active rows only', () => {
    expect(ids(lookupOptions(store(), 'demo', 'subs', { id_familia: '1' }))).toEqual(['501001', '501002']);
    expect(lookupOptions(store(), 'demo', 'subs', { id_familia: '3' }).items).toEqual([{ id: '501101', name: 'S501101' }]);
  });

  it('is empty when the chosen row holds no value, or does not exist', () => {
    expect(lookupOptions(store(), 'demo', 'subs', { id_familia: '2' }).items).toEqual([]);
    expect(lookupOptions(store(), 'demo', 'subs', { id_familia: '99' }).items).toEqual([]);
  });

  it('still rejects a key the entry does not declare', () => {
    const error = caught(() => lookupOptions(store(), 'demo', 'subs', { codigo_sunat: '5010' }));
    expect([error.status, error.code]).toEqual([400, 'INVALID_FILTER']);
  });
});

describe('S-MOCK-30 ubigeoChildren: lookups/ubigeo?parent= is a rule', () => {
  it('answers departamentos without a parent and the children of one with it', () => {
    expect(ids(lookupOptions(store(), 'demo', 'ubigeo', {}))).toEqual(['04', '07', '08', '15']);
    expect(ids(lookupOptions(store(), 'demo', 'ubigeo', { parent: '15' }))).toEqual(['1501', '1505']);
    expect(lookupOptions(store(), 'demo', 'ubigeo', { parent: '1501' }).items).toContainEqual({ id: '150103', name: 'ATE' });
  });

  it('an unknown parent is an empty list, an unknown key a 400', () => {
    expect(lookupOptions(store(), 'demo', 'ubigeo', { parent: '99' }).items).toEqual([]);
    expect(caught(() => lookupOptions(store(), 'demo', 'ubigeo', { other: '1' })).code).toBe('INVALID_FILTER');
  });
});
