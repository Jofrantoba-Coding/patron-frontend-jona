import { useRef, useState } from 'react';
import { ApiError } from '../../shared/services/ApiError';
import type { InterAuthService, LoginResult } from '../../shared/services/InterAuthService';
import type { InterUiLogin } from './InterUiLogin';

export const MISSING_DATA_ERROR = 'Ingrese su correo y su contraseña.';

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos.',
  USER_DISABLED: 'Su usuario está bloqueado. Contacte al administrador.',
};

/** Regla pura: se prueba sin React y sin servicios. */
export function isValidData(email: string, password: string): boolean {
  return email !== '' && password !== '';
}

/** Traduce el error del servicio a un mensaje; la vista nunca ve un ApiError. */
export function loginErrorMessage(error: unknown): string {
  return (error instanceof ApiError && ERROR_MESSAGES[error.code]) || 'No se pudo iniciar sesión. Intente de nuevo.';
}

export function useUiLoginImpl(
  service: InterAuthService,
  onAuthenticated: (result: LoginResult) => void,
): InterUiLogin {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inFlight = useRef(false);

  async function submit(): Promise<void> {
    if (inFlight.current) return;               // evita el doble envío
    if (!isValidData(email, password)) {
      setError(MISSING_DATA_ERROR);
      return;
    }
    inFlight.current = true;
    setError(undefined);                        // limpia el error del intento anterior
    setIsSubmitting(true);
    let result: LoginResult | undefined;
    try {
      result = await service.login(email, password);
    } catch (e) {
      setError(loginErrorMessage(e));
    } finally {
      inFlight.current = false;
      setIsSubmitting(false);
    }
    // Fuera del try: un error de onAuthenticated no se informa como fallo de inicio de sesión.
    if (result !== undefined) onAuthenticated(result);
  }

  return {
    email, password, error, isSubmitting,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onSubmit: () => { void submit(); },
  };
}
