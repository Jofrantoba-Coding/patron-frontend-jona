import type { ApiErrorBody } from './services/ApiError';
import type { LoginResult } from './services/InterAuthService';

/** Contrato de IPC: el canal, sus argumentos y su formato de respuesta. Es un contrato de API más. */
export const AUTH_LOGIN = 'auth:login';

/** El error viaja serializado con el formato del contrato de API; nunca como una excepción. */
export type IpcResult<T> =
  | { ok: true; value: T }
  | { ok: false; status: number; error: ApiErrorBody };

/** Lo que el preload expone en window.authIpc: solo datos planos, que sí cruzan contextBridge. */
export interface AuthIpcBridge {
  login: (email: string, password: string) => Promise<IpcResult<LoginResult>>;
}
