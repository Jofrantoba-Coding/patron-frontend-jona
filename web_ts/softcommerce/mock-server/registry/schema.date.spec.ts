import { describe, expect, it } from 'vitest';
import { REGISTRY } from './index.js';
import { validateRegistry } from './schema.js';

const base = (...fields: Record<string, any>[]): Record<string, any> => ({
  slug: 'things', idKey: 'id_thing', codeWidth: 0, entity: 'una cosa', scope: 'tenant', seed: 'things', messages: { style: 'M1' },
  fields: [{ name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 10 }, ...fields],
  columns: [{ key: 'descripcion', header: 'Descripción' }],
});
const fecha = (over: Record<string, any> = {}) => ({ name: 'fecha', kind: 'date', label: 'Fecha', required: true, ...over });

const REJECTED: [string, Record<string, any>, RegExp][] = [
  ['a default that is neither today nor an ISO date', base(fecha({ default: '15/01/2026' })), /field "fecha".*default "15\/01\/2026" is not today or an ISO date/],
  ['a per-mode default with a bad date', base(fecha({ default: { INSERT: 'today', CLONE: '2026-02-31' } })), /field "fecha".*default "2026-02-31" is not today or an ISO date/],
  ['a min that is not an ISO date', base(fecha({ min: '01/01/2026' })), /field "fecha".*min "01\/01\/2026" is not an ISO date/],
  ['a notFuture that is not a boolean', base(fecha({ notFuture: 'yes' })), /field "fecha".*notFuture must be a boolean/],
  ['an afterField naming a missing field', base(fecha({ afterField: 'ghost' })), /afterField names unknown field "ghost"/],
  ['an afterField naming a field that is not a date', base(fecha({ afterField: 'descripcion' })), /field "fecha".*afterField must name a date field/],
  ['notFuture on a text field', base({ name: 'x', kind: 'text', label: 'X', notFuture: true }), /field "x".*notFuture needs a date field/],
  ['afterField on a text field', base({ name: 'x', kind: 'text', label: 'X', afterField: 'descripcion' }), /field "x".*afterField needs a date field/],
];

describe('date fields in the registry (R-REG-2, R-CRUD-11)', () => {
  it.each(REJECTED)('rejects %s', (_name, entry, message) => {
    expect(() => validateRegistry([entry])).toThrow(message);
  });

  it('accepts today, an ISO default, a per-mode map, the range rules and a date column', () => {
    const entry = {
      ...base(
        fecha({ default: { INSERT: 'today', CLONE: 'today' }, notFuture: true, min: '2020-01-01' }),
        fecha({ name: 'hasta', default: '2026-01-15', afterField: 'fecha' }),
      ),
      columns: [{ key: 'fecha', header: 'Fecha', type: 'date' }],
    };
    expect(() => validateRegistry([entry])).not.toThrow();
  });

  it('S-CRUD-28 no Wave 2 catalog enables notFuture, min or afterField (test-only capability)', () => {
    const enabled = REGISTRY.entries.flatMap((e: any) => e.fields.filter((f: any) => f.kind === 'date' && (f.notFuture || f.min || f.afterField)).map((f: any) => `${e.slug}.${f.name}`));
    expect(enabled).toEqual([]);
  });
});
