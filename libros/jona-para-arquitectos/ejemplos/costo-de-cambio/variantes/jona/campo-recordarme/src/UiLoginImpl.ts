import { ApiError } from './ApiError.js';
import type { InterAuthService, LoginResult } from './InterAuthService.js';
import type { InterUiLogin } from './InterUiLogin.js';

export interface UiLoginImplDeps {
  service: InterAuthService;
  onAuthenticated: (result: LoginResult) => void;
}

type State = Pick<InterUiLogin, 'email' | 'password' | 'remember' | 'emailError' | 'passwordError' | 'error' | 'isSubmitting'>;

const MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos.',
  USER_DISABLED: 'Su usuario está bloqueado. Contacte al administrador.',
  VALIDATION_ERROR: 'Revise los datos marcados.',
  NETWORK_ERROR: 'No se pudo conectar con el servidor. Revise su conexión.',
};
const GENERIC_ERROR = 'No se pudo iniciar sesión. Intente de nuevo.';

/** Traduce el error del servicio a mensajes; la vista nunca ve un ApiError. */
function errorsOf(e: unknown): Partial<State> {
  if (!(e instanceof ApiError)) return { error: GENERIC_ERROR };
  const detail = (field: string) => e.details.find((d) => d.field === field)?.message;
  return { error: MESSAGES[e.code] ?? GENERIC_ERROR, emailError: detail('email'), passwordError: detail('password') };
}

/** Implementación: guarda el estado y entrega un modelo de vista nuevo en cada cambio. Único archivo que usa el servicio. */
export function createUiLoginImpl(deps: UiLoginImplDeps, onModel: (model: InterUiLogin) => void): void {
  let state: State = { email: '', password: '', remember: false, isSubmitting: false };

  function update(changes: Partial<State>): void {
    state = { ...state, ...changes };
    onModel({
      ...state,
      onEmailChange: (email) => update({ email }),
      onPasswordChange: (password) => update({ password }),
      onRememberChange: (remember) => update({ remember }),
      onSubmit: () => { void submit(); },
    });
  }

  async function submit(): Promise<void> {
    if (state.isSubmitting) return;   // evita el doble envío
    update({ error: undefined, emailError: undefined, passwordError: undefined, isSubmitting: true });
    let result: LoginResult | undefined;
    let errors: Partial<State> = {};
    try {
      result = await deps.service.login(state.email, state.password, state.remember);
    } catch (e) {
      errors = errorsOf(e);
    }
    update({ ...errors, isSubmitting: false });
    if (result !== undefined) deps.onAuthenticated(result);
  }

  update({});
}
