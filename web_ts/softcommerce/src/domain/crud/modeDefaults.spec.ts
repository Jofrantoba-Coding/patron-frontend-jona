import { describe, expect, it } from 'vitest';
import type { CrudMode, FieldConfig } from '../../catalogs/CatalogConfig';
import { applyModeDefaults, initialValues, isFieldReadOnly } from './modeDefaults';

const estado: FieldConfig = {
  kind: 'boolean', name: 'estado', label: 'Activo', default: { INSERT: true }, readOnlyOn: ['INSERT', 'CLONE', 'DETAIL', 'DELETE'],
};
const descripcion: FieldConfig = { kind: 'text', name: 'descripcion', label: 'Descripción' };
const fields = [descripcion, estado];

describe('S-REF-7 estado semantics (R-CRUD-15)', () => {
  it('INSERT starts true and read-only', () => {
    expect(initialValues(fields, 'INSERT')).toEqual({ descripcion: '', estado: 'true' });
    expect(isFieldReadOnly(estado, 'INSERT', false)).toBe(true);
  });

  it('UPDATE is editable and can be set to false', () => {
    expect(isFieldReadOnly(estado, 'UPDATE', false)).toBe(false);
    expect(applyModeDefaults(fields, { descripcion: 'X', estado: 'false' }, 'UPDATE')).toEqual({ descripcion: 'X', estado: 'false' });
  });

  it('CLONE copies the source value and shows it read-only', () => {
    expect(applyModeDefaults(fields, { descripcion: 'X', estado: 'false' }, 'CLONE')).toEqual({ descripcion: 'X', estado: 'false' });
    expect(isFieldReadOnly(estado, 'CLONE', false)).toBe(true);
  });

  it.each(['DETAIL', 'DELETE'] as CrudMode[])('%s is read-only', (mode) => {
    expect(isFieldReadOnly(estado, mode, true)).toBe(true);
  });
});

describe('per-mode defaults (R-CRUD-15)', () => {
  const perMode: FieldConfig = { kind: 'boolean', name: 'flag', label: 'Flag', default: { INSERT: true, CLONE: false } };

  it('a per-mode default overrides the cloned value', () => {
    expect(applyModeDefaults([perMode], { flag: 'true' }, 'CLONE')).toEqual({ flag: 'false' });
  });

  it('a scalar default applies on INSERT only: CLONE and UPDATE keep the record value', () => {
    const scalar: FieldConfig = { kind: 'boolean', name: 'flag', label: 'Flag', default: true };
    expect(initialValues([scalar], 'INSERT')).toEqual({ flag: 'true' });
    expect(applyModeDefaults([scalar], { flag: 'false' }, 'CLONE')).toEqual({ flag: 'false' });
    expect(initialValues([scalar], 'UPDATE')).toEqual({ flag: 'false' });
  });

  it('a boolean without a default starts unchecked; text starts empty', () => {
    expect(initialValues([descripcion, { kind: 'boolean', name: 'hab_guia', label: 'Hab Guia' }], 'INSERT')).toEqual({ descripcion: '', hab_guia: 'false' });
  });

  it('a read-only form makes every field read-only', () => {
    expect(isFieldReadOnly(descripcion, 'DETAIL', true)).toBe(true);
    expect(isFieldReadOnly(descripcion, 'INSERT', false)).toBe(false);
  });
});

describe('options defaults and read-only (G7)', () => {
  const tipo: FieldConfig = {
    kind: 'options', name: 'tipo', label: 'Tipo', display: 'select', default: 'A', readOnlyOn: ['UPDATE'],
    options: [{ value: 'A', label: 'Activo' }, { value: 'I', label: 'Inactivo' }],
  };

  it('starts at the default on INSERT; with no default it starts empty', () => {
    expect(initialValues([tipo], 'INSERT')).toEqual({ tipo: 'A' });
    expect(initialValues([{ ...tipo, default: undefined }], 'INSERT')).toEqual({ tipo: '' });
  });

  it('keeps the record value on UPDATE and honours readOnlyOn', () => {
    expect(applyModeDefaults([tipo], { tipo: 'I' }, 'UPDATE')).toEqual({ tipo: 'I' });
    expect(isFieldReadOnly(tipo, 'UPDATE', false)).toBe(true);
    expect(isFieldReadOnly(tipo, 'INSERT', false)).toBe(false);
  });
});
