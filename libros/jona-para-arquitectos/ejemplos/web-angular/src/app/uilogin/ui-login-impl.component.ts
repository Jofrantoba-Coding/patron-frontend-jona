import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiError } from '../services/ApiError';
import { AUTH_SERVICE } from '../services/auth.token';
import { UiLoginComponent } from './ui-login.component';

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos.',
  USER_DISABLED: 'Su usuario está bloqueado. Contacte al administrador.',
};

/** Traduce el error del servicio a un mensaje para el usuario. Regla pura. */
export function loginErrorMessage(error: unknown): string {
  return (error instanceof ApiError && ERROR_MESSAGES[error.code]) || 'No se pudo iniciar sesión. Intente de nuevo.';
}

/** Implementación y entrada: extiende la Plantilla y reutiliza su plantilla HTML. */
@Component({
  selector: 'app-ui-login-impl',
  imports: [FormsModule],
  templateUrl: './ui-login.component.html',   // la misma plantilla HTML
})
export class UiLoginImplComponent extends UiLoginComponent {
  private readonly auth = inject(AUTH_SERVICE);
  private readonly router = inject(Router);

  override async login(email: string, password: string): Promise<void> {
    if (!this.isValidData(email, password)) return super.login(email, password);
    if (this.busy()) return;                     // evita el doble envío
    this.busy.set(true);
    this.message.set('');                        // limpia el error del intento anterior
    try {
      await this.auth.login(email, password);
    } catch (error) {
      this.message.set(loginErrorMessage(error));
      return;
    } finally {
      this.busy.set(false);
    }
    await this.router.navigate(['/inicio']);
  }
  override goToCreateAccount(): void { void this.router.navigate(['/crear-cuenta']); }
  override goToRecoverPassword(): void { void this.router.navigate(['/recuperar-clave']); }
}
