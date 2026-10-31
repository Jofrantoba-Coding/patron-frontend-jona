import type { LoginResult } from '../services/InterAuthService';

/** Navegación: un efecto externo que solo usa la Implementación (N3). */
export interface Navigator {
  openHome: (session: LoginResult) => void;
  openCreateAccount: () => void;
  openRecoverPassword: () => void;
}
