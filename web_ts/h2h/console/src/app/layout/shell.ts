import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import {
  JBadge,
  JSidebarLayout,
  JUserAvatar,
  type SidebarNavGroup,
  type SidebarNavItem,
} from 'uijona-4ngular';
import { SessionService } from '../core/session.service';

/** Layout principal de la consola: sidebar navegable + contenido enrutado. */
@Component({
  selector: 'app-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, JSidebarLayout, JUserAvatar, JBadge],
  template: `
    <j-sidebar-layout [nav]="nav()" [activeKey]="activeKey()" [collapsible]="true" (navItemClick)="onNav($event)">
      <div jHeader class="flex min-w-0 flex-col gap-1">
        <div class="flex items-center gap-2">
          <span class="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary-600 text-sm font-black text-white">H2H</span>
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold leading-tight text-neutral-900">Consola H2H</p>
            <p class="truncate text-[11px] leading-tight text-neutral-400">Jofrantoba Consulting TI</p>
          </div>
        </div>
        <div class="mt-1 flex items-center gap-1.5">
          <span class="truncate text-xs font-medium text-neutral-600">{{ tenant()?.org_v_nombrecomercial }}</span>
          <j-badge [variant]="ambienteVariant()">{{ tenant()?.org_v_ambiente }}</j-badge>
        </div>
      </div>

      <div jFooter class="flex flex-col gap-2">
        <j-user-avatar [name]="user()?.name ?? ''" [email]="user()?.email" size="sm" />
        <button
          type="button"
          (click)="logout()"
          class="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-danger-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Cerrar sesión
        </button>
      </div>

      <router-outlet />
    </j-sidebar-layout>
  `,
})
export class Shell {
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);

  protected readonly tenant = this.session.tenant;
  protected readonly user = this.session.user;

  private readonly url = signal(this.router.url);
  // Ruta activa completa (soporta rutas hijas, ej. 'operaciones/pagos-masivos').
  protected readonly activeKey = computed(() => {
    const path = this.url().split('?')[0].split('/').filter(Boolean);
    return path.join('/') || 'dashboard';
  });

  protected readonly ambienteVariant = computed(() =>
    this.tenant()?.org_v_ambiente === 'PRODUCCION' ? 'destructive' : 'secondary'
  );

  protected readonly nav = computed<SidebarNavGroup[]>(() => {
    const can = (p: string) => this.session.can(p);
    const gate = (perm: string, item: SidebarNavItem): SidebarNavItem[] => (can(perm) ? [item] : []);

    const canAlgunaOperacion =
      can('operaciones.pagos_masivos:read') || can('operaciones.transferencias:read') || can('operaciones.factoring:read');

    const operacion: SidebarNavItem[] = [
      { key: 'dashboard', label: 'Dashboard', icon: '▤' },
      ...(canAlgunaOperacion ? [{ key: 'operaciones', label: 'Todas las operaciones', icon: '≡' } as SidebarNavItem] : []),
      ...gate('documentos:read', { key: 'documentos', label: 'Documentos', icon: '🗎' }),
      ...gate('operaciones.pagos_masivos:read', { key: 'operaciones/pagos-masivos', label: 'Pagos Masivos', icon: '💳' }),
      ...gate('operaciones.transferencias:read', { key: 'operaciones/transferencias', label: 'Transferencias', icon: '⇄' }),
      ...gate('operaciones.factoring:read', { key: 'operaciones/factoring', label: 'Factoring Electrónico', icon: '🧾' }),
      ...gate('planillas:read', { key: 'planillas', label: 'Planillas', icon: '▦' }),
      ...gate('respuestas:read', { key: 'respuestas', label: 'Respuestas BCP', icon: '↩' }),
    ];
    const admin: SidebarNavItem[] = [
      ...gate('beneficiarios:read', { key: 'beneficiarios', label: 'Beneficiarios', icon: '☺' }),
      ...gate('certificados:read', { key: 'certificados', label: 'Certificados', icon: '⚿' }),
      ...gate('catalogos:read', { key: 'catalogos', label: 'Catálogos', icon: '≣' }),
      ...gate('auditoria:read', { key: 'auditoria', label: 'Auditoría', icon: '◷' }),
      ...gate('rbac:read', { key: 'rbac', label: 'Usuarios y RBAC', icon: '⚙' }),
    ];
    return [
      { label: 'Operación', items: operacion },
      { label: 'Administración', items: admin },
    ];
  });

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.url.set(e.urlAfterRedirects));
  }

  protected onNav(item: SidebarNavItem): void {
    this.router.navigate(['/', ...item.key.split('/')]);
  }

  protected logout(): void {
    this.session.clear();
    this.router.navigate(['/login']);
  }
}
