import type { LoginModel } from './LoginModel.js';

/** Controlador: traduce lo que hace la persona en operaciones del modelo. No toca controles ni decide mensajes. */
export class LoginController {
  constructor(private readonly model: LoginModel) {}

  emailTyped(email: string): void {
    this.model.setEmail(email);
  }

  passwordTyped(password: string): void {
    this.model.setPassword(password);
  }

  submitClicked(): void {
    void this.model.login();
  }
}
