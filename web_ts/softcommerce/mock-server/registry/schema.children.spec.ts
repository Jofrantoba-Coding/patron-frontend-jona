import { describe, expect, it } from 'vitest';
import { parentEntry } from '../core/children.fixture';
import { validateRegistry } from './schema.js';

const text = (name: string) => ({ name, kind: 'text', label: name, max: 10 });
const withChildren = (children: unknown) => parentEntry('clientes', { children });
const child = (over: Record<string, any> = {}) => ({ fields: [text('direccion')], columns: [{ key: 'direccion', header: 'D' }], ...over });

describe('R-REG-14 child expansion (D5)', () => {
  const registry = validateRegistry([parentEntry('cuentas', { formId: 'miCuenta', scope: 'empresa', stamp: ['id_empresa'], readOnly: false })]);

  it('expands each child into an internal entry with slug parent/name, kept out of the top-level list', () => {
    expect(registry.entries.map((e: any) => e.slug)).toEqual(['cuentas']);
    expect(registry.childEntries.map((e: any) => e.slug)).toEqual(['cuentas/direcciones', 'cuentas/contactos']);
    expect(registry.bySlug.get('cuentas/direcciones')).toMatchObject({ parent: 'cuentas', childName: 'direcciones', parentKey: 'id_cuentas', idKey: 'id' });
    expect('cuentas/direcciones'.includes('/')).toBe(true);
  });

  it('inherits scope, stamp, formId and flags and defaults removal and entry', () => {
    expect(registry.bySlug.get('cuentas/direcciones')).toMatchObject({ scope: 'empresa', stamp: ['id_empresa'], formId: 'miCuenta', removal: 'deactivate', entry: 'dialog' });
    expect(registry.bySlug.get('cuentas/contactos')).toMatchObject({ removal: 'delete', entry: 'dialog' });
  });
});

describe('S-REG-22 child validation at load', () => {
  const load = (children: unknown) => () => validateRegistry([withChildren(children)]);

  it('rejects a child unique naming a missing field, naming the entry and the child', () => {
    expect(load({ direcciones: child({ unique: [{ fields: ['nope'], errorField: 'direccion', message: 'x' }] }) })).toThrow(/entry "clientes\/direcciones": unique names unknown field "nope"/);
  });

  it.each([
    ['refs', { refs: [{ field: 'nope' }] }, /refs names unknown field "nope"/],
    ['joins', { joins: [{ as: 'x', ref: 'nope', display: 'd' }] }, /joins names unknown field "nope"/],
    ['columns', { columns: [{ key: 'direccion', header: 'D' }, { key: 'nope_label', header: 'N' }] }, /column "nope_label"/],
    ['validation', { validation: ['nope'] }, /validation names unknown field "nope"/],
  ])('rejects %s naming an unknown field', (_name, over, message) => {
    expect(load({ direcciones: child(over) })).toThrow(message);
  });

  it('rejects a bad removal or entry', () => {
    expect(load({ direcciones: child({ removal: 'purge' }) })).toThrow(/clientes" child "direcciones": unknown removal "purge"/);
    expect(load({ direcciones: child({ entry: 'popup' }) })).toThrow(/child "direcciones": unknown entry "popup"/);
  });

  it('rejects the reserved name actions and a name that is a parent field', () => {
    expect(load({ actions: child() })).toThrow(/child "actions": reserved name/);
    expect(load({ nombre: child() })).toThrow(/child "nombre": collides with a field of the parent/);
  });

  it('rejects two children with the same name (list form)', () => {
    expect(load([{ name: 'direcciones', ...child() }, { name: 'direcciones', ...child() }])).toThrow(/child "direcciones": duplicate child name/);
  });

  it.each(['id', 'estado', 'op', 'id_clientes'])('rejects a child field named %s', (name) => {
    expect(load({ direcciones: child({ fields: [text(name)] }) })).toThrow(new RegExp(`child "direcciones" field "${name}": reserved`));
  });
});
