import { ref } from 'vue';
import { ApiError } from '../services/ApiError';
import type { InterAuthService, LoginResult } from '../services/InterAuthService';

export const MISSING_DATA_ERROR = 'Ingrese su correo y su contraseña.';

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos.',
  USER_DISABLED: 'Su usuario está bloqueado. Contacte al administrador.',
};

/** Regla pura: se prueba sin Vue y sin servicios. */
export function isValidData(email: string, password: string): boolean {
  return email !== '' && password !== '';
}

/** Traduce el error del servicio a un mensaje; la vista nunca ve un ApiError. */
export function loginErrorMessage(error: unknown): string {
  return (error instanceof ApiError && ERROR_MESSAGES[error.code]) || 'No se pudo iniciar sesión. Intente de nuevo.';
}

/** Implementación: un composable que devuelve el modelo de vista de InterUiLogin (con referencias). */
export function useUiLoginImpl(
  service: InterAuthService,
  onAuthenticated: (result: LoginResult) => void,
) {
  const email = ref('');
  const password = ref('');
  const error = ref<string | undefined>();
  const isSubmitting = ref(false);

  async function onSubmit(): Promise<void> {
    if (isSubmitting.value) return;               // evita el doble envío
    if (!isValidData(email.value, password.value)) {
      error.value = MISSING_DATA_ERROR;
      return;
    }
    error.value = undefined;                      // limpia el error del intento anterior
    isSubmitting.value = true;
    let result: LoginResult | undefined;
    try {
      result = await service.login(email.value, password.value);
    } catch (e) {
      error.value = loginErrorMessage(e);
    } finally {
      isSubmitting.value = false;
    }
    if (result !== undefined) onAuthenticated(result);
  }

  return {
    email, password, error, isSubmitting,
    onEmailChange: (value: string) => { email.value = value; },
    onPasswordChange: (value: string) => { password.value = value; },
    onSubmit,
  };
}
