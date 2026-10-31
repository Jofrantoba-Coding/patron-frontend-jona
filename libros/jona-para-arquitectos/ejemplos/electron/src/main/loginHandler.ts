import { randomUUID } from 'node:crypto';
import type { IpcResult } from '../shared/ipcContract';
import { ApiError } from '../shared/services/ApiError';
import type { InterAuthService, LoginResult } from '../shared/services/InterAuthService';

/**
 * Manejador del canal auth:login en el proceso principal, el "backend" del renderizador.
 * Nunca lanza: un error lanzado en ipcMain.handle llega al renderizador como un Error genérico,
 * sin code ni traceId. Por eso el error viaja serializado con el formato del contrato de API.
 */
export function createLoginHandler(service: InterAuthService) {
  return async (email: string, password: string): Promise<IpcResult<LoginResult>> => {
    try {
      return { ok: true, value: await service.login(email, password) };
    } catch (error) {
      if (error instanceof ApiError) {
        const { status, code, message, details, traceId } = error;
        return { ok: false, status, error: { code, message, details, traceId } };
      }
      return {
        ok: false,
        status: 500,
        error: { code: 'INTERNAL_ERROR', message: 'Error inesperado en el proceso principal.', details: [], traceId: randomUUID() },
      };
    }
  };
}
