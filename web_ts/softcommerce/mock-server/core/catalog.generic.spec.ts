import { describe, expect, it } from 'vitest';
import { createRecord, deleteRecord, getRecord, listCatalog, updateRecord } from './catalog.js';
import type { MockError } from './errors.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers.js';
import { validateRegistry } from '../registry/schema.js';

/** Test-only entries: no real catalog exists in this slice. */
const text = (name: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label: name, ...extra });
const entry = (slug: string, over: Record<string, any> = {}): Record<string, any> => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'un item', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [text('descripcion', { required: true, max: 10 })], columns: [{ key: 'descripcion', header: 'D' }], ...over,
});
const select = (name: string, catalog: string, extra: Record<string, any> = {}) =>
  ({ name, kind: 'select', label: name, source: { catalog }, ...extra });

const ENTRIES = [
  entry('things', {
    codeWidth: 4,
    fields: [
      text('descripcion', { required: true, max: 10 }),
      { name: 'tipo', kind: 'options', label: 'Tipo', options: [{ value: 'A', label: 'Activo' }, { value: 'I', label: 'Inactivo' }] },
      { name: 'cantidad', kind: 'number', label: 'Cantidad', scale: 0 },
      { name: 'flag', kind: 'boolean', label: 'Flag' },
    ],
  }),
  entry('padres'),
  entry('hijos', {
    fields: [text('descripcion', { required: true, max: 10 }), select('id_padre', 'padres', { required: true })],
    joins: [{ as: 'padre', ref: 'id_padre', display: 'descripcion' }, { as: 'prefijo', ref: 'id_padre', display: 'descripcion', prefixLen: 1 }],
  }),
  entry('nietos', {
    fields: [
      text('descripcion', { required: true, max: 10 }),
      select('id_padre', 'padres', { required: true }),
      select('id_hijo', 'hijos', { required: true, dependsOn: [{ field: 'id_padre', filterKey: 'id_padre' }] }),
      select('id_marca', 'marcas', { source: { catalog: 'marcas', where: { grupo: 'X' } } }),
    ],
  }),
  entry('marcas'),
  entry('series', {
    fields: [text('serie', { required: true, max: 4 }), text('numero')],
    unique: [{ fields: ['serie', 'numero'], errorField: 'serie', message: 'La serie ya existe.' }],
  }),
  entry('modal', { modes: ['UPDATE', 'DETAIL'] }),
  entry('lookup', { scope: 'shared', readOnly: true }),
];

const row = (slug: string, id: string, extra: Record<string, any> = {}) => ({ [`id_${slug}`]: id, descripcion: `R${id}`, activo: true, ...extra });
const SEED = {
  things: { a: [row('things', '0007', { descripcion: 'SEVEN' })], b: [] },
  padres: { a: [row('padres', '1', { descripcion: 'PADRE'}), row('padres', '2', { activo: false })] },
  hijos: { a: [row('hijos', '1', { id_padre: '1' })] },
  marcas: { a: [row('marcas', '1', { grupo: 'X' }), row('marcas', '2', { grupo: 'Y' })] },
  series: { a: [{ id_series: '1', serie: 'F001', numero: '1', activo: true }, { id_series: '2', serie: 'F002', numero: '1', activo: false }] },
  modal: { a: [row('modal', '1')] },
  lookup: [row('lookup', '1')],
};

const store = () => createStore({ ...tinySeed(), ...structuredClone(SEED) }, validateRegistry(ENTRIES));
const caught = (fn: () => unknown): MockError => {
  try { fn(); } catch (e) { return e as MockError; }
  throw new Error('expected function to throw');
};
const create = (s: ReturnType<typeof store>, slug: string, body: Record<string, any>) => createRecord(s, 'a', slug, body);
const fieldsOf = (e: MockError) => e.details.map((d) => d.field);

