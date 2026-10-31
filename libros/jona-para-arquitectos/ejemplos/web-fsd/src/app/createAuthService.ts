import { createAuthServiceFake, createAuthServiceHttp, type InterAuthService } from '../features/auth-login';

export interface AuthServiceEnv {
  /** URL del backend; por defecto, el servidor mock de ../mock-server. */
  VITE_API_URL?: string;
  /** `fake` usa el servicio en memoria, sin red. */
  VITE_AUTH_SERVICE?: string;
}

/** Raíz de composición: el único lugar de la aplicación que elige un adaptador del puerto. */
export function createAuthService(env: AuthServiceEnv): InterAuthService {
  if (env.VITE_AUTH_SERVICE === 'fake') return createAuthServiceFake();
  return createAuthServiceHttp({ baseUrl: env.VITE_API_URL ?? 'http://127.0.0.1:4010' });
}
