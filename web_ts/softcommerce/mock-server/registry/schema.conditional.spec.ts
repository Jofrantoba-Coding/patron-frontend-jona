import { describe, expect, it } from 'vitest';
import { toCatalogConfig } from '../../src/catalogs/registry';
import { validateRegistry } from './schema.js';

const base = (...fields: Record<string, any>[]): Record<string, any> => ({
  slug: 'things', idKey: 'id_thing', codeWidth: 0, entity: 'una cosa', scope: 'tenant', seed: 'things', messages: { style: 'M1' },
  fields: [{ name: 'tipo', kind: 'text', label: 'Tipo', max: 2 }, ...fields],
  columns: [{ key: 'tipo', header: 'Tipo' }],
});
const nota = (over: Record<string, any> = {}) => ({ name: 'nota', kind: 'text', label: 'Nota', max: 5, ...over });
const TICKET = { field: 'tipo', in: ['TI'] };

describe('conditional attributes in the registry (R-REG-4)', () => {
  it('clearsOnChange must name known fields', () => {
    expect(() => validateRegistry([base(nota({ clearsOnChange: ['nope'] }))])).toThrow(/clearsOnChange names unknown field "nope"/);
  });

  it('clearsOnChange must be a list', () => {
    expect(() => validateRegistry([base(nota({ clearsOnChange: 'tipo' }))])).toThrow(/clearsOnChange must be a list/);
  });

  it('a condition needs a list of values', () => {
    expect(() => validateRegistry([base(nota({ visibleWhen: { field: 'tipo' } }))])).toThrow(/visibleWhen needs a condition/);
  });

  it('accepts the conditions and the clear list', () => {
    expect(() => validateRegistry([base(nota({ visibleWhen: TICKET, enabledWhen: TICKET, requiredWhen: TICKET, clearsOnChange: ['tipo'] }))])).not.toThrow();
  });

  it('the UI config carries every condition and the clear list of a field', () => {
    const entry = validateRegistry([base(nota({ visibleWhen: TICKET, enabledWhen: TICKET, requiredWhen: TICKET, clearsOnChange: ['tipo'] }))]).entries[0];
    expect(toCatalogConfig(entry).fields.find((f) => f.name === 'nota')).toMatchObject({ visibleWhen: TICKET, enabledWhen: TICKET, requiredWhen: TICKET, clearsOnChange: ['tipo'] });
  });

  it.each(['boolean', 'options', 'number', 'date'])('the UI config carries a condition of a %s field', (kind) => {
    const field: Record<string, any> = { name: 'x', kind, label: 'X', visibleWhen: TICKET };
    if (kind === 'options') Object.assign(field, { options: [{ value: 'a', label: 'A' }] });
    if (kind === 'number') Object.assign(field, { scale: 0 });
    const entry = validateRegistry([base(field)]).entries[0];
    expect(toCatalogConfig(entry).fields.find((f) => f.name === 'x')).toMatchObject({ visibleWhen: TICKET });
  });
});
