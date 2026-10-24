import { describe, expect, it } from 'vitest';
import { parentEntry } from '../core/children.fixture';
import { validateRegistry } from './schema.js';

const text = (name: string) => ({ name, kind: 'text', label: name, max: 10 });
const code = { name: 'id_clientes', kind: 'code', label: 'C' };
const load = (follower: Record<string, unknown>, over: Record<string, any> = {}) => () =>
  validateRegistry([parentEntry('clientes', { fields: [code, text('nombre'), { ...text('copia'), ...follower }], ...over })]);

describe('D27b follows: a field takes a value computed from another field', () => {
  it('accepts a plain copy and a map with an otherwise and a params token', () => {
    expect(load({ follows: { field: 'nombre' } })).not.toThrow();
    expect(load({ follows: { field: 'nombre', map: { A: '$params.PORC_IGV' }, otherwise: 0 } })).not.toThrow();
  });

  it.each([
    ['no source field', { follows: {} }, /follows needs a field/],
    ['an unknown source', { follows: { field: 'nope' } }, /field "copia" follows names unknown field "nope"/],
    ['itself as the source', { follows: { field: 'copia' } }, /follows cannot name its own field/],
    ['a map that is not an object', { follows: { field: 'nombre', map: ['A'] } }, /follows.map must be an object/],
    ['a token that is not a params key', { follows: { field: 'nombre', map: { A: '$params.NOPE' } } }, /follows names unknown params key "NOPE"/],
  ])('rejects %s, naming the entry', (_name, follower, message) => {
    expect(load(follower)).toThrow(message);
    expect(load(follower)).toThrow(/entry "clientes"/);
  });
});

describe('generalTab: the title of the base register tab', () => {
  it('accepts a non-empty title and rejects an empty one or one a layout or child tab already uses', () => {
    expect(load({}, { generalTab: 'Datos de Item' })).not.toThrow();
    expect(load({}, { generalTab: ' ' })).toThrow(/generalTab must be a non-empty text/);
    expect(load({}, { generalTab: 'Direcciones' })).toThrow(/generalTab "Direcciones" is also a child tab/);
    expect(load({}, { generalTab: 'Datos', layout: [{ title: 'Datos', fields: ['nombre'] }] })).toThrow(/layout tab "Datos" is the base tab/);
  });
});
