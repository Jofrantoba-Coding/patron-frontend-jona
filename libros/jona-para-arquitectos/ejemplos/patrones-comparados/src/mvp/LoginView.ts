import { Button, Label, TextField, type LoginScreen } from '../comun/pantalla.js';
import type { InterLoginView } from './InterLoginView.js';
import type { LoginPresenter } from './LoginPresenter.js';

/** Vista pasiva: cumple el contrato con controles y reenvía el clic al presentador. No decide nada. */
export class LoginView implements InterLoginView, LoginScreen {
  readonly title = new Label();
  readonly email = new TextField();
  readonly password = new TextField();
  readonly submit = new Button();
  readonly message = new Label();

  constructor() {
    this.title.text = 'Iniciar sesión';
    this.submit.label = 'Ingresar';
  }

  attach(presenter: LoginPresenter): void {
    this.submit.onClick(() => { void presenter.login(); });
  }

  getEmail(): string {
    return this.email.value;
  }

  getPassword(): string {
    return this.password.value;
  }

  showMessage(message: string): void {
    this.message.text = message;
  }

  setBusy(busy: boolean): void {
    this.email.enabled = !busy;
    this.password.enabled = !busy;
    this.submit.enabled = !busy;
  }
}
