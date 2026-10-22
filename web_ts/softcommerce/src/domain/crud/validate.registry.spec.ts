import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../catalogs/registry';
import { validate } from './validate';

const text = (name: string, over: Record<string, unknown> = {}) => ({ name, kind: 'text', label: name.toUpperCase(), required: true, max: 10, ...over });
const build = (over: Record<string, unknown> = {}) =>
  toCatalogConfig(
    validateRegistry([
      {
        slug: 'cosas', idKey: 'id_cosa', codeWidth: 0, entity: 'un Aduana', scope: 'tenant', seed: 'cosas', messages: { style: 'M1' },
        fields: [{ name: 'id_cosa', kind: 'code', label: 'Código' }, text('descripcion', { label: 'Descripción', msgLabel: 'su Descripcion' })],
        columns: [{ key: 'descripcion', header: 'D' }],
        ...over,
      },
    ]).entries[0],
  );

describe('validate in the entry declared order (R-CRUD-6, D10)', () => {
  it.each([
    ['INSERT', 'Para agregar un Aduana, debes especificar su Descripcion.'],
    ['UPDATE', 'Para modificar un Aduana, debes especificar su Descripcion.'],
    ['CLONE', 'Para clonar un Aduana, debes especificar su Descripcion.'],
  ] as const)('S-REF-2 %s words the required message from the shared messages', (mode, message) => {
    const config = build();
    expect(validate(config.fields, { id_cosa: '', descripcion: '   ' }, { entry: config.entry!, mode })).toEqual([{ name: 'descripcion', message }]);
  });

  it('M2 has no entity, MS says Seleccionar, a field message is a literal', () => {
    const m2 = build({ messages: { style: 'M2' } });
    expect(validate(m2.fields, { descripcion: '' }, { entry: m2.entry!, mode: 'INSERT' })[0].message).toBe('Para agregar, debes especificar su Descripcion.');
    const literal = build({ fields: [text('descripcion', { message: 'Falta la descripción.' })] });
    expect(validate(literal.fields, { descripcion: '' }, { entry: literal.entry!, mode: 'INSERT' })[0].message).toBe('Falta la descripción.');
  });

  it('stops at the first failing step: one error, the first in declared order', () => {
    const config = build({ fields: [text('b'), text('a')], validation: ['a', 'b'] });
    expect(validate(config.fields, { a: '', b: '' }, { entry: config.entry!, mode: 'INSERT' }).map((e) => e.name)).toEqual(['a']);
    expect(validate(config.fields, { a: 'x', b: '' }, { entry: config.entry!, mode: 'INSERT' }).map((e) => e.name)).toEqual(['b']);
  });

  it('S-REG-17 validates only the steps before the first server-only step', () => {
    const config = build({
      fields: [text('a'), text('b')],
      validation: ['a', { unique: 0 }, 'b'],
      unique: [{ fields: ['a'], errorField: 'a', message: 'Ya existe.' }],
    });
    const run = (values: Record<string, string>) => validate(config.fields, values, { entry: config.entry!, mode: 'INSERT' }).map((e) => e.name);
    expect(run({ a: '', b: '' })).toEqual(['a']);
    expect(run({ a: 'x', b: '' })).toEqual([]);
  });

  it('ignores the code field and optional empties', () => {
    const config = build({ fields: [{ name: 'id_cosa', kind: 'code', label: 'Código' }, text('nota', { required: false })] });
    expect(validate(config.fields, { id_cosa: '', nota: '' }, { entry: config.entry!, mode: 'INSERT' })).toEqual([]);
  });
});
