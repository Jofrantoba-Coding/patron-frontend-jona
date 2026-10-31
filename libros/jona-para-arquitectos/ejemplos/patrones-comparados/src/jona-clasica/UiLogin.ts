import { hasRequiredData, MISSING_DATA_ERROR } from '../comun/mensajes.js';
import { Button, Label, TextField, type LoginScreen } from '../comun/pantalla.js';
import type { InterUiLogin } from './InterUiLogin.js';

/** Plantilla: construye los controles, los conecta con el contrato y da un comportamiento por defecto. */
export class UiLogin implements InterUiLogin, LoginScreen {
  readonly title = new Label();
  readonly email = new TextField();
  readonly password = new TextField();
  readonly submit = new Button();
  readonly message = new Label();

  constructor() {
    this.title.text = 'Iniciar sesión';
    this.submit.label = 'Ingresar';
    this.submit.onClick(() => this.login(this.email.value, this.password.value));
  }

  // Comportamiento por defecto: valida y no llama a ningún sistema.
  login(email: string, password: string): void {
    if (!this.isValidData(email, password)) {
      this.showMissingDataError();
      return;
    }
    this.showMessage('Datos completos (sin integración).');
  }

  isValidData(email: string, password: string): boolean {
    return hasRequiredData(email, password);
  }

  // Operaciones de presentación que la Implementación invoca.
  protected showMessage(message: string): void {
    this.message.text = message;
  }

  protected showMissingDataError(): void {
    this.showMessage(MISSING_DATA_ERROR);
  }

  protected setBusy(busy: boolean): void {
    this.email.enabled = !busy;
    this.password.enabled = !busy;
    this.submit.enabled = !busy;
  }
}
