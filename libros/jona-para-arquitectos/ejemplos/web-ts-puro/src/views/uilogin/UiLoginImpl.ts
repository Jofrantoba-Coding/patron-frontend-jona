import type { Navigator } from '../../navigation/Navigator';
import { ApiError } from '../../services/ApiError';
import type { InterAuthService, LoginResult } from '../../services/InterAuthService';
import { UiLogin } from './UiLogin';

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos.',
  USER_DISABLED: 'Su usuario está bloqueado. Contacte al administrador.',
};

/** Traduce el error del servicio a un mensaje para el usuario. Regla pura. */
export function loginErrorMessage(error: unknown): string {
  return (error instanceof ApiError && ERROR_MESSAGES[error.code]) || 'No se pudo iniciar sesión. Intente de nuevo.';
}

/** Implementación y entrada: reemplaza las capacidades que necesitan integración. */
export class UiLoginImpl extends UiLogin {
  private busy = false;

  constructor(
    private readonly auth: InterAuthService,
    private readonly navigator: Navigator,
  ) {
    super();
  }

  override login(email: string, password: string): void {
    if (!this.isValidData(email, password)) { this.showMissingDataError(); return; }
    if (this.busy) return;                        // evita el doble envío
    void this.submit(email, password);
  }

  override goToCreateAccount(): void { this.navigator.openCreateAccount(); }
  override goToRecoverPassword(): void { this.navigator.openRecoverPassword(); }

  private async submit(email: string, password: string): Promise<void> {
    this.busy = true;
    this.setBusy(true);
    this.showMessage('');                         // limpia el error del intento anterior
    let session: LoginResult | undefined;
    try {
      session = await this.auth.login(email, password);
    } catch (error) {
      this.showMessage(loginErrorMessage(error));
    } finally {
      this.busy = false;
      this.setBusy(false);
    }
    if (session !== undefined) this.navigator.openHome(session);
  }
}
