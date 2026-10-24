import { describe, expect, it } from 'vitest';
import { parentEntry } from '../core/children.fixture';
import { validateRegistry } from './schema.js';

const text = (name: string) => ({ name, kind: 'text', label: name, max: 10 });
const child = (over: Record<string, any> = {}) => ({ tab: 'Direcciones', removal: 'deactivate', fields: [text('direccion')], columns: [{ key: 'direccion', header: 'D' }], ...over });
const load = (quitar: unknown) => () => validateRegistry([parentEntry('clientes', { children: { direcciones: child({ quitar }) } })]);

describe('R-REG-14 child quitar messages (R-MD-4)', () => {
  it('keeps the messages the grid shows on the expanded child', () => {
    const registry = validateRegistry([parentEntry('clientes', { children: { direcciones: child({ quitar: { none: 'Seleccione Fila.', confirm: 'Desea Quitar Direccion?', already: 'Direccion ya Esta desactivada' } }) } })]);
    expect(registry.bySlug.get('clientes/direcciones').quitar).toEqual({ none: 'Seleccione Fila.', confirm: 'Desea Quitar Direccion?', already: 'Direccion ya Esta desactivada' });
  });

  it('keeps them on a store child too', () => {
    const owner = { slug: 'series', idKey: 'id_series', codeWidth: 3, entity: 'una serie', scope: 'tenant', seed: 'series', messages: { style: 'M1' }, fields: [{ name: 'id_series', kind: 'code', label: 'C' }, text('id_clientes')], columns: [{ key: 'id_series', header: 'C' }] };
    const registry = validateRegistry([owner, parentEntry('clientes', { children: { series: { tab: 'Series', removal: 'delete', store: { entry: 'series', key: 'id_clientes' }, quitar: { none: 'Seleccione Serie' } } } })]);
    expect(registry.bySlug.get('clientes/series').quitar).toEqual({ none: 'Seleccione Serie' });
  });

  it.each([
    ['an unknown key', { nope: 'x' }, /quitar names unknown key "nope"/],
    ['a blank message', { none: '' }, /quitar.none must be a non-empty text/],
    ['a non-object', 'Seleccione', /quitar must be an object/],
  ])('rejects %s at load', (_name, quitar, message) => {
    expect(load(quitar)).toThrow(message);
  });
});
