import { describe, expect, it } from 'vitest';
import type { FieldConfig } from '../../catalogs/CatalogConfig';
import { normalize } from './normalize';

const fields: FieldConfig[] = [
  { kind: 'code', name: 'id_color', label: 'Código' },
  { kind: 'text', name: 'descripcion', label: 'Descripción', normalize: ['upper'] },
  { kind: 'text', name: 'aduana', label: 'Aduana', normalize: [] },
];

describe('normalize with registry fields (R-CRUD-6, R-CRUD-14)', () => {
  it('S-MOCK-18 trims then applies the declared steps; no steps still trims', () => {
    expect(normalize(fields, { id_color: '', descripcion: '  rojo ', aduana: '  callao ' })).toMatchObject({ descripcion: 'ROJO', aduana: 'callao' });
  });

  it('never sends the server code', () => {
    expect(normalize(fields, { id_color: '007', descripcion: 'a', aduana: 'b' })).not.toHaveProperty('id_color');
  });
});
