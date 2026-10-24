import { describe, expect, it } from 'vitest';
import { parentEntry } from '../core/children.fixture';
import { validateRegistry } from './schema.js';

const text = (name: string) => ({ name, kind: 'text', label: name, max: 10 });
const load = (layout: unknown) => () => validateRegistry([parentEntry('clientes', { fields: [{ name: 'id_clientes', kind: 'code', label: 'C' }, text('nombre'), text('telefono'), text('email')], layout })]);

describe('R-REG-14 register layout tabs (R-MD-1)', () => {
  it('keeps a layout of named tabs over the entry fields', () => {
    const registry = validateRegistry([parentEntry('clientes', { fields: [{ name: 'id_clientes', kind: 'code', label: 'C' }, text('nombre'), text('telefono')], layout: [{ title: 'Contacto', fields: ['telefono'] }] })]);
    expect(registry.bySlug.get('clientes').layout).toEqual([{ title: 'Contacto', fields: ['telefono'] }]);
  });

  it('accepts an entry with no layout', () => {
    expect(load(undefined)).not.toThrow();
  });

  it.each([
    ['a non-list', 'Contacto', /layout must be a non-empty list/],
    ['an empty list', [], /layout must be a non-empty list/],
    ['a tab with no title', [{ title: '', fields: ['telefono'] }], /layout tab needs a title/],
    ['the General title', [{ title: 'General', fields: ['telefono'] }], /layout tab "General" is the base tab/],
    ['a repeated title', [{ title: 'A', fields: ['telefono'] }, { title: 'A', fields: ['email'] }], /layout tab "A" is repeated/],
    ['the title of a child tab', [{ title: 'Direcciones', fields: ['telefono'] }], /layout tab "Direcciones" is also a child tab/],
    ['a tab with no fields', [{ title: 'A', fields: [] }], /layout tab "A" needs a non-empty list of fields/],
    ['an unknown field', [{ title: 'A', fields: ['nope'] }], /layout tab "A" names unknown field "nope"/],
    ['the code field', [{ title: 'A', fields: ['id_clientes'] }], /layout tab "A" cannot place the code field "id_clientes"/],
    ['a field placed twice', [{ title: 'A', fields: ['telefono'] }, { title: 'B', fields: ['telefono'] }], /layout places field "telefono" twice/],
  ])('rejects %s at load, naming the entry', (_name, layout, message) => {
    expect(load(layout)).toThrow(message);
    expect(load(layout)).toThrow(/entry "clientes"/);
  });
});
