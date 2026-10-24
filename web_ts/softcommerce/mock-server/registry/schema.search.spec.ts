import { describe, expect, it } from 'vitest';
import { validateRegistry } from './schema.js';

const text = (name: string) => ({ name, kind: 'text', label: name, required: true, max: 10 });
const entry = (over: Record<string, any> = {}): Record<string, any> => ({
  slug: 'autos', idKey: 'id_autos', codeWidth: 0, entity: 'un auto', scope: 'tenant', seed: 'autos', messages: { style: 'M1' },
  fields: [text('placa'), { name: 'id_marca', kind: 'select', label: 'Marca', source: { catalog: 'marcas' } }],
  columns: [{ key: 'placa', header: 'P' }], joins: [{ as: 'marca', ref: 'id_marca', display: 'descripcion' }], ...over,
});
const marcas = { slug: 'marcas', idKey: 'id_marcas', codeWidth: 0, entity: 'una marca', scope: 'tenant', seed: 'marcas', messages: { style: 'M1' }, fields: [text('descripcion')], columns: [{ key: 'descripcion', header: 'D' }] };

describe('R-REG-16 search declaration', () => {
  it('accepts fields and joined display keys', () => {
    expect(() => validateRegistry([marcas, entry({ search: ['placa', 'marca'] })])).not.toThrow();
  });

  it('rejects an unknown name, naming the entry', () => {
    expect(() => validateRegistry([marcas, entry({ search: ['placa', 'nope'] })])).toThrow(/entry "autos": search names unknown field "nope"/);
  });

  it('rejects a search that is not a list of names', () => {
    expect(() => validateRegistry([marcas, entry({ search: 'placa' })])).toThrow(/search must be a list of field names/);
  });
});
