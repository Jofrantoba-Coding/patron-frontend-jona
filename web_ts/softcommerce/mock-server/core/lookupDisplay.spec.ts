import { describe, expect, it } from 'vitest';
import { createRecord, getRecord, listCatalog, updateRecord } from './catalog.js';
import type { MockError } from './errors.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers.js';
import { validateRegistry } from '../registry/schema.js';

/** Test-only entries: no real catalog declares a lookup yet (W3-3 is the first consumer). */
const text = (name: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label: name, max: 30, ...extra });
const entry = (slug: string, over: Record<string, any> = {}): Record<string, any> => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'un item', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [text('descripcion', { required: true })], columns: [{ key: 'descripcion', header: 'D' }], ...over,
});

const ENTRIES = [
  entry('personas', { optionLabel: 'nombre', fields: [{ name: 'id_personas', kind: 'code', label: 'Codigo' }, text('nombre', { required: true })] }),
  entry('zonas', { optionLabel: ['codigo', 'nombre'], fields: [text('codigo'), text('nombre')] }),
  entry('citas', {
    fields: [
      text('motivo', { required: true, message: 'Falta motivo' }),
      { name: 'id_persona', kind: 'lookup', label: 'Persona', required: true, message: 'Falta persona', source: { catalog: 'personas' }, search: ['nombre'], columns: [{ key: 'nombre', header: 'N' }], filters: [{ field: 'nombre', label: 'N', type: 'text' }] },
      { name: 'id_zona', kind: 'lookup', label: 'Zona', source: { catalog: 'zonas' }, search: ['nombre'], display: 'zona_texto', columns: [{ key: 'nombre', header: 'N' }], filters: [{ field: 'nombre', label: 'N', type: 'text' }] },
    ],
  }),
];

const SEED = {
  personas: {
    a: [
      { id_personas: '0000000042', nombre: 'JUAN PEREZ', activo: true },
      { id_personas: '0000000043', nombre: 'LUIS RETIRADO', activo: false },
    ],
  },
  zonas: { a: [{ id_zonas: '1', codigo: 'Z1', nombre: 'NORTE', activo: true }] },
  citas: { a: [{ id_citas: '1', motivo: 'CONSULTA', id_persona: '0000000042', id_zona: '1', activo: true }] },
};

const store = () => createStore({ ...tinySeed(), ...structuredClone(SEED) }, validateRegistry(ENTRIES));
const caught = (fn: () => unknown): MockError => {
  try { fn(); } catch (e) { return e as MockError; }
  throw new Error('expected function to throw');
};
const create = (s: ReturnType<typeof store>, body: Record<string, any>) => createRecord(s, 'a', 'citas', body);

describe('S-CRUD-49 server half: the description comes from the derived join', () => {
  it('get and list restore the description of a stored lookup', () => {
    const s = store();
    expect(getRecord(s, 'a', 'citas', '1')).toMatchObject({ id_persona: '0000000042', persona: 'JUAN PEREZ', zona_texto: 'Z1 - NORTE' });
    expect(listCatalog(s, 'a', 'citas').items[0]).toMatchObject({ persona: 'JUAN PEREZ', zona_texto: 'Z1 - NORTE' });
  });

  it('a create answers with the joined description and stores only the id', () => {
    const s = store();
    const created = create(s, { motivo: 'CONTROL', id_persona: '0000000042' });
    expect(created).toMatchObject({ id_persona: '0000000042', persona: 'JUAN PEREZ', zona_texto: '' });
    expect(s.data('a').citas.at(-1)).not.toHaveProperty('persona');
  });

  it('a body cannot set the joined description: only the id is read', () => {
    const created = create(store(), { motivo: 'X', id_persona: '0000000042', persona: 'HACKED' });
    expect(created.persona).toBe('JUAN PEREZ');
  });

  it('a stored lookup whose record was deactivated afterwards shows an empty description', () => {
    const s = store();
    s.data('a').personas[0].activo = false;
    expect(getRecord(s, 'a', 'citas', '1')).toMatchObject({ id_persona: '0000000042', persona: '' });
  });
});

describe('a write of an inactive or unknown id answers 422 on the field', () => {
  it.each([['inactive', '0000000043'], ['unknown', '0000000099']])('create with an %s id', (_name, id) => {
    const error = caught(() => create(store(), { motivo: 'X', id_persona: id }));
    expect([error.status, error.details.map((d) => d.field)]).toEqual([422, ['id_persona']]);
  });

  it('update with an unknown id, and an optional lookup left blank is accepted', () => {
    const s = store();
    expect(caught(() => updateRecord(s, 'a', 'citas', '1', { id_zona: '99' })).details.map((d) => d.field)).toEqual(['id_zona']);
    expect(updateRecord(s, 'a', 'citas', '1', { id_zona: '' })).toMatchObject({ id_zona: '', zona_texto: '' });
  });

  it('a required lookup left blank answers its configured message', () => {
    const error = caught(() => create(store(), { motivo: 'X', id_persona: '' }));
    expect(error.details).toEqual([{ field: 'id_persona', code: 'REQUIRED', message: 'Falta persona' }]);
  });
});
