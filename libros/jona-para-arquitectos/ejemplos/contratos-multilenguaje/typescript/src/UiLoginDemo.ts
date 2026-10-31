import type { InterUiLogin } from './InterUiLogin.js';

/** Implementación mínima: registra lo que la pantalla hizo, sin interfaz gráfica ni servicios. */
export class UiLoginDemo implements InterUiLogin {
  readonly events: string[] = [];

  login = (email: string, password: string): void => {
    this.events.push(this.isValidData(email, password) ? `login:${email}` : 'error:datos-incompletos');
  };

  goToCreateAccount = (): void => {
    this.events.push('crear-cuenta');
  };

  goToRecoverPassword = (): void => {
    this.events.push('recuperar-contrasena');
  };

  isValidData = (email: string, password: string): boolean => email !== '' && password !== '';
}
