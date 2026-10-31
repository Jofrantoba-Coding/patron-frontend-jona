import { ApiError } from './ApiError.js';
import type { InterAuthService } from './InterAuthService.js';

/** Cuerpo de error del backend: `{ error: { code, message, fields: [{ name, message }] }, traceId }`. */
interface ErrorBody {
  error?: { code?: string; message?: string; fields?: Array<{ name: string; message: string }> };
  traceId?: string;
}

/** Nombres de campo del backend -> nombres del contrato de servicio. */
const FIELDS: Record<string, string> = { correo: 'email', clave: 'password' };

/** Adaptador: implementa el contrato de servicio contra el backend (POST /auth/login). */
export function createAuthServiceHttp({ baseUrl }: { baseUrl: string }): InterAuthService {
  return {
    async login(email, password) {
      let response: Response;
      try {
        response = await fetch(`${baseUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo: email, clave: password }),
        });
      } catch {
        throw new ApiError(0, { code: 'NETWORK_ERROR', message: 'No se pudo conectar con el servidor.', details: [], traceId: '' });
      }
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw toApiError(response.status, body);
      return { token: body.accessToken, user: body.user };
    },
  };
}

function toApiError(status: number, { error = {}, traceId = '' }: ErrorBody): ApiError {
  return new ApiError(status, {
    code: error.code ?? 'HTTP_ERROR',
    message: error.message ?? `La petición falló con estado ${status}.`,
    details: (error.fields ?? []).map((f) => ({ field: FIELDS[f.name] ?? f.name, message: f.message })),
    traceId,
  });
}
