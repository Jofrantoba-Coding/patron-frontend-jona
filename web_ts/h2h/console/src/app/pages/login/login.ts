import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
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
import { ApiService } from '../../core/api.service';
import { SessionService } from '../../core/session.service';

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
            <j-card-title>Iniciar sesión</j-card-title>
            <j-card-description>Autenticación por realm del tenant (Keycloak)</j-card-description>
          </j-card-header>
          <j-card-content>
            @if (error()) {
              <j-alert variant="danger" title="No se pudo iniciar sesión" className="mb-4">{{ error() }}</j-alert>
            }
            <form class="space-y-4" (submit)="onSubmit($event)" novalidate>
              <j-form-field
                id="usuario"
                label="Usuario"
                [value]="username()"
                (valueChange)="username.set($event)"
                placeholder="m.torres"
                [required]="true"
              />
              <j-form-field
                id="password"
                label="Contraseña"
                type="password"
                [value]="password()"
                (valueChange)="password.set($event)"
                placeholder="••••••••"
                [required]="true"
              />
              <div class="flex flex-col gap-1.5">
                <span class="text-sm font-medium text-neutral-700">Realm</span>
                <div class="flex h-9 items-center rounded-md border border-neutral-200 bg-neutral-100 px-3 font-mono text-sm text-neutral-500">
                  {{ realm }}
                </div>
              </div>
              <j-button type="submit" [fullWidth]="true" [loading]="loading()">Ingresar</j-button>
            </form>
          </j-card-content>
        </j-card>

        <p class="mt-4 text-center text-xs text-neutral-400">
          Ambiente <span class="font-mono font-semibold text-neutral-600">develtrex.jofrantoba.pe</span> · demo Develtrex
        </p>
      </div>
    </div>
  `,
})
export class LoginPage {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  protected readonly username = signal('m.torres');
  protected readonly password = signal('Demo.2026!');
  protected readonly realm = 'develtrex';
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.username() || !this.password()) {
      this.error.set('Usuario y contraseña son requeridos.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.api.login(this.username(), this.password()).subscribe({
      next: (res) => {
        this.session.setSession(res);
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        this.loading.set(false);
        this.error.set(e?.error?.message ?? 'Credenciales inválidas o servicio no disponible.');
      },
    });
  }
}
