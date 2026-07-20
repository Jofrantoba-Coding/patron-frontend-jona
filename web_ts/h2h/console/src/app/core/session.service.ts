import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { AppUser, Tenant, TenantContext } from './models';

/**
 * Permisos por defecto mientras el backend no exponga el RBAC efectivo por
 * usuario. Mantiene el sidebar visible tras el login.
 * TODO(RBAC): traer permisos reales (claim en el token / endpoint /me/context).
 */
const DEFAULT_PERMISSIONS = [
  'operaciones.pagos_masivos:read',
  'operaciones.transferencias:read',
  'operaciones.factoring:read',
  'documentos:read',
  'planillas:read',
  'respuestas:read',
  'organizacion:read',
  'beneficiarios:read',
  'certificados:read',
  'catalogos:read',
  'auditoria:read',
  'rbac:read',
];

/** Respuesta de GET {gateway}/session (ver gateway SessionController). */
interface GatewaySession {
  email?: string | null;
  idOrganizacion?: string | null;
  realmId?: string | null;
  clientId?: string | null;
  idSistema?: string | null;
  idCliente?: string | null;
  sub?: string | null;
}

/**
 * Estado de sesión en modo BFF: no hay token en el navegador. La sesión vive en
 * el gateway (cookie); aquí solo cacheamos el contexto leído de GET /session.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly http = inject(HttpClient);

  readonly context = signal<TenantContext | null>(null);

  readonly isAuthenticated = computed(() => !!this.context());
  readonly tenant = computed(() => this.context()?.tenant ?? null);
  readonly user = computed(() => this.context()?.user ?? null);
  readonly permissions = computed(() => this.context()?.user.permissions ?? []);

  /**
   * Consulta la sesión del gateway (cookie, withCredentials via interceptor).
   * Devuelve true si hay sesión válida. Cachea el contexto en memoria.
   */
  async loadSession(): Promise<boolean> {
    if (this.context()) return true;
    try {
      const session = await firstValueFrom(
        this.http.get<GatewaySession>(`${environment.gatewayBaseUrl}/session`)
      );
      this.context.set(this.toContext(session));
      return true;
    } catch {
      this.context.set(null);
      return false;
    }
  }

  clear(): void {
    this.context.set(null);
  }

  /** ¿El usuario tiene el permiso efectivo? (RBAC). */
  can(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  private toContext(session: GatewaySession): TenantContext {
    const email = session.email ?? '';
    // org_u_id (UUID) desde el claim idOrganizacion del token (protocol mapper en Keycloak),
    // expuesto por el gateway en /session.
    const orgId = session.idOrganizacion ?? session.idCliente ?? session.realmId ?? '';

    const user: AppUser = {
      id: session.sub ?? '',
      username: email,
      name: email || 'Usuario',
      email,
      roles: [],
      permissions: DEFAULT_PERMISSIONS,
    };

    const tenant: Tenant = {
      org_u_id: orgId,
      org_v_codigo: session.realmId ?? '',
      org_v_abreviatura: '',
      org_v_razonsocial: '',
      org_v_nombrecomercial: session.realmId ?? '',
      org_v_ambiente: '',
      subdominio: '',
      keycloak: {
        org_b_usa_keycloak: true,
        org_v_keycloak_realm: session.realmId ?? '',
        org_v_keycloak_client: session.clientId ?? '',
        org_v_claim_orgid: '',
      },
    };

    return { tenant, user };
  }
}
