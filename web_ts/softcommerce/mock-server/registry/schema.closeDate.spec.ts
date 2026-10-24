import { describe, expect, it } from 'vitest';
import { parentEntry } from '../core/children.fixture';
import { validateRegistry } from './schema.js';

const text = (name: string) => ({ name, kind: 'text', label: name, max: 10 });
const load = (closeDate: unknown) => () =>
  validateRegistry([parentEntry('clientes', { children: { direcciones: { tab: 'Direcciones', removal: 'deactivate', closeDate, fields: [text('direccion')], columns: [{ key: 'direccion', header: 'D' }] } } })]);

describe('R-REG-14 child closeDate (R-MD-4)', () => {
  it('keeps the column a deactivation closes on the expanded child', () => {
    expect(load('f_fin')).not.toThrow();
    expect(validateRegistry([parentEntry('clientes', { children: { direcciones: { tab: 'D', removal: 'deactivate', closeDate: 'f_fin', fields: [text('direccion')], columns: [{ key: 'direccion', header: 'D' }] } } })]).bySlug.get('clientes/direcciones').closeDate).toBe('f_fin');
  });

  it.each([['a blank name', ''], ['a non-text', 3]])('rejects %s at load', (_name, value) => {
    expect(load(value)).toThrow(/closeDate must be a column name/);
  });
});
