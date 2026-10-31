import type { InterUiLogin } from './InterUiLogin';

/** Plantilla: construye el DOM, conecta los eventos con el contrato y da un comportamiento por defecto. */
export class UiLogin implements InterUiLogin {
  readonly element = document.createElement('form');
  private readonly txtEmail = document.createElement('input');
  private readonly txtPassword = document.createElement('input');
  private readonly lblMessage = document.createElement('p');
  private readonly btnLogin = document.createElement('button');
  private readonly btnCreateAccount = document.createElement('button');
  private readonly btnRecoverPassword = document.createElement('button');

  constructor() {
    this.buildLayout();
    this.element.addEventListener('submit', (event) => {
      event.preventDefault();
      this.login(this.txtEmail.value, this.txtPassword.value);   // enlace tardío: puede ser el login de la Impl
    });
    this.btnCreateAccount.addEventListener('click', () => this.goToCreateAccount());
    this.btnRecoverPassword.addEventListener('click', () => this.goToRecoverPassword());
  }

  // Comportamiento por defecto: valida y no llama a ningún sistema.
  login(email: string, password: string): void {
    if (!this.isValidData(email, password)) { this.showMissingDataError(); return; }
    this.showMessage('Datos completos (sin integración).');
  }
  goToCreateAccount(): void { this.showMessage('Crear cuenta (sin integración).'); }
  goToRecoverPassword(): void { this.showMessage('Recuperar contraseña (sin integración).'); }
  isValidData(email: string, password: string): boolean {
    return email !== '' && password !== '';
  }

  // Operaciones de presentación que la Implementación invoca.
  protected showMessage(message: string): void { this.lblMessage.textContent = message; }
  protected showMissingDataError(): void { this.showMessage('Ingrese su correo y su contraseña.'); }
  protected setBusy(busy: boolean): void {
    this.txtEmail.disabled = busy;
    this.txtPassword.disabled = busy;
    this.btnLogin.disabled = busy;
  }

  private buildLayout(): void {
    const title = document.createElement('h1');
    title.textContent = 'Iniciar sesión';
    this.element.setAttribute('aria-label', 'Iniciar sesión');
    this.txtEmail.type = 'email';
    this.txtEmail.setAttribute('aria-label', 'Correo');
    this.txtPassword.type = 'password';
    this.txtPassword.setAttribute('aria-label', 'Contraseña');
    this.lblMessage.setAttribute('role', 'status');
    this.btnLogin.type = 'submit';
    this.btnLogin.textContent = 'Ingresar';
    this.btnCreateAccount.type = 'button';
    this.btnCreateAccount.textContent = 'Crear cuenta';
    this.btnRecoverPassword.type = 'button';
    this.btnRecoverPassword.textContent = 'Recuperar contraseña';
    this.element.append(title, this.txtEmail, this.txtPassword, this.lblMessage,
      this.btnLogin, this.btnCreateAccount, this.btnRecoverPassword);
  }
}