describe('R-MOCK-9 generic CRUD', () => {
  it('lists, gets, creates, updates and deletes any entry', () => {
    const s = store();
    expect(listCatalog(s, 'a', 'things').items.map((r: any) => r.id_things)).toEqual(['0007']);
    expect(getRecord(s, 'a', 'things', '0007')).toMatchObject({ descripcion: 'SEVEN' });
    const created = create(s, 'things', { descripcion: 'NEW' });
    expect(updateRecord(s, 'a', 'things', created.id_things, { descripcion: 'RENAMED' })).toMatchObject({ descripcion: 'RENAMED' });
    deleteRecord(s, 'a', 'things', created.id_things);
    expect(listCatalog(s, 'a', 'things').items).toHaveLength(1);
  });

  it('filters by a contains match on any field and keeps tenants apart', () => {
    const s = store();
    expect(listCatalog(s, 'a', 'things', { descripcion: 'sev' }).pagination.total).toBe(1);
    expect(listCatalog(s, 'a', 'things', { descripcion: 'zzz' }).pagination.total).toBe(0);
    expect(listCatalog(s, 'b', 'things').items).toEqual([]);
  });

  it('only reads writable fields: id_*, activo and id_usuario in the body are ignored', () => {
    const created = create(store(), 'things', { descripcion: 'X', id_things: '999', activo: false, id_usuario: '9' });
    expect(created).toMatchObject({ id_things: '0008', activo: true });
    expect(created).not.toHaveProperty('id_usuario');
  });

  it.each(ENTRIES.filter((e) => !e.readOnly && !e.modes && e.slug in SEED).map((e) => e.slug))('R-MOCK-7 %s deletes logically', (slug) => {
    const s = store();
    const id = Object.values(listCatalog(s, 'a', slug).items[0] as object)[0] as string;
    deleteRecord(s, 'a', slug, id);
    expect(listCatalog(s, 'a', slug).items.map((r: any) => r[`id_${slug}`])).not.toContain(id);
    expect(getRecord(s, 'a', slug, id)).toMatchObject({ activo: false });
  });

  it('S-MOCK-16 an unknown slug is a 404', () => {
    expect(caught(() => listCatalog(store(), 'a', 'nope')).status).toBe(404);
  });
});

describe('S-MOCK-25 generated code', () => {
  it('pads to codeWidth from the highest existing code', () => {
    expect(create(store(), 'things', { descripcion: 'X' }).id_things).toBe('0008');
  });

  it('keeps ids unpadded when codeWidth is 0', () => {
    expect(create(store(), 'padres', { descripcion: 'X' }).id_padres).toBe('3');
  });
});

describe('field validation', () => {
  it('trims strings before validating and storing', () => {
    expect(create(store(), 'things', { descripcion: '  ab ' }).descripcion).toBe('ab');
    expect(fieldsOf(caught(() => create(store(), 'things', { descripcion: '   ' })))).toEqual(['descripcion']);
  });

  it('checks max length, options membership, integer digits and booleans, one failing step at a time (D10)', () => {
    const bad = { descripcion: 'X'.repeat(11), tipo: 'Z', cantidad: '1.5', flag: 'yes' };
    const ok = { descripcion: 'OK', tipo: 'A', cantidad: 1, flag: true };
    for (const field of Object.keys(bad)) {
      const err = caught(() => create(store(), 'things', { ...ok, [field]: bad[field as keyof typeof bad] }));
      expect([err.status, fieldsOf(err)]).toEqual([422, [field]]);
    }
    expect(fieldsOf(caught(() => create(store(), 'things', bad)))).toEqual(['descripcion']);
    expect(create(store(), 'things', { descripcion: 'OK', tipo: 'A', cantidad: 12, flag: false })).toMatchObject({ flag: false, cantidad: 12 });
  });

  it('stores nothing when validation fails', () => {
    const s = store();
    caught(() => create(s, 'things', { descripcion: '' }));
    expect(listCatalog(s, 'a', 'things').pagination.total).toBe(1);
  });
});

