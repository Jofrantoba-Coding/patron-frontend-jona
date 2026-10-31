import { ApiError, type ApiErrorBody } from './ApiError';
import type { InterAuthService } from './InterAuthService';
import { isLoginResult } from './isLoginResult';

export interface AuthServiceHttpOptions {
  /** La única diferencia entre el servidor mock y el backend real. */
  baseUrl: string;
  /** Cabeceras adicionales en cada petición (por ejemplo, X-Mock-Scenario en pruebas). */
  headers?: Record<string, string>;
}

/** Adaptador: implementa el contrato de servicio contra el contrato de API (POST /auth/login). */
export function createAuthServiceHttp({ baseUrl, headers = {} }: AuthServiceHttpOptions): InterAuthService {
  return {
    async login(email, password) {
      const correlationId = crypto.randomUUID();
      let response: Response;
      try {
        response = await fetch(`${baseUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Correlation-Id': correlationId, ...headers },
          // El contrato de API nombra los campos usuario y clave; el adaptador traduce.
          body: JSON.stringify({ usuario: email, clave: password }),
        });
      } catch {
        throw new ApiError(0, {
          code: 'NETWORK_ERROR', message: 'No se pudo conectar con el servidor.', details: [], traceId: correlationId,
        });
      }
      const body: unknown = await response.json().catch(() => undefined);
      if (!response.ok) throw toApiError(response.status, body, correlationId);
      // Un 2xx con un cuerpo que no cumple el contrato de API también es un ApiError, nunca un undefined.
      if (!isLoginResult(body)) {
        throw new ApiError(response.status, {
          code: 'INVALID_RESPONSE', message: 'La respuesta del servidor no es válida.', details: [], traceId: correlationId,
        });
      }
      return body;
    },
  };
}

function toApiError(status: number, body: unknown, fallbackTraceId: string): ApiError {
  const b = (body ?? {}) as Partial<ApiErrorBody>;
  if (typeof b.code === 'string' && typeof b.message === 'string') {
    return new ApiError(status, {
      code: b.code,
      message: b.message,
      details: Array.isArray(b.details) ? b.details : [],
      traceId: typeof b.traceId === 'string' ? b.traceId : fallbackTraceId,
    });
  }
  return new ApiError(status, {
    code: 'HTTP_ERROR', message: `La petición falló con estado ${status}.`, details: [], traceId: fallbackTraceId,
  });
}
