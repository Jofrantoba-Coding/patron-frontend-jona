import type { InterAuthService, LoginResult } from '../comun/InterAuthService.js';
import { hasRequiredData, loginErrorMessage, MISSING_DATA_ERROR } from '../comun/mensajes.js';
import type { InterLoginView } from './InterLoginView.js';

export interface LoginPresenterDeps {
  service: InterAuthService;
  onAuthenticated: (result: LoginResult) => void;
}

/** Presentador: toda la lógica. Lee de la vista, llama al servicio y le dice a la vista qué mostrar. */
export class LoginPresenter {
  private busy = false;

  constructor(private readonly view: InterLoginView, private readonly deps: LoginPresenterDeps) {}

  async login(): Promise<void> {
    if (this.busy) return;                              // evita el doble envío
    const email = this.view.getEmail();
    const password = this.view.getPassword();
    if (!hasRequiredData(email, password)) {
      this.view.showMessage(MISSING_DATA_ERROR);
      return;
    }
    this.busy = true;
    this.view.setBusy(true);
    this.view.showMessage('');                          // limpia el error del intento anterior
    let result: LoginResult | undefined;
    try {
      result = await this.deps.service.login(email, password);
    } catch (error) {
      this.view.showMessage(loginErrorMessage(error));
    } finally {
      this.busy = false;
      this.view.setBusy(false);
    }
    if (result !== undefined) this.deps.onAuthenticated(result);
  }
}