describe('refs', () => {
  it('S-REG-8 rejects an unknown or inactive target with a 422 on the ref field', () => {
    const s = store();
    expect(fieldsOf(caught(() => create(s, 'hijos', { descripcion: 'X', id_padre: '99' })))).toEqual(['id_padre']);
    expect(fieldsOf(caught(() => create(s, 'hijos', { descripcion: 'X', id_padre: '2' })))).toEqual(['id_padre']);
    expect(create(s, 'hijos', { descripcion: 'X', id_padre: '1' })).toMatchObject({ id_padre: '1' });
  });

  it('applies a static where and the belongs-to-parent rule', () => {
    const s = store();
    const body = { descripcion: 'X', id_padre: '1', id_hijo: '1' };
    expect(create(s, 'nietos', { ...body, id_marca: '1' })).toMatchObject({ id_marca: '1' });
    expect(fieldsOf(caught(() => create(s, 'nietos', { ...body, id_marca: '2' })))).toEqual(['id_marca']);
    create(s, 'padres', { descripcion: 'OTRO' });
    expect(fieldsOf(caught(() => create(s, 'nietos', { ...body, id_padre: '3' })))).toEqual(['id_hijo']);
  });

  it('S-MOCK-33 deleting a referenced row is allowed; a later write referencing it is a 422', () => {
    const s = store();
    deleteRecord(s, 'a', 'padres', '1');
    expect(getRecord(s, 'a', 'padres', '1')).toMatchObject({ activo: false });
    expect(fieldsOf(caught(() => create(s, 'hijos', { descripcion: 'X', id_padre: '1' })))).toEqual(['id_padre']);
  });
});

describe('unique keys (R-REG-7)', () => {
  it('answers 409 DUPLICATE on the declared errorField with its message', () => {
    const err = caught(() => create(store(), 'series', { serie: 'F001', numero: '1' }));
    expect([err.status, err.code]).toEqual([409, 'DUPLICATE']);
    expect(err.details).toMatchObject([{ field: 'serie', message: 'La serie ya existe.' }]);
  });

  it('S-REG-9 an update that keeps the key does not conflict with itself', () => {
    expect(updateRecord(store(), 'a', 'series', '1', { serie: 'F001', numero: '1' })).toMatchObject({ serie: 'F001' });
  });

  it('S-REG-10 a logically deleted row frees its key', () => {
    expect(create(store(), 'series', { serie: 'F002', numero: '1' })).toMatchObject({ serie: 'F002' });
  });

  it('reports field errors (422) before the unique check', () => {
    expect(caught(() => create(store(), 'series', { serie: 'F0011', numero: '1' })).status).toBe(422);
  });
});

describe('joins and option labels (R-REG-8, R-MOCK-14)', () => {
  it('S-REG-11 resolves join names, prefix joins and yields an empty string for an inactive target', () => {
    const s = store();
    expect(listCatalog(s, 'a', 'hijos').items[0]).toMatchObject({ padre: 'PADRE', prefijo: 'PADRE' });
    s.data('a').padres[0].activo = false;
    expect(getRecord(s, 'a', 'hijos', '1')).toMatchObject({ padre: '', prefijo: '' });
  });

  it('adds <name>_label for options fields on list and get', () => {
    const s = store();
    const created = create(s, 'things', { descripcion: 'X', tipo: 'I' });
    expect(created).toMatchObject({ tipo: 'I', tipo_label: 'Inactivo' });
    expect(getRecord(s, 'a', 'things', created.id_things).tipo_label).toBe('Inactivo');
    expect(listCatalog(s, 'a', 'things').items[0].tipo_label).toBe('');
  });
});

describe('modes and read-only (R-REG-10, R-REG-11)', () => {
  it('S-REG-13 writes outside modes answer 405 MODE_NOT_SUPPORTED and leave data unchanged', () => {
    const s = store();
    const err = caught(() => create(s, 'modal', { descripcion: 'X' }));
    expect([err.status, err.code]).toEqual([405, 'MODE_NOT_SUPPORTED']);
    expect(caught(() => deleteRecord(s, 'a', 'modal', '1')).code).toBe('MODE_NOT_SUPPORTED');
    expect(updateRecord(s, 'a', 'modal', '1', { descripcion: 'NEW' })).toMatchObject({ descripcion: 'NEW' });
  });

  it('S-REG-14 a read-only entry rejects every write with METHOD_NOT_ALLOWED, distinct from MODE_NOT_SUPPORTED', () => {
    const s = store();
    for (const write of [() => createRecord(s, 'a', 'lookup', {}), () => updateRecord(s, 'a', 'lookup', '1', {}), () => deleteRecord(s, 'a', 'lookup', '1')]) {
      const err = caught(write);
      expect([err.status, err.code]).toEqual([405, 'METHOD_NOT_ALLOWED']);
    }
    expect(listCatalog(s, 'a', 'lookup').items).toHaveLength(1);
    expect(getRecord(s, 'b', 'lookup', '1')).toMatchObject({ descripcion: 'R1' });
  });
});
