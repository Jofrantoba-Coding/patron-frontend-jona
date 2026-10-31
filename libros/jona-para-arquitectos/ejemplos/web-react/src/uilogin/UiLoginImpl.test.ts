import { describe, expect, it } from 'vitest';
import { ApiError } from '../services/ApiError';
import { isValidData, loginErrorMessage } from './UiLoginImpl';

const apiError = (status: number, code: string) => new ApiError(status, { code, message: 'x', details: [], traceId: 't' });

describe('reglas puras de la Implementación (sin React y sin servicios)', () => {
  it('isValidData exige correo y contraseña', () => {
    expect(isValidData('ana@ejemplo.com', 'secreta123')).toBe(true);
    expect(isValidData('', 'secreta123')).toBe(false);
    expect(isValidData('ana@ejemplo.com', '')).toBe(false);
  });

  it('loginErrorMessage traduce el código del ApiError a un mensaje', () => {
    expect(loginErrorMessage(apiError(401, 'INVALID_CREDENTIALS'))).toBe('Correo o contraseña incorrectos.');
    expect(loginErrorMessage(apiError(403, 'USER_DISABLED'))).toBe('Su usuario está bloqueado. Contacte al administrador.');
    expect(loginErrorMessage(apiError(500, 'INTERNAL_ERROR'))).toBe('No se pudo iniciar sesión. Intente de nuevo.');
    expect(loginErrorMessage(new TypeError('cualquier otra falla'))).toBe('No se pudo iniciar sesión. Intente de nuevo.');
  });
});
