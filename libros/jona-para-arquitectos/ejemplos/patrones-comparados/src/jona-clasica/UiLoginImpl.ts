import type { InterAuthService, LoginResult } from '../comun/InterAuthService.js';
import { loginErrorMessage } from '../comun/mensajes.js';
import { UiLogin } from './UiLogin.js';

export interface UiLoginImplDeps {
  service: InterAuthService;
  onAuthenticated: (result: LoginResult) => void;
}

/** Implementación y entrada: hereda la Plantilla y reemplaza la capacidad que necesita integración. */
export class UiLoginImpl extends UiLogin {
  constructor(private readonly deps: UiLoginImplDeps) {
    super();
  }

  override login(email: string, password: string): void {
    if (!this.isValidData(email, password)) {
      this.showMissingDataError();   // reutiliza la operación de la Plantilla
      return;
    }
    this.setBusy(true);              // el botón deshabilitado impide el doble envío
    this.showMessage('');            // limpia el error del intento anterior
    this.deps.service.login(email, password).then(
      (result) => {
        this.setBusy(false);
        this.deps.onAuthenticated(result);
      },
      (error: unknown) => {
        this.setBusy(false);
        this.showMessage(loginErrorMessage(error));
      },
    );
  }
}
