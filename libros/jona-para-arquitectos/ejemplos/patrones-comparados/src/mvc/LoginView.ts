import { Button, Label, TextField, type LoginScreen } from '../comun/pantalla.js';
import type { LoginController } from './LoginController.js';
import type { LoginModel, LoginState } from './LoginModel.js';

/** Vista: observa el modelo para pintarse y entrega cada evento al controlador. */
export class LoginView implements LoginScreen {
  readonly title = new Label();
  readonly email = new TextField();
  readonly password = new TextField();
  readonly submit = new Button();
  readonly message = new Label();

  constructor(model: LoginModel, controller: LoginController) {
    this.title.text = 'Iniciar sesión';
    this.submit.label = 'Ingresar';
    this.email.onChange((email) => controller.emailTyped(email));
    this.password.onChange((password) => controller.passwordTyped(password));
    this.submit.onClick(() => controller.submitClicked());
    model.subscribe(() => this.render(model.state));
    this.render(model.state);
  }

  private render({ email, password, message, busy }: Readonly<LoginState>): void {
    this.email.setValue(email);
    this.password.setValue(password);
    this.message.text = message;
    this.email.enabled = !busy;
    this.password.enabled = !busy;
    this.submit.enabled = !busy;
  }
}
