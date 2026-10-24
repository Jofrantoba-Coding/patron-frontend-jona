import { describe, expect, it } from 'vitest';
import { ApiError } from '../../services/ApiError';
import { mapServerError } from './serverErrors';

const error = (details: { field: string; message: string }[]) => new ApiError(422, { code: 'VALIDATION', message: 'Falla del servidor', details, traceId: 't-1' });

describe('mapServerError child details (R-MD-5, D6)', () => {
  it('reads <child>[<n>].<field> as the child, the index in the sent array, the field and the message', () => {
    const mapped = mapServerError(error([{ field: 'padrones[1].f_inicio', message: 'Fecha invalida' }, { field: 'direcciones[0].direccion', message: 'Ingrese Direccion' }]), ['nombre']);
    expect(mapped.children).toEqual([
      { child: 'padrones', index: 1, field: 'f_inicio', message: 'Fecha invalida' },
      { child: 'direcciones', index: 0, field: 'direccion', message: 'Ingrese Direccion' },
    ]);
    expect(mapped.form).toBeUndefined();
    expect(mapped.fields).toEqual({});
  });

  it('keeps parent fields apart from child details and leaves other unknown fields in the form alert', () => {
    const mapped = mapServerError(error([{ field: 'nombre', message: 'Ingrese Nombre' }, { field: 'padrones[0].padron', message: 'x' }, { field: 'children.nope', message: 'Unknown child nope' }]), ['nombre']);
    expect(mapped.fields).toEqual({ nombre: 'Ingrese Nombre' });
    expect(mapped.first).toBe('nombre');
    expect(mapped.children).toHaveLength(1);
    expect(mapped.form).toEqual({ message: 'Unknown child nope', traceId: 't-1' });
  });

  it('adds no children key when the failure names none', () => {
    expect('children' in mapServerError(error([{ field: 'nombre', message: 'x' }]), ['nombre'])).toBe(false);
  });
});
