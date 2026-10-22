import { describe, expect, it } from 'vitest';
import { MockError, notFound, toErrorBody, validationError } from './errors.js';

describe('mock errors', () => {
  it('serializes a MockError to the { code, message, details, traceId } shape', () => {
    const err = new MockError(409, 'CONFLICT', 'Already exists', [{ field: 'id', message: 'dup' }]);
    expect(toErrorBody(err, 'trace-1')).toEqual({
      code: 'CONFLICT',
      message: 'Already exists',
      details: [{ field: 'id', message: 'dup' }],
      traceId: 'trace-1',
    });
    expect(err.status).toBe(409);
  });

  it('defaults details to an empty array and maps helpers to status codes', () => {
    const nf = notFound('Localidad x not found');
    expect(nf.status).toBe(404);
    expect(toErrorBody(nf, 't').details).toEqual([]);
    const ve = validationError([{ field: 'descripcion', message: 'required' }]);
    expect(ve.status).toBe(422);
    expect(ve.code).toBe('VALIDATION_ERROR');
    expect(ve.details).toEqual([{ field: 'descripcion', message: 'required' }]);
  });

  it('maps unknown errors to a generic 500 without leaking the original message', () => {
    expect(toErrorBody(new Error('secret stack detail'), 't-9')).toEqual({
      code: 'INTERNAL_ERROR',
      message: 'Unexpected server error',
      details: [],
      traceId: 't-9',
    });
  });
});
