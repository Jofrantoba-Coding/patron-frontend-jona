import { describe, expect, it } from 'vitest';
import { RULES_ENTRIES } from '../core/children.rules.fixture';
import { PARAM_KEYS, isGateParam } from './paramKeys.js';
import { validateRegistry } from './schema.js';

const gated = (gate: unknown) => () => {
  const entries = structuredClone(RULES_ENTRIES);
  const items = entries.find((e) => e.slug === 'items') as any;
  items.children.almacenes.gate = gate;
  return validateRegistry(entries);
};
const fieldGated = (gate: unknown) => () => {
  const entries = structuredClone(RULES_ENTRIES);
  const items = entries.find((e) => e.slug === 'items') as any;
  items.fields[1].gate = gate;
  return validateRegistry(entries);
};
const withDefault = (value: unknown) => () => {
  const entries = structuredClone(RULES_ENTRIES);
  const items = entries.find((e) => e.slug === 'items') as any;
  items.fields.push({ name: 'por_igv', kind: 'number', label: 'Porc. IGV', scale: 2, max: 5, default: value });
  return validateRegistry(entries);
};

describe('S-REG-24 gate validation at load (R-REG-17, D25)', () => {
  it('accepts a boolean params key on a child, with or without `in`', () => {
    expect(gated({ param: 'IS_CLIENTE_SUSTITUTO' })).not.toThrow();
    expect(gated({ param: 'ISBOTICA', in: [true] })).not.toThrow();
  });

  it('rejects a gate.param that is not a params key, naming the child', () => {
    expect(gated({ param: 'NOPE' })).toThrow(/entry "items" child "almacenes": gate.param "NOPE" is not a params key/);
  });

  it('rejects PORC_IGV as gate.param (D25): it is a number, a value source', () => {
    expect(gated({ param: 'PORC_IGV' })).toThrow(/gate.param "PORC_IGV" is a value, not a gate/);
    expect(gated({ param: 'INICIO_ACTIVIDADES' })).toThrow(/gate.param "INICIO_ACTIVIDADES" is a value, not a gate/);
  });

  it('rejects a gate without a param and a bad `in`', () => {
    expect(gated({})).toThrow(/gate needs a param/);
    expect(gated({ param: 'ISBOTICA', in: [] })).toThrow(/gate.in must be a non-empty list/);
  });

  it('applies the same rules to a field gate, naming the field', () => {
    expect(fieldGated({ param: 'IS_CLIENTE_CREDITO' })).not.toThrow();
    expect(fieldGated({ param: 'NOPE' })).toThrow(/entry "items" field "nombre": gate.param "NOPE" is not a params key/);
  });

  it('isGateParam is true for the boolean keys only', () => {
    expect(['IS_CLIENTE_SUSTITUTO', 'ISBOTICA', 'PORC_IGV', 'INICIO_ACTIVIDADES', 'NOPE'].map(isGateParam)).toEqual([true, true, false, false, false]);
    expect(Object.keys(PARAM_KEYS)).toContain('PORC_IGV');
  });
});

describe('D27b `$params.X` default token at load', () => {
  it('accepts a params key and rejects an unknown one', () => {
    expect(withDefault('$params.PORC_IGV')).not.toThrow();
    expect(withDefault('$params.NOPE')).toThrow(/entry "items" field "por_igv": default names unknown params key "NOPE"/);
  });
});
