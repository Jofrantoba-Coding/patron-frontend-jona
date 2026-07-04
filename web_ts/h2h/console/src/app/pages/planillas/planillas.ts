import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  JBadge,
  JButton,
  JOptionPane,
  JSectionHeading,
  JTable,
  JTableBody,
  JTableCell,
  JTableHead,
  JTableHeader,
  JTableRow,
  type JBadgeVariant,
} from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import { SessionService } from '../../core/session.service';
import type { Planilla } from '../../core/models';

const NUM = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 });

type Accion = 'validar' | 'cifrar' | 'enviar' | 'reintentar-envio' | 'cancelar';
interface AccionDef {
  label: string;
  accion: Accion;
  variant: 'default' | 'outline' | 'destructive';
  confirm?: boolean;
}

const BADGE: Record<string, JBadgeVariant> = {
  GENERADA: 'secondary',
  VALIDADA: 'secondary',
  PENDIENTE_CIFRADO: 'outline',
  CIFRADA: 'default',
  PENDIENTE_ENVIO: 'outline',
  ENVIADA: 'default',
  RESPUESTA_RECIBIDA: 'default',
  PROCESADA: 'default',
  PROCESADA_PARCIAL: 'outline',
  RECHAZADA: 'destructive',
  ERROR: 'destructive',
  ERROR_CIFRADO: 'destructive',
  ANULADA: 'ghost',
};

const ACCIONES: Record<string, AccionDef[]> = {
  GENERADA: [
    { label: 'Validar', accion: 'validar', variant: 'default' },
    { label: 'Anular', accion: 'cancelar', variant: 'destructive', confirm: true },
  ],
  VALIDADA: [
    { label: 'Cifrar', accion: 'cifrar', variant: 'default' },
    { label: 'Anular', accion: 'cancelar', variant: 'destructive', confirm: true },
  ],
  PENDIENTE_CIFRADO: [{ label: 'Cifrar', accion: 'cifrar', variant: 'default' }],
  CIFRADA: [
    { label: 'Enviar', accion: 'enviar', variant: 'default', confirm: true },
    { label: 'Anular', accion: 'cancelar', variant: 'destructive', confirm: true },
  ],
  PENDIENTE_ENVIO: [{ label: 'Enviar', accion: 'enviar', variant: 'default', confirm: true }],
  ENVIADA: [{ label: 'Reintentar', accion: 'reintentar-envio', variant: 'outline' }],
};

@Component({
  selector: 'app-planillas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JTable, JTableHeader, JTableBody, JTableRow, JTableHead, JTableCell, JBadge, JButton, JOptionPane],
  template: `
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <j-section-heading eyebrow="Archivos H2H" heading="Planillas" description="Generación, cifrado y envío de planillas a BCP." />

      <j-table responsiveMode="scroll">
        <j-table-header>
          <j-table-row>
            <j-table-head>Archivo</j-table-head>
            <j-table-head>Producto</j-table-head>
            <j-table-head>Formato</j-table-head>
            <j-table-head>Estado</j-table-head>
            <j-table-head className="text-right">Monto</j-table-head>
            <j-table-head className="text-right">Ops.</j-table-head>
            <j-table-head>Acciones</j-table-head>
          </j-table-row>
        </j-table-header>
        <j-table-body>
          @for (p of rows(); track p.pla_u_id) {
            <j-table-row>
              <j-table-cell><span class="font-mono text-xs">{{ p.pla_v_nombre_archivo }}</span></j-table-cell>
              <j-table-cell>{{ p.pla_n_id_producto_code }}</j-table-cell>
              <j-table-cell>{{ p.pla_n_id_formato_code }}</j-table-cell>
              <j-table-cell><j-badge [variant]="badge(p.pla_n_id_estadoplanilla_code)">{{ p.pla_n_id_estadoplanilla_code }}</j-badge></j-table-cell>
              <j-table-cell className="text-right tabular-nums">{{ num(p.pla_dec_montototal) }}</j-table-cell>
              <j-table-cell className="text-right tabular-nums">{{ p.pla_n_total_operaciones }}</j-table-cell>
              <j-table-cell>
                <div class="flex flex-wrap gap-1.5">
                  @for (a of acciones(p.pla_n_id_estadoplanilla_code); track a.accion) {
                    <j-button size="sm" [variant]="a.variant" [disabled]="!canSend()" (clicked)="run(p, a)">{{ a.label }}</j-button>
                  } @empty {
                    <span class="text-xs text-neutral-400">—</span>
                  }
                </div>
              </j-table-cell>
            </j-table-row>
          }
        </j-table-body>
      </j-table>
    </div>

    <j-option-pane
      [open]="confirm() !== null"
      variant="warning"
      [title]="confirm()?.title ?? ''"
      [description]="confirm()?.desc ?? ''"
      confirmLabel="Sí, continuar"
      cancelLabel="Cancelar"
      [isLoading]="loading()"
      (confirm)="doConfirmed()"
      (cancel)="confirm.set(null)"
    />
  `,
})
export class PlanillasPage {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);

  protected readonly rows = signal<Planilla[]>([]);
  protected readonly loading = signal(false);
  protected readonly confirm = signal<{ title: string; desc: string; planilla: Planilla; def: AccionDef } | null>(null);

  protected readonly canSend = () => this.session.can('planillas:enviar');
  protected readonly num = (n: number) => NUM.format(n);
  protected badge(estado: string): JBadgeVariant {
    return BADGE[estado] ?? 'secondary';
  }
  protected acciones(estado: string): AccionDef[] {
    return ACCIONES[estado] ?? [];
  }

  protected run(p: Planilla, a: AccionDef): void {
    if (a.confirm) {
      this.confirm.set({
        title: `${a.label} planilla`,
        desc: `${a.label} "${p.pla_v_nombre_archivo}" (${p.pla_n_total_operaciones} operaciones). Esta acción es sensible.`,
        planilla: p,
        def: a,
      });
    } else {
      this.execute(p, a);
    }
  }

  protected doConfirmed(): void {
    const c = this.confirm();
    if (c) this.execute(c.planilla, c.def);
  }

  private execute(p: Planilla, a: AccionDef): void {
    this.loading.set(true);
    this.api.planillaAccion(p.pla_u_id, a.accion).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.confirm.set(null);
        this.rows.update((list) =>
          list.map((x) => (x.pla_u_id === p.pla_u_id ? { ...x, pla_n_id_estadoplanilla_code: res.estadoActual } : x))
        );
      },
      error: () => {
        this.loading.set(false);
        this.confirm.set(null);
      },
    });
  }

  constructor() {
    this.api.planillas().subscribe((res) => this.rows.set(res.items));
  }
}
