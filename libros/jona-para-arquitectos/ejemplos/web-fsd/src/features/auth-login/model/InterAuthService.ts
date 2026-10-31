import type { LoginResult } from '../../../entities/session';

/**
 * Contrato de servicio (puerto). Toda falla rechaza con `ApiError`.
 * Vive en el model/ de la funcionalidad porque solo ella lo usa; si lo usaran varias, bajaría a entities/session.
 */
export interface InterAuthService {
  /** Devuelve el token y el usuario. Rechaza si el servidor responde con error. */
  login: (email: string, password: string) => Promise<LoginResult>;
}
