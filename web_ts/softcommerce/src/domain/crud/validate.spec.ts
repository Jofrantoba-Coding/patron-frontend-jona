import { describe, expect, it } from 'vitest';
import type { FieldConfig } from '../../catalogs/CatalogConfig';
import { normalize } from './normalize';
import { validate } from './validate';

const fields: FieldConfig[] = [
  { kind: 'select', name: 'id_empresa', label: 'Empresa', required: true, lookup: 'empresas' },
  { kind: 'text', name: 'descripcion', label: 'Descripción', required: true, maxLength: 5, uppercase: true },
  { kind: 'text', name: 'direccion', label: 'Dirección' },
  {
    kind: 'cascade',
    name: 'id_ubigeo',
    lookup: 'ubigeo',
    required: true,
    levels: [
      { name: 'departamento', label: 'Departamento' },
      { name: 'provincia', label: 'Provincia' },
      { name: 'distrito', label: 'Distrito' },
    ],
    ancestorsOf: () => [],
  },
];
const valid = { id_empresa: '1', descripcion: 'LIMA', direccion: '', departamento: '15', provincia: '1501', distrito: '150101' };

describe('validate', () => {
  it('accepts a complete form and ignores optional empties', () => {
    expect(validate(fields, valid)).toEqual([]);
  });

  it('reports every error in config.fields order', () => {
    const errors = validate(fields, { ...valid, id_empresa: '', descripcion: '  ', distrito: '' });
    expect(errors.map((e) => e.name)).toEqual(['id_empresa', 'descripcion', 'distrito']);
    expect(errors[1].message).toBe('Descripción es obligatorio.');
  });

  it('flags a value longer than maxLength even when it comes from the server', () => {
    expect(validate(fields, { ...valid, descripcion: 'ABCDEF' })).toEqual([
      { name: 'descripcion', message: 'Descripción no puede superar 5 caracteres.' },
    ]);
  });

  it.each([
    { values: { departamento: '', provincia: '', distrito: '' }, first: 'departamento' },
    { values: { departamento: '15', provincia: '', distrito: '' }, first: 'provincia' },
    { values: { departamento: '15', provincia: '1501', distrito: '' }, first: 'distrito' },
  ])('a required cascade reports only its first unset level: $first', ({ values, first }) => {
    expect(validate(fields, { ...valid, ...values }).map((e) => e.name)).toEqual([first]);
  });
});

describe('normalize', () => {
  it('uppercases only the fields flagged uppercase', () => {
    expect(normalize(fields, { ...valid, descripcion: 'lima', direccion: 'av. x' })).toMatchObject({
      descripcion: 'LIMA',
      direccion: 'av. x',
    });
  });
});
