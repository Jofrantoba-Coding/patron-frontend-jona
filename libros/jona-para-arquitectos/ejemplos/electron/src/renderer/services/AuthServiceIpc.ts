import type { AuthIpcBridge } from '../../shared/ipcContract';
import { ApiError } from '../../shared/services/ApiError';
import type { InterAuthService } from '../../shared/services/InterAuthService';
import { isLoginResult } from '../../shared/services/isLoginResult';

/**
 * Adaptador del contrato de servicio sobre IPC. Corre en el renderizador, no en el preload:
 * un ApiError creado en el preload pierde su clase y sus campos al cruzar contextBridge.
 */
export function createAuthServiceIpc(bridge: AuthIpcBridge): InterAuthService {
  return {
    async login(email, password) {
      let result;
      try {
        result = await bridge.login(email, password);
      } catch {
        throw new ApiError(0, {
          code: 'IPC_ERROR', message: 'No se pudo comunicar con el proceso principal.', details: [], traceId: crypto.randomUUID(),
        });
      }
      // El mensaje cruza un límite de proceso: se valida antes de entregarlo como tipo de dominio.
      if (typeof result !== 'object' || result === null) throw invalidResponse();
      if (result.ok) {
        if (!isLoginResult(result.value)) throw invalidResponse();
        return result.value;
      }
      const { error } = result;
      if (typeof error?.code !== 'string' || typeof error.message !== 'string') throw invalidResponse();
      // Reconstruye el ApiError con code, message, details y traceId.
      throw new ApiError(result.status, {
        code: error.code,
        message: error.message,
        details: Array.isArray(error.details) ? error.details : [],
        traceId: typeof error.traceId === 'string' ? error.traceId : crypto.randomUUID(),
      });
    },
  };
}

function invalidResponse(): ApiError {
  return new ApiError(0, {
    code: 'INVALID_RESPONSE', message: 'La respuesta del proceso principal no es válida.', details: [], traceId: crypto.randomUUID(),
  });
}
