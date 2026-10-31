import { ApiError, type ApiErrorDetail } from './ApiError.js';
import type { InterAuthService } from './InterAuthService.js';

/** Cuerpo de error del backend: `{ code, message, details: [{ field, message }], traceId }`. */
interface ErrorBody {
  code?: string;
  message?: string;
  details?: ApiErrorDetail[];
  traceId?: string;
}

/** Nombres de campo del backend -> nombres del contrato de servicio. */
const FIELDS: Record<string, string> = { usuario: 'email', clave: 'password' };

/** Adaptador: implementa el contrato de servicio contra el backend (POST /auth/login). */
export function createAuthServiceHttp({ baseUrl }: { baseUrl: string }): InterAuthService {
  return {
    async login(email, password, remember = false) {
      let response: Response;
      try {
        response = await fetch(`${baseUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuario: email, clave: password, recordarme: remember }),
        });
      } catch {
        throw new ApiError(0, { code: 'NETWORK_ERROR', message: 'No se pudo conectar con el servidor.', details: [], traceId: '' });
      }
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw toApiError(response.status, body);
      return { token: body.token, user: body.user };
    },
  };
}

function toApiError(status: number, body: ErrorBody): ApiError {
  return new ApiError(status, {
    code: body.code ?? 'HTTP_ERROR',
    message: body.message ?? `La petición falló con estado ${status}.`,
    details: (body.details ?? []).map((d) => ({ field: FIELDS[d.field] ?? d.field, message: d.message })),
    traceId: body.traceId ?? '',
  });
}
