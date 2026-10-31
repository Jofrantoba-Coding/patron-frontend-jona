import { useRef } from 'react';
import { ApiError } from '../services/ApiError';
import type { InterAuthService, LoginResult } from '../services/InterAuthService';
import type { InterUiLogin } from './InterUiLogin';
import { isValidData, MISSING_DATA_ERROR, useUiLoginBase } from './UiLoginBase';

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos.',
  USER_DISABLED: 'Su usuario está bloqueado. Contacte al administrador.',
};

/** Traduce el error del servicio a un mensaje; es integración, por eso vive aquí y no en el modelo base. */
function loginErrorMessage(error: unknown): string {
  return (error instanceof ApiError && ERROR_MESSAGES[error.code]) || 'No se pudo iniciar sesión. Intente de nuevo.';
}

/** Implementación: compone el modelo base y reemplaza onSubmit. */
export function useUiLoginImpl(
  service: InterAuthService,
  onAuthenticated: (result: LoginResult) => void,
): InterUiLogin {
  const base = useUiLoginBase();
  const inFlight = useRef(false);

  // Reemplazo completo: no delega en base.onSubmit (ver "Costo" en el capítulo 2).
  async function submit(): Promise<void> {
    if (inFlight.current) return;
    if (!isValidData(base.email, base.password)) { base.setError(MISSING_DATA_ERROR); return; }
    inFlight.current = true;
    base.setError(undefined);
    base.setIsSubmitting(true);
    let result: LoginResult | undefined;
    try {
      result = await service.login(base.email, base.password);
    } catch (e) {
      base.setError(loginErrorMessage(e));
    } finally {
      inFlight.current = false;
      base.setIsSubmitting(false);
    }
    if (result !== undefined) onAuthenticated(result);
  }

  const { setError, setIsSubmitting, ...viewModel } = base;
  return { ...viewModel, onSubmit: () => { void submit(); } };
}
