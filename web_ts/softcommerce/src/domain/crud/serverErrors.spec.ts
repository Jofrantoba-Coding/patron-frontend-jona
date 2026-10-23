import { describe, expect, it } from 'vitest';
import { ApiError } from '../../services/ApiError';
import { mapServerError } from './serverErrors';

const error = (status: number, details: { field: string; message: string }[], message = 'Falla del servidor') =>
  new ApiError(status, { code: 'X', message, details, traceId: 't-1' });
const ORDER = ['descripcion', 'serie', 'abrev'];

describe('mapServerError (R-CRUD-7, S-CRUD-17, S-CRUD-38)', () => {
  it('S-CRUD-17 a 409 detail on serie shows under serie and focuses it', () => {
    expect(mapServerError(error(409, [{ field: 'serie', message: 'La serie ya existe.' }]), ORDER)).toEqual({
      fields: { serie: 'La serie ya existe.' },
      first: 'serie',
    });
  });

  it('S-CRUD-38 two fields: both map, and the first in config order (not response order) is focused', () => {
    const mapped = mapServerError(error(422, [{ field: 'abrev', message: 'B' }, { field: 'descripcion', message: 'A' }]), ORDER);
    expect(mapped.fields).toEqual({ abrev: 'B', descripcion: 'A' });
    expect(mapped.first).toBe('descripcion');
  });

  it('S-CRUD-38 a detail naming an unknown field becomes the form-level message', () => {
    const mapped = mapServerError(error(422, [{ field: 'descripcion', message: 'A' }, { field: 'otro', message: 'Rara' }]), ORDER);
    expect(mapped).toEqual({ fields: { descripcion: 'A' }, first: 'descripcion', form: { message: 'Rara', traceId: 't-1' } });
  });

  it('an error without details, a 500, or a non-API error is form-level only', () => {
    expect(mapServerError(error(422, []), ORDER)).toEqual({ fields: {}, form: { message: 'Falla del servidor', traceId: 't-1' } });
    expect(mapServerError(error(500, [{ field: 'serie', message: 'x' }]), ORDER).fields).toEqual({});
    expect(mapServerError(new Error('boom'), ORDER)).toEqual({ fields: {}, form: { message: 'boom' } });
  });
});
