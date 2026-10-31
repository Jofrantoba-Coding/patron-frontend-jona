import { ApiError } from './ApiError.js';

// Las reglas y los textos que la persona ve: iguales en los cinco patrones.

export const MISSING_DATA_ERROR = 'Ingrese su correo y su contraseña.';

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos.',
  USER_DISABLED: 'Su usuario está bloqueado. Contacte al administrador.',
};

/** Regla pura: el correo y la contraseña son obligatorios. */
export function hasRequiredData(email: string, password: string): boolean {
  return email !== '' && password !== '';
}

/** Traduce el error del servicio a un mensaje; ninguna vista ve un ApiError. */
export function loginErrorMessage(error: unknown): string {
  return (error instanceof ApiError && ERROR_MESSAGES[error.code]) || 'No se pudo iniciar sesión. Intente de nuevo.';
}
