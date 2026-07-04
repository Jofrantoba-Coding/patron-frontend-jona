import { Injectable, computed, signal } from '@angular/core';
import type { LoginResponse, TenantContext } from './models';

/** Estado de sesión: token en memoria + contexto de tenant y permisos efectivos. */
@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly token = signal<string | null>(null);
  readonly context = signal<TenantContext | null>(null);

  readonly isAuthenticated = computed(() => !!this.token());
  readonly tenant = computed(() => this.context()?.tenant ?? null);
  readonly user = computed(() => this.context()?.user ?? null);
  readonly permissions = computed(() => this.context()?.user.permissions ?? []);

  setSession(login: LoginResponse): void {
    this.token.set(login.accessToken);
    this.context.set({ tenant: login.tenant, user: login.user });
  }

  setContext(ctx: TenantContext): void {
    this.context.set(ctx);
  }

  clear(): void {
    this.token.set(null);
    this.context.set(null);
  }

  /** ¿El usuario tiene el permiso efectivo? (RBAC). */
  can(permission: string): boolean {
    return this.permissions().includes(permission);
  }
}
