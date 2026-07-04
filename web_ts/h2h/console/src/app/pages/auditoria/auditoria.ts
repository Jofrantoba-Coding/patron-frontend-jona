import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { JDataTable, JSectionHeading, type JDataTableColumn, type JDataTableRow } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { AuditEvent } from '../../core/models';

const FECHA = new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' });

/** Bitácora de auditoría (DML / acciones). */
@Component({
  selector: 'app-auditoria',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable],
  template: `
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <j-section-heading eyebrow="Trazabilidad" heading="Auditoría" description="Eventos y cambios registrados en el sistema H2H." />
      <j-data-table
        [columns]="columns"
        [data]="rows()"
        [rowKey]="rowKey"
        [showFilter]="true"
        filterPlaceholder="Buscar por actor, acción o entidad…"
        emptyTitle="Sin eventos"
        emptyDescription="No hay eventos de auditoría."
      />
    </div>
  `,
})
export class AuditoriaPage {
  private readonly api = inject(ApiService);
  protected readonly rows = signal<JDataTableRow[]>([]);
  protected readonly rowKey = (r: JDataTableRow) => String((r as unknown as AuditEvent).eventId);

  protected readonly columns: JDataTableColumn[] = [
    { key: 'createdAt', header: 'Fecha', sortable: true, render: (v) => FECHA.format(new Date(String(v))) },
    { key: 'actor', header: 'Actor', sortable: true },
    { key: 'action', header: 'Acción', sortable: true },
    { key: 'entity', header: 'Entidad', sortable: true },
    { key: 'entityId', header: 'Id entidad', render: (v) => String(v ?? '—') },
    { key: 'result', header: 'Resultado', sortable: true, align: 'center' },
  ];

  constructor() {
    this.api.audit().subscribe((res) => this.rows.set(res.items as unknown as JDataTableRow[]));
  }
}
