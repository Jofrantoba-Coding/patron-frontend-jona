import { describe, expect, it } from 'vitest';
import { createRecord } from './catalog.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers.js';
import { validateRegistry } from '../registry/schema.js';

/** A lookup `fill` (R-REG-13): the picked row's values copied into the entry's own fields; the server only stores what the body carries. */
const text = (name: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label: name, max: 30, ...extra });
const entry = (slug: string, over: Record<string, any> = {}): Record<string, any> => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'un item', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [text('descripcion', { required: true })], columns: [{ key: 'descripcion', header: 'D' }], ...over,
});
const personas = entry('personas', { optionLabel: 'nombre', fields: [text('nombre', { required: true }), text('dni'), text('telefono')] });
const lookup = (over: Record<string, any> = {}) => ({
  name: 'id_persona', kind: 'lookup', label: 'Persona', source: { catalog: 'personas' }, search: ['nombre'], columns: [{ key: 'nombre', header: 'N' }],
  filters: [{ field: 'nombre', label: 'N', type: 'text' }], fill: { nombres: 'nombre', numero: 'dni' }, fillReadOnly: ['nombres'], ...over,
});
const citas = (field: Record<string, any>, extra: Record<string, any> = {}) => [
  personas,
  entry('citas', { fields: [text('nombres'), text('numero'), text('telefono'), field], ...extra }),
];

describe('R-REG-13 a lookup fill at load', () => {
  it('is kept on the field: the targets and the source key each', () => {
    const field = validateRegistry(citas(lookup())).bySlug.get('citas').fields.find((f: any) => f.name === 'id_persona');
    expect([field.fill, field.fillReadOnly]).toEqual([{ nombres: 'nombre', numero: 'dni' }, ['nombres']]);
  });

  it('accepts a source key that is a joined display key of the source', () => {
    const registry = [
      entry('sedes', { fields: [text('descripcion', { required: true })] }),
      entry('locales', { fields: [text('nombre'), { name: 'id_sede', kind: 'select', label: 'S', source: { catalog: 'sedes' } }], joins: [{ as: 'sede', ref: 'id_sede', display: 'descripcion' }] }),
      entry('citas', { fields: [text('sede_nombre'), lookup({ name: 'id_local', source: { catalog: 'locales' }, search: ['nombre'], fill: { sede_nombre: 'sede' }, fillReadOnly: undefined })] }),
    ];
    expect(() => validateRegistry(registry)).not.toThrow();
  });

  it('rejects a target that is not a field of the entry', () => {
    expect(() => validateRegistry(citas(lookup({ fill: { nope: 'nombre' } })))).toThrow(/entry "citas" field "id_persona": fill names unknown field "nope"/);
  });

  it('rejects the lookup itself as a target', () => {
    expect(() => validateRegistry(citas(lookup({ fill: { id_persona: 'nombre' } })))).toThrow(/field "id_persona": fill cannot name the lookup itself/);
  });

  it('rejects a source key the source does not have', () => {
    expect(() => validateRegistry(citas(lookup({ fill: { nombres: 'nope' } })))).toThrow(/field "id_persona": fill names unknown source key "nope" of "personas"/);
  });

  it('rejects a fillReadOnly name that is not filled', () => {
    expect(() => validateRegistry(citas(lookup({ fillReadOnly: ['telefono'] })))).toThrow(/field "id_persona": fillReadOnly names "telefono", which fill does not set/);
  });

  it('rejects fill or fillReadOnly on a field that is not a lookup', () => {
    expect(() => validateRegistry(citas(text('otro', { fill: { nombres: 'nombre' } })))).toThrow(/field "otro": fill needs a lookup field/);
    expect(() => validateRegistry(citas(text('otro', { fillReadOnly: ['nombres'] })))).toThrow(/field "otro": fillReadOnly needs a lookup field/);
  });
});

describe('S-MST-18 the server stores the copied values', () => {
  const store = () => createStore({ ...tinySeed(), personas: { a: [{ id_personas: '1', nombre: 'ANA', dni: '123', telefono: '9', activo: true }] }, citas: { a: [] } }, validateRegistry(citas(lookup())));

  it('a body carrying the copied fields is stored as sent, trimmed', () => {
    const created = createRecord(store(), 'a', 'citas', { id_persona: '1', nombres: ' ANA ', numero: '123', telefono: '9' });
    expect(created).toMatchObject({ id_persona: '1', nombres: 'ANA', numero: '123', telefono: '9' });
  });
});
