import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { InterUiLogin } from './inter-ui-login';

/** Plantilla: implementa el contrato de UI y da un comportamiento por defecto, sin integración. */
@Component({
  selector: 'app-ui-login',
  imports: [FormsModule],
  templateUrl: './ui-login.component.html',
})
export class UiLoginComponent implements InterUiLogin {
  // Signals: Angular 21 no usa zone.js; la vista se actualiza cuando cambian.
  readonly email = signal('');
  readonly password = signal('');
  readonly message = signal('');
  readonly busy = signal(false);

  login(email: string, password: string): void {
    this.message.set(this.isValidData(email, password)
      ? 'Datos completos (sin integración).'
      : 'Ingrese su correo y su contraseña.');
  }
  goToCreateAccount(): void { this.message.set('Crear cuenta (sin integración).'); }
  goToRecoverPassword(): void { this.message.set('Recuperar contraseña (sin integración).'); }
  isValidData(email: string, password: string): boolean {
    return email !== '' && password !== '';
  }
}
