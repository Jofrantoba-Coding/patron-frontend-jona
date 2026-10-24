import { afterEach, describe, expect, it } from 'vitest';
import { validateRegistry } from '../registry/schema.js';
import { createRecord } from './catalog.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers';

/** D27b: a default `$params.PORC_IGV` is the company parameter, read at write time from the tenant params. */
const registry = validateRegistry([{
  slug: 'impuestos', idKey: 'id_impuestos', codeWidth: 3, entity: 'un impuesto', scope: 'tenant', seed: 'impuestos', messages: { style: 'M1' },
  fields: [
    { name: 'id_impuestos', kind: 'code', label: 'Codigo' },
    { name: 'nombre', kind: 'text', label: 'Nombre', max: 20 },
    { name: 'por_igv', kind: 'number', label: 'Porc. IGV', scale: 2, max: 6, default: '$params.PORC_IGV' },
  ],
  columns: [{ key: 'nombre', header: 'Nombre' }],
}]);
const seed = { ...tinySeed(), impuestos: { a: [], b: [] }, params: { a: { INICIO_ACTIVIDADES: '2020-01-01', PORC_IGV: 18 }, b: { INICIO_ACTIVIDADES: '2021-06-01', PORC_IGV: 10.5 } } };
const store = createStore(seed, registry);
afterEach(() => store.reset());

describe('D27b `$params.X` default', () => {
  it('stores the tenant parameter value when the body leaves the field out', () => {
    expect(createRecord(store, 'a', 'impuestos', { nombre: 'X' }, {})).toMatchObject({ por_igv: 18 });
    expect(createRecord(store, 'b', 'impuestos', { nombre: 'X' }, {})).toMatchObject({ por_igv: 10.5 });
  });

  it('a value in the body wins over the default', () => {
    expect(createRecord(store, 'a', 'impuestos', { nombre: 'X', por_igv: '0' }, {})).toMatchObject({ por_igv: '0' });
  });
});
