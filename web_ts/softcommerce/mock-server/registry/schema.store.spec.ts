import { describe, expect, it } from 'vitest';
import { RULES_ENTRIES } from '../core/children.rules.fixture';
import { validateRegistry } from './schema.js';

const withStore = (store: unknown, extra: Record<string, unknown> = {}) => {
  const entries = structuredClone(RULES_ENTRIES);
  const parent = entries.find((e) => e.slug === 'transportistas') as any;
  parent.children.vehiculos = { ...parent.children.vehiculos, store, ...extra };
  return () => validateRegistry(entries);
};

describe('R-REG-14 store child validation at load (S-REG-30)', () => {
  it('accepts the declared store child', () => {
    expect(withStore({ entry: 'vehiculos', key: 'id_transportistas' })).not.toThrow();
  });

  it('rejects an unknown or non top-level owning entry, a missing key, and the parent itself', () => {
    expect(withStore({ entry: 'nada', key: 'k' })).toThrow(/child "vehiculos": store names unknown entry "nada"/);
    expect(withStore({ entry: 'items/almacenes', key: 'k' })).toThrow(/child "vehiculos": store names unknown entry "items\/almacenes"/);
    expect(withStore({ entry: 'transportistas', key: 'k' })).toThrow(/child "vehiculos": store cannot name its own parent/);
    expect(withStore({ entry: 'vehiculos' })).toThrow(/child "vehiculos": store needs an entry and a key/);
  });

  it('rejects own fields, unique, joins or validation: the rows and rules are the owner', () => {
    for (const key of ['fields', 'unique', 'joins', 'validation']) {
      expect(withStore({ entry: 'vehiculos', key: 'id_transportistas' }, { [key]: [] })).toThrow(new RegExp(`child "vehiculos": a store child takes ${key} from "vehiculos"`));
    }
  });
});
