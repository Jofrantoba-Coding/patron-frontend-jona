import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  JBadge,
  JChip,
  JSectionHeading,
  JTable,
  JTableBody,
  JTableCell,
  JTableHead,
  JTableHeader,
  JTableRow,
} from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';

interface KcUser {
  id: string;
  username: string;
  name: string;
  email: string;
  roles: string[];
  enabled: boolean;
}

@Component({
  selector: 'app-rbac',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JTable, JTableHeader, JTableBody, JTableRow, JTableHead, JTableCell, JBadge, JChip],
  template: `
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <j-section-heading
        eyebrow="Identidad"
        heading="Usuarios y RBAC"
        description="Vista de solo lectura del realm Keycloak del tenant. La creación de usuarios se hace en Keycloak."
      />

      <div>
        <p class="mb-2 text-sm font-semibold text-neutral-900">Roles del realm</p>
        <div class="flex flex-wrap gap-2">
          @for (r of roles(); track r.role) {
            <j-chip variant="primary">{{ r.role }}</j-chip>
          }
        </div>
      </div>

      <j-table responsiveMode="cards">
        <j-table-header>
          <j-table-row>
            <j-table-head>Usuario</j-table-head>
            <j-table-head>Nombre</j-table-head>
            <j-table-head>Email</j-table-head>
            <j-table-head>Roles</j-table-head>
            <j-table-head>Estado</j-table-head>
          </j-table-row>
        </j-table-header>
        <j-table-body>
          @for (u of users(); track u.id) {
            <j-table-row>
              <j-table-cell dataLabel="Usuario"><span class="font-mono text-xs">{{ u.username }}</span></j-table-cell>
              <j-table-cell dataLabel="Nombre">{{ u.name }}</j-table-cell>
              <j-table-cell dataLabel="Email"><span class="text-neutral-500">{{ u.email }}</span></j-table-cell>
              <j-table-cell dataLabel="Roles">
                <div class="flex flex-wrap gap-1">
                  @for (r of u.roles; track r) {
                    <j-badge variant="secondary">{{ r }}</j-badge>
                  }
                </div>
              </j-table-cell>
              <j-table-cell dataLabel="Estado">
                <j-badge [variant]="u.enabled ? 'default' : 'destructive'">{{ u.enabled ? 'Activo' : 'Inactivo' }}</j-badge>
              </j-table-cell>
            </j-table-row>
          }
        </j-table-body>
      </j-table>
    </div>
  `,
})
export class RbacPage {
  private readonly api = inject(ApiService);
  protected readonly users = signal<KcUser[]>([]);
  protected readonly roles = signal<{ role: string; description: string }[]>([]);

  constructor() {
    this.api.identityUsers().subscribe((res) => this.users.set(res.items));
    this.api.identityRoles().subscribe((res) => this.roles.set(res.items));
  }
}
