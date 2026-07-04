import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  JBadge,
  JButton,
  JSectionHeading,
  JTable,
  JTableBody,
  JTableCell,
  JTableHead,
  JTableHeader,
  JTableRow,
} from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import { SessionService } from '../../core/session.service';
import type { RespuestaBCP } from '../../core/models';

@Component({
  selector: 'app-respuestas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlicePipe, JSectionHeading, JTable, JTableHeader, JTableBody, JTableRow, JTableHead, JTableCell, JBadge, JButton],
  template: `
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <j-section-heading eyebrow="Banco" heading="Respuestas BCP" description="Recepción y procesamiento de respuestas VAL/RES/RES2/PAR." />
      <j-table responsiveMode="scroll">
        <j-table-header>
          <j-table-row>
            <j-table-head>Archivo</j-table-head>
            <j-table-head>Tipo</j-table-head>
            <j-table-head>Recepción</j-table-head>
            <j-table-head className="text-right">Total</j-table-head>
            <j-table-head className="text-right">OK</j-table-head>
            <j-table-head className="text-right">Error</j-table-head>
            <j-table-head>Acción</j-table-head>
          </j-table-row>
        </j-table-header>
        <j-table-body>
          @for (r of rows(); track r.prb_u_id) {
            <j-table-row>
              <j-table-cell><span class="font-mono text-xs">{{ r.prb_v_nombre_archivo }}</span></j-table-cell>
              <j-table-cell><j-badge variant="secondary">{{ r.prb_n_id_tiporespuesta_code }}</j-badge></j-table-cell>
              <j-table-cell><span class="text-xs text-neutral-500">{{ r.prb_d_fecha_recepcion | slice: 0 : 16 }}</span></j-table-cell>
              <j-table-cell className="text-right tabular-nums">{{ r.prb_n_total_operaciones }}</j-table-cell>
              <j-table-cell className="text-right tabular-nums text-success-600">{{ r.prb_n_operaciones_ok }}</j-table-cell>
              <j-table-cell className="text-right tabular-nums text-danger-600">{{ r.prb_n_operaciones_error }}</j-table-cell>
              <j-table-cell>
                <j-button size="sm" variant="outline" [loading]="busy() === r.prb_u_id" (clicked)="procesar(r)">Procesar</j-button>
              </j-table-cell>
            </j-table-row>
          } @empty {
            <j-table-row><j-table-cell [colSpan]="7"><span class="text-sm text-neutral-400">Sin respuestas.</span></j-table-cell></j-table-row>
          }
        </j-table-body>
      </j-table>
    </div>
  `,
})
export class RespuestasPage {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);
  protected readonly rows = signal<RespuestaBCP[]>([]);
  protected readonly busy = signal<string | null>(null);

  protected procesar(r: RespuestaBCP): void {
    if (!this.session.can('respuestas:read')) return;
    this.busy.set(r.prb_u_id);
    this.api.procesarRespuesta(r.prb_u_id).subscribe({
      next: () => this.busy.set(null),
      error: () => this.busy.set(null),
    });
  }

  constructor() {
    this.api.respuestas().subscribe((res) => this.rows.set(res.items));
  }
}
