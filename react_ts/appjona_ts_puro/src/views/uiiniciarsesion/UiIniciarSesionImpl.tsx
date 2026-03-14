// UiIniciarSesionImpl.tsx
// Implementation class — extends the template and overrides business logic methods
import { UiIniciarSesion } from './UiIniciarSesion';

export class UiIniciarSesionImpl extends UiIniciarSesion {
  constructor() {
    super();
  }

  // Override login
  login(email: string, password: string): void {
    window.alert('Implementation — login clicked');
    console.log(`Implementation — email: ${email}, password: ${password}`);
    // Add specific login logic here, e.g. send a request to the server
  }

  // Override goToCreateAccount
  goToCreateAccount(): void {
    window.alert('Implementation — go to create account');
    console.log('Implementation — navigating to create account');
  }

  // Override goToRecoverPassword
  goToRecoverPassword(): void {
    window.alert('Implementation — go to recover password');
    console.log('Implementation — navigating to recover password');
  }

  isValidData(email: string, password: string): boolean {
    console.log('email:', email);
    console.log('password:', password);
    return true;
  }
}
