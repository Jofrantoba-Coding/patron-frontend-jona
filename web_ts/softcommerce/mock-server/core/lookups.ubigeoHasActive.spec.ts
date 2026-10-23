import { describe, expect, it } from 'vitest';
import { lookupOptions } from './lookups.js';
import { createStore } from './store.js';
import { readSeed } from './test-helpers.js';
import type { MockError } from './errors.js';

/** S-MOCK-31 `ubigeoHasActive`: `lookups/ubigeo?parent=&has=zonas` keeps the ubigeos that contain an active zona (R-MOCK-16). */
const zona = (id: string, ubigeo: string, over: Record<string, unknown> = {}) => ({ id_zona: id, descripcion: `Z${id}`, id_ubigeo: ubigeo, estado: true, activo: true, ...over });
const store = () =>
  createStore({
    ...readSeed(),
    zonas: {
      demo: [
        zona('1', '150101'),
        zona('2', '150103'),
        // The estado flag is the Activo checkbox of the screen; only the logical delete takes a zona out of the picture.
        zona('3', '070101', { estado: false }),
        zona('4', '080101', { activo: false }),
      ],
      botica: [zona('1', '040201')],
    },
  });
const ids = (tenant: string, filters: Record<string, string>) => lookupOptions(store(), tenant, 'ubigeo', filters).items.map((i: { id: string }) => i.id);
const caught = (fn: () => unknown): MockError => {
  try { fn(); } catch (e) { return e as MockError; }
  throw new Error('expected function to throw');
};

describe('S-MOCK-31 only the ubigeos with an active zona', () => {
  it('has=zonas without a parent offers the departamentos that contain one (a deleted zona does not count)', () => {
    expect(ids('demo', { has: 'zonas' })).toEqual(['07', '15']);
  });

  it('the provincias and distritos below a parent are filtered the same way', () => {
    expect(ids('demo', { parent: '15', has: 'zonas' })).toEqual(['1501']);
    expect(ids('demo', { parent: '1501', has: 'zonas' })).toEqual(['150101', '150103']);
    expect(ids('demo', { parent: '07', has: 'zonas' })).toEqual(['0701']);
  });

  it('answers {id,name} items like the plain children rule', () => {
    expect(lookupOptions(store(), 'demo', 'ubigeo', { parent: '1501', has: 'zonas' }).items).toEqual([{ id: '150101', name: 'LIMA' }, { id: '150103', name: 'ATE' }]);
  });

  it('is per tenant: botica has its own zona only', () => {
    expect(ids('botica', { has: 'zonas' })).toEqual(['04']);
    expect(ids('botica', { parent: '04', has: 'zonas' })).toEqual(['0402']);
  });

  it('a departamento whose only zona was deleted is gone, and an unknown parent is an empty list', () => {
    expect(ids('demo', { has: 'zonas' })).not.toContain('08');
    expect(ids('demo', { parent: '99', has: 'zonas' })).toEqual([]);
  });

  it('without has it is still the plain children rule', () => {
    expect(ids('demo', {})).toEqual(['04', '07', '08', '15']);
    expect(ids('demo', { parent: '15', has: '' })).toEqual(['1501', '1505']);
  });

  it('an unknown has value answers an empty list, never an error; an unknown key is still a 400', () => {
    expect(ids('demo', { has: 'nada' })).toEqual([]);
    expect(ids('demo', { has: 'localidades' })).toEqual([]);
    expect(caught(() => lookupOptions(store(), 'demo', 'ubigeo', { other: '1' })).code).toBe('INVALID_FILTER');
  });
});
