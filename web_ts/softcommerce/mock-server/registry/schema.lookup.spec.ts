import { describe, expect, it } from 'vitest';
import { validateRegistry } from './schema.js';

const text = (name: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label: name, max: 20, ...extra });
const entry = (slug: string, over: Record<string, any> = {}): Record<string, any> => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'un item', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [text('descripcion', { required: true })], columns: [{ key: 'descripcion', header: 'D' }], ...over,
});
const personas = entry('personas', { optionLabel: 'nombre', fields: [text('nombre', { required: true }), text('dni')] });
const lookup = (over: Record<string, any> = {}) => ({
  name: 'id_persona', kind: 'lookup', label: 'Persona', required: true, source: { catalog: 'personas' }, search: ['nombre', 'dni'], ...over,
});
const withLookup = (field: Record<string, any>, extra: Record<string, any> = {}) => [personas, entry('citas', { fields: [text('motivo'), field], ...extra })];
const citas = (registry: ReturnType<typeof validateRegistry>) => registry.bySlug.get('citas');

describe('S-REG-23 lookup validation at load', () => {
  it('rejects a source that is not a registered catalog, naming the entry and the field', () => {
    expect(() => validateRegistry(withLookup(lookup({ source: { catalog: 'nope' } })))).toThrow(/entry "citas" field "id_persona": unknown catalog "nope"/);
  });

  it('rejects a source that is only a W1 builtin source', () => {
    expect(() => validateRegistry(withLookup(lookup({ source: { catalog: 'empresas' } })))).toThrow(/field "id_persona": lookup source "empresas" is not a registered catalog/);
  });

  it('rejects a lookup without search fields', () => {
    expect(() => validateRegistry(withLookup(lookup({ search: undefined })))).toThrow(/field "id_persona": lookup needs search fields/);
    expect(() => validateRegistry(withLookup(lookup({ search: [] })))).toThrow(/field "id_persona": lookup needs search fields/);
  });

  it('rejects a search name the source does not have', () => {
    expect(() => validateRegistry(withLookup(lookup({ search: ['nombre', 'nope'] })))).toThrow(/field "id_persona": search names unknown field "nope" of "personas"/);
  });

  it('rejects a lookup with no source at all', () => {
    expect(() => validateRegistry(withLookup(lookup({ source: undefined })))).toThrow(/field "id_persona": lookup needs a source/);
  });

  it('accepts a search over a field or a joined display key of the source', () => {
    const joined = [
      personas,
      entry('autos', { fields: [text('placa'), { name: 'id_persona', kind: 'select', label: 'P', source: { catalog: 'personas' } }], joins: [{ as: 'duenio', ref: 'id_persona', display: 'nombre' }] }),
      entry('citas', { fields: [text('motivo'), lookup({ name: 'id_auto', source: { catalog: 'autos' }, search: ['placa', 'duenio'] })] }),
    ];
    expect(() => validateRegistry(joined)).not.toThrow();
  });
});

describe('R-REG-6 a lookup is validated as a ref', () => {
  it('declares a ref like a select, with its static where', () => {
    const registry = validateRegistry(withLookup(lookup({ source: { catalog: 'personas', where: { dni: '1' } } })));
    expect(citas(registry).refs).toEqual([{ field: 'id_persona', catalog: 'personas', where: { dni: '1' }, activeOnly: true, parents: [] }]);
    expect(citas(registry).steps).toEqual(['motivo', 'id_persona', { ref: 'id_persona' }]);
  });

  it('may depend on a parent like a select (R-CRUD-12)', () => {
    const registry = validateRegistry([
      personas,
      entry('citas', { fields: [text('motivo'), lookup({ name: 'id_otro', source: { catalog: 'personas' }, dependsOn: [{ field: 'motivo', filterKey: 'dni' }] })] }),
    ]);
    expect(citas(registry).refs[0].parents).toEqual([{ field: 'motivo', filterKey: 'dni' }]);
  });
});

describe('D3 derived display join', () => {
  it('adds a join named after the field without its id_ prefix, showing the source optionLabel', () => {
    const registry = validateRegistry(withLookup(lookup()));
    expect(citas(registry).joins).toEqual([{ as: 'persona', ref: 'id_persona', display: 'nombre' }]);
    expect(citas(registry).fields.find((f: any) => f.name === 'id_persona').display).toBe('persona');
  });

  it('uses the declared display key and a list optionLabel as is', () => {
    const joined = entry('personas', { optionLabel: ['dni', 'nombre'], fields: [text('nombre', { required: true }), text('dni')] });
    const registry = validateRegistry([joined, entry('citas', { fields: [text('motivo'), lookup({ display: 'nombre_persona' })] })]);
    expect(citas(registry).joins).toEqual([{ as: 'nombre_persona', ref: 'id_persona', display: ['dni', 'nombre'] }]);
  });

  it('falls back to descripcion when the source names no optionLabel', () => {
    const registry = validateRegistry([entry('personas'), entry('citas', { fields: [text('motivo'), lookup({ search: ['descripcion'] })] })]);
    expect(citas(registry).joins[0].display).toBe('descripcion');
  });

  it('reuses a join the entry already declares over the same field', () => {
    const registry = validateRegistry(withLookup(lookup(), { joins: [{ as: 'persona_nombre', ref: 'id_persona', display: 'nombre' }] }));
    expect(citas(registry).joins).toEqual([{ as: 'persona_nombre', ref: 'id_persona', display: 'nombre' }]);
    expect(citas(registry).fields.find((f: any) => f.name === 'id_persona').display).toBe('persona_nombre');
  });

  it('rejects a display key that is also a field', () => {
    expect(() => validateRegistry(withLookup(lookup({ display: 'motivo' })))).toThrow(/field "id_persona": display "motivo" is also a field/);
  });
});
