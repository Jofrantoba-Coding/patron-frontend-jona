import { ApiError } from '../services/ApiError';

/** R-AUTH-4: each account rejection has its own message; wrong credentials stay generic. */
const REJECTION_MESSAGES: Record<string, string> = {
  USER_DISABLED: 'El usuario está deshabilitado.',
  NO_DESKTOP_ACCESS: 'El usuario no tiene acceso a escritorio.',
  INVALID_CREDENTIALS: 'Usuario o contraseña incorrectos.',
};

export interface Failure {
  message: string;
  traceId?: string;
}

/** R-AUTH-9: server message plus traceId; a known rejection shows its own text. */
export function toFailure(error: unknown): Failure {
  if (error instanceof ApiError) {
    const known = REJECTION_MESSAGES[error.code];
    return known ? { message: known } : { message: error.message, traceId: error.traceId };
  }
  return { message: error instanceof Error ? error.message : 'No fue posible completar la operación.' };
}
