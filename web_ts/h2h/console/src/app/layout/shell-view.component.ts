// shell-view.component.ts — JONA View del layout principal.
// Estado base y navegación derivada. No inyecta servicios: la Page (shell.ts)
// los aporta sobrescribiendo las señales.
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  JBadge,
  JSidebarLayout,
  JUserAvatar,
  type SidebarNavGroup,
  type SidebarNavItem,
} from 'uijona-4ngular';
import type { AppUser, Tenant } from '../core/models';
import { RelojCanalComponent } from '../shared/reloj-canal/reloj-canal';
import { RelojesJobsComponent } from '../shared/relojes-jobs/relojes-jobs';
import { ETIQUETA_GRUPO, type PendientesPorEtapa } from './inter-shell';

type Usuario = Pick<AppUser, 'name' | 'email'> | null;

@Component({
  selector: 'app-shell-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, JSidebarLayout, JUserAvatar, JBadge, RelojCanalComponent, RelojesJobsComponent],
  templateUrl: './shell-view.component.html',
})
export class ShellViewComponent {
  protected readonly tenant = signal<Tenant | null>(null);
  protected readonly user = signal<Usuario>(null);
  protected readonly activeKey = signal('dashboard');
  protected readonly pendientes = signal<PendientesPorEtapa>({});

  /** Permisos efectivos; la Page la sobrescribe con los de la sesión. */
  protected can: (permiso: string) => boolean = () => true;

  protected readonly ambienteVariant = computed(() =>
    this.tenant()?.org_v_ambiente === 'PRODUCCION' ? 'destructive' : 'secondary'
  );

  protected readonly nav = computed<SidebarNavGroup[]>(() => {
    const can = (p: string) => this.can(p);
    const gate = (permiso: string, item: SidebarNavItem): SidebarNavItem[] =>
      can(permiso) ? [item] : [];
    const pend = this.pendientes();
    /** Un badge en cero es ruido: solo se pinta cuando hay trabajo. */
    const badge = (n: number | undefined) => (n && n > 0 ? { badge: n } : {});

    const canAlgunaOperacion =
      can('operaciones.pagos_masivos:read') ||
      can('operaciones.transferencias:read') ||
      can('operaciones.factoring:read');

    // ── El flujo: las cuatro etapas del canal, numeradas y en orden ──────────
    // Los productos (Pagos Masivos / Transferencias / Factoring) ya NO son
    // items del menu: son un filtro dentro de Operaciones. Sus rutas siguen
    // existiendo para no romper enlaces guardados.
    const flujo: SidebarNavItem[] = [
      ...(canAlgunaOperacion
        ? [
            {
              key: 'operaciones',
              label: '1 · Operaciones',
              icon: '❶',
              ...badge(pend.operaciones),
            } as SidebarNavItem,
          ]
        : []),
      ...gate('planillas:read', {
        key: 'programaciones',
        label: '2 · Programación de envíos',
        icon: '❷',
        ...badge(pend.programaciones),
      }),
      ...gate('planillas:read', {
        key: 'planillas',
        label: '3 · Planillas',
        icon: '❸',
        ...badge(pend.planillas),
      }),
      ...gate('respuestas:read', {
        key: 'respuestas',
        label: '4 · Respuestas del banco',
        icon: '❹',
        ...badge(pend.respuestas),
      }),
    ];

    const maestros: SidebarNavItem[] = [
      ...gate('beneficiarios:read', { key: 'beneficiarios', label: 'Beneficiarios', icon: '◍' }),
      ...gate('catalogos:read', { key: 'catalogos', label: 'Catálogos', icon: '≣' }),
      ...gate('catalogos:read', { key: 'correlativos', label: 'Correlativos', icon: '№' }),
    ];

    // ── Canal BCP: todo lo que hace falta para que el archivo llegue ─────────
    const canal: SidebarNavItem[] = [
      ...gate('llaves:read', { key: 'sftp-config', label: 'Conexión SFTP', icon: '◈' }),
      ...gate('planillas:read', { key: 'sftp-seguimiento', label: 'Sesiones SFTP', icon: '◇' }),
      // "Certificados" se retiró: era la misma información (vigencia y rotación
      // de llaves PGP) servida por el mock, y la duplicaba con datos falsos.
      // Llaves de cifrado la cubre contra la API real.
      ...gate('llaves:read', { key: 'llaves-cifrado', label: 'Llaves de cifrado', icon: '⚿' }),
      // Enciende el envío automático de dinero: se gatea por el permiso de
      // configuración del canal, no por el de lectura de planillas.
      ...gate('llaves:read', {
        key: 'jobs-configuracion',
        label: 'Automatización',
        icon: '◐',
      }),
      ...gate('planillas:read', { key: 'schedulers-seguimiento', label: 'Corridas', icon: '◔' }),
    ];

    const gobierno: SidebarNavItem[] = [
      ...(can('organizacion:read') || can('catalogos:read') || can('rbac:read')
        ? [{ key: 'organizacion', label: 'Organización', icon: '⌂' } as SidebarNavItem]
        : []),
      ...gate('rbac:read', { key: 'rbac', label: 'Usuarios y permisos', icon: '⚙' }),
      ...gate('auditoria:read', { key: 'auditoria', label: 'Auditoría', icon: '◷' }),
    ];

    const grupos: SidebarNavGroup[] = [
      { items: [{ key: 'dashboard', label: 'Panel de control', icon: '⊞' }] },
      { label: ETIQUETA_GRUPO.flujo, items: flujo },
      { label: ETIQUETA_GRUPO.maestros, items: maestros },
      { label: ETIQUETA_GRUPO.canal, items: canal },
      { label: ETIQUETA_GRUPO.gobierno, items: gobierno },
    ];
    return grupos.filter((g) => g.items.length > 0);
  });

  /** La Page sobrescribe estos hooks. */
  protected onNav(_item: SidebarNavItem): void {}
  protected logout(): void {}
}
