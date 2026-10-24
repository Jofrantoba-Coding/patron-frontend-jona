import { describe, expect, it } from 'vitest';
import { RULES_ENTRIES } from '../core/children.rules.fixture';
import { validateRegistry } from './schema.js';

/**
 * A store child shows the owner's fields in the entry of its own parent (R-REG-14, W3-10): `entryFields` picks and orders them and may word each required
 * message. The owner and its own route keep their fields, steps and messages.
 */
const registry = (entryFields: unknown, owner: Record<string, unknown> = {}, child: Record<string, unknown> = {}) => {
  const entries = structuredClone(RULES_ENTRIES);
  const vehiculos = entries.find((e) => e.slug === 'vehiculos') as any;
  vehiculos.fields.push({ name: 'peso', kind: 'text', label: 'Peso', max: 10 }, { name: 'id_transportistas', kind: 'text', label: 'Propietario', max: 10 });
  vehiculos.validation = ['placa', 'peso'];
  Object.assign(vehiculos, owner);
  const parent = entries.find((e) => e.slug === 'transportistas') as any;
  parent.children.vehiculos = { ...parent.children.vehiculos, ...(entryFields === undefined ? {} : { entryFields }), ...child };
  return validateRegistry(entries);
};
const store = (r: ReturnType<typeof registry>) => r.bySlug.get('transportistas/vehiculos');

describe('R-REG-14 entryFields of a store child', () => {
  const view = [{ name: 'peso', message: 'Ingrese Peso' }, { name: 'placa', message: 'Ingrese Placa' }];

  it('keeps the owner fields and steps when none is declared', () => {
    const child = store(registry(undefined));
    expect(child.entryFields).toBeUndefined();
    expect(child.steps).toEqual(['placa', 'peso']);
  });

  it('carries the picked names in order and words the required message of each', () => {
    const child = store(registry(view));
    expect(child.entryFields).toEqual(['peso', 'placa']);
    expect(child.fields.find((f: any) => f.name === 'placa').message).toBe('Ingrese Placa');
    expect(child.fields.find((f: any) => f.name === 'peso').message).toBe('Ingrese Peso');
  });

  it('the steps check the picked fields first, in that order, then what the owner still checks', () => {
    expect(store(registry([{ name: 'peso' }])).steps).toEqual(['peso', 'placa']);
    expect(store(registry(view)).steps).toEqual(['peso', 'placa']);
  });

  it('the owner entry keeps its own fields and messages', () => {
    const owner = registry(view).bySlug.get('vehiculos');
    expect(owner.fields.find((f: any) => f.name === 'placa').message).toBeUndefined();
    expect(owner.steps).toEqual(['placa', 'peso']);
  });

  it('never repeats the ref check of the parent key: the nested route already binds the row to its parent', () => {
    const key = { name: 'id_transportistas', kind: 'select', label: 'Propietario', source: { catalog: 'transportistas' } };
    const entries = structuredClone(RULES_ENTRIES);
    const vehiculos = entries.find((e) => e.slug === 'vehiculos') as any;
    vehiculos.fields = vehiculos.fields.filter((f: any) => f.name !== 'id_transportistas').concat(key);
    vehiculos.validation = ['placa', 'id_transportistas'];
    expect(validateRegistry(entries).bySlug.get('transportistas/vehiculos').steps).toEqual(['placa']);
    expect(validateRegistry(entries).bySlug.get('vehiculos').steps).toEqual(['placa', 'id_transportistas']);
  });

  it('rejects a name the owner does not have, the code and the parent key', () => {
    expect(() => registry([{ name: 'nada' }])).toThrow(/child "vehiculos": entryFields names unknown field "nada" of "vehiculos"/);
    expect(() => registry([{ name: 'id_vehiculos' }])).toThrow(/child "vehiculos": entryFields cannot name the code "id_vehiculos"/);
    expect(() => registry([{ name: 'id_transportistas' }])).toThrow(/child "vehiculos": entryFields cannot name the parent key "id_transportistas"/);
  });

  it('is only for a store child', () => {
    const entries = structuredClone(RULES_ENTRIES);
    const items = entries.find((e) => e.slug === 'items') as any;
    items.children.almacenes.entryFields = [{ name: 'almacen' }];
    expect(() => validateRegistry(entries)).toThrow(/child "almacenes": entryFields needs a store child/);
  });
});
