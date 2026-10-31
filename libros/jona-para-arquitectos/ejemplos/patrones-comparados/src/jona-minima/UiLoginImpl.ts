import type { InterAuthService, LoginResult } from '../comun/InterAuthService.js';
import { hasRequiredData, loginErrorMessage, MISSING_DATA_ERROR } from '../comun/mensajes.js';
import type { InterUiLogin } from './InterUiLogin.js';

export interface UiLoginImplDeps {
  service: InterAuthService;
  onAuthenticated: (result: LoginResult) => void;
}

type State = Pick<InterUiLogin, 'email' | 'password' | 'error' | 'isSubmitting'>;

/** Implementación: guarda el estado y entrega un modelo de vista nuevo en cada cambio. Único archivo que usa el servicio. */
export function createUiLoginImpl(deps: UiLoginImplDeps, onModel: (model: InterUiLogin) => void): void {
  let state: State = { email: '', password: '', error: undefined, isSubmitting: false };

  function update(changes: Partial<State>): void {
    state = { ...state, ...changes };
    onModel({
      ...state,
      onEmailChange: (email) => update({ email }),
      onPasswordChange: (password) => update({ password }),
      onSubmit: () => { void submit(); },
    });
  }

  async function submit(): Promise<void> {
    const { email, password, isSubmitting } = state;
    if (isSubmitting) return;                           // evita el doble envío
    if (!hasRequiredData(email, password)) {
      update({ error: MISSING_DATA_ERROR });
      return;
    }
    update({ error: undefined, isSubmitting: true });   // limpia el error del intento anterior
    let result: LoginResult | undefined;
    let error: string | undefined;
    try {
      result = await deps.service.login(email, password);
    } catch (e) {
      error = loginErrorMessage(e);
    }
    update({ error, isSubmitting: false });
    if (result !== undefined) deps.onAuthenticated(result);
  }

  update({});
}
