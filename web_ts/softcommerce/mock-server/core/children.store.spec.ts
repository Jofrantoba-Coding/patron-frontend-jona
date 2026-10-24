import { afterEach, describe, expect, it } from 'vitest';
import { createRecord, deleteRecord, listCatalog, updateRecord } from './catalog.js';
import { RULES_REGISTRY, RULES_SEED } from './children.rules.fixture';
import { createChild, getChild, listChild, removeChild, updateChild } from './nested.js';
import { createStore } from './store.js';

const store = createStore(RULES_SEED, RULES_REGISTRY);
afterEach(() => store.reset());

const nested = (id: string) => listChild(store, 'a', 'transportistas', id, 'vehiculos', {}, {}).items.map((r: any) => r.id_vehiculos);
const owner = () => listCatalog(store, 'a', 'vehiculos', {}, {}).items.map((r: any) => r.id_vehiculos);

describe('S-REG-30 store-backed child (R-REG-14)', () => {
  const child = RULES_REGISTRY.bySlug.get('transportistas/vehiculos');

  it('has no seed and no section of its own: it reads the section of the owning entry', () => {
    expect(child).toMatchObject({ parent: 'transportistas', parentKey: 'id_transportistas', section: 'vehiculos', idKey: 'id_vehiculos', seed: null, store: { entry: 'vehiculos', key: 'id_transportistas' } });
    expect(Object.keys(store.data('a'))).not.toContain('transportistas/vehiculos');
    expect(store.data('a').vehiculos).toHaveLength(3);
  });

  it('the nested list equals the owning entry rows filtered by the key', () => {
    expect(nested('001')).toEqual(['001', '003']);
    expect(nested('002')).toEqual(['002']);
    expect(listChild(store, 'a', 'transportistas', '001', 'vehiculos', {}, {}).items[0]).toMatchObject({ placa: 'AAA111', id_transportistas: '001' });
  });

  it('a nested write is visible through the owner route', () => {
    const created = createChild(store, 'a', 'transportistas', '002', 'vehiculos', { placa: 'NEW444' }, {});
    expect(created).toMatchObject({ id_vehiculos: '004', id_transportistas: '002' });
    expect(owner()).toContain('004');
    updateChild(store, 'a', 'transportistas', '002', 'vehiculos', '004', { placa: 'NEW555' }, {});
    expect(listCatalog(store, 'a', 'vehiculos', { placa: 'NEW555' }, {}).items).toHaveLength(1);
    removeChild(store, 'a', 'transportistas', '002', 'vehiculos', '004', {});
    expect(owner()).not.toContain('004');
  });

  it('a write through the owner route is visible in the nested list', () => {
    createRecord(store, 'a', 'vehiculos', { placa: 'OWN777', id_transportistas: '002' }, {});
    expect(nested('002')).toEqual(['002', '004']);
    updateRecord(store, 'a', 'vehiculos', '001', { id_transportistas: '002' }, {});
    expect(nested('001')).toEqual(['003']);
    deleteRecord(store, 'a', 'vehiculos', '003', {});
    expect(nested('001')).toEqual([]);
  });

  it('get is bound to the parent', () => {
    expect(getChild(store, 'a', 'transportistas', '001', 'vehiculos', '001', {})).toMatchObject({ placa: 'AAA111' });
    expect(() => getChild(store, 'a', 'transportistas', '001', 'vehiculos', '002', {})).toThrow(/not found/);
  });

  it('cascade marks the shared section rows of the deleted parent only; the seeds stay with the owner', () => {
    deleteRecord(store, 'a', 'usuarios', '001', {});
    expect(store.shared.series.map((r: any) => [r.id_series, r.activo])).toEqual([['001', false], ['002', true]]);
    deleteRecord(store, 'a', 'transportistas', '001', {});
    expect(store.data('a').vehiculos.map((r: any) => [r.id_vehiculos, r.activo])).toEqual([['001', false], ['002', true], ['003', false]]);
  });

  it('a composite body writes the store child rows through the owner keys', () => {
    updateRecord(store, 'a', 'transportistas', '001', { children: { vehiculos: [{ op: 'I', placa: 'NEW1' }, { op: 'A', id: '001', placa: 'AAA999' }, { op: 'E', id: '003' }] } }, {});
    expect(nested('001')).toEqual(['001', '004']);
    expect(listChild(store, 'a', 'transportistas', '001', 'vehiculos', {}, {}).items.map((r: any) => r.placa)).toEqual(['AAA999', 'NEW1']);
    try {
      updateRecord(store, 'a', 'transportistas', '001', { children: { vehiculos: [{ op: 'A', id: '002', placa: 'X' }] } }, {});
    } catch (e: any) {
      expect(e.details.map((d: any) => [d.field, d.code])).toEqual([['vehiculos[0].id', 'NOT_FOUND']]);
      return;
    }
    throw new Error('expected a failure');
  });
});
