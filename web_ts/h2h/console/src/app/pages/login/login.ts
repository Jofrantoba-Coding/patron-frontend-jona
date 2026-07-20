import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  JAlert,
  JButton,
  JCard,
  JCardContent,
  JCardDescription,
  JCardHeader,
  JCardTitle,
  JFormField,
} from 'uijona-4ngular';
import { environment } from '../../../environments/environment';

/**
 * Selección de organización (tenant). BFF: no autentica en el navegador; redirige
 * al gateway `/oauth2/authorization/{organizacion}`, que hace el flujo OAuth2
 * contra Keycloak, crea la sesión (cookie) y vuelve al console.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JCard, JCardHeader, JCardTitle, JCardDescription, JCardContent, JFormField, JButton, JAlert],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-10">
      <div class="w-full max-w-sm">
        <div class="mb-6 flex items-center justify-center gap-2">
          <span class="grid h-9 w-9 place-items-center rounded-lg bg-primary-600 text-sm font-black text-white">H2H</span>
          <div>
            <p class="text-sm font-bold leading-tight text-neutral-900">Consola H2H</p>
            <p class="text-[11px] leading-tight text-neutral-400">Jofrantoba Consulting TI</p>
          </div>
        </div>

        <j-card>
          <j-card-header>
            <j-card-title>Ingresar a la consola</j-card-title>
            <j-card-description>Indique su organización para continuar</j-card-description>
          </j-card-header>
          <j-card-content>
            @if (error()) {
              <j-alert variant="danger" title="No se pudo continuar" className="mb-4">{{ error() }}</j-alert>
            }
            <form class="space-y-4" (submit)="onSubmit($event)" novalidate>
              <j-form-field
                id="organizacion"
                label="Organización"
                [value]="organizationId()"
                (valueChange)="organizationId.set($event)"
                placeholder="almil"
                [required]="true"
              />
              <p class="text-[11px] leading-snug text-neutral-400">
                Corresponde al realm de su organización en
                <span class="font-mono">auth.jofrantoba.com</span>. Será redirigido a Keycloak.
              </p>
              <j-button type="submit" [fullWidth]="true" [loading]="loading()">Continuar</j-button>
            </form>
          </j-card-content>
        </j-card>
      </div>
    </div>
  `,
})
export class LoginPage {
  protected readonly organizationId = signal('');
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  protected onSubmit(event: Event): void {
    event.preventDefault();
    const org = this.organizationId().trim();
    if (!org) {
      this.error.set('Ingrese el identificador de su organización.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    // BFF: el gateway inicia el flujo OAuth2 para la organización (registrationId).
    window.location.href = `${environment.gatewayBaseUrl}/oauth2/authorization/${encodeURIComponent(org)}`;
  }
}
