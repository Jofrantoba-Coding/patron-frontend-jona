import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { JDataTable, JSectionHeading, type JDataTableColumn, type JDataTableRow } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { Beneficiario } from '../../core/models';

/** Maestro de beneficiarios (solo lectura en esta iteración). */
@Component({
  selector: 'app-beneficiarios',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable],
  template: `
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <j-section-heading eyebrow="Maestros" heading="Beneficiarios" description="Terceros y sus datos para la generación de archivos H2H." />
      <j-data-table
        [columns]="columns"
        [data]="rows()"
        [rowKey]="rowKey"
        [showFilter]="true"
        filterPlaceholder="Buscar por documento o nombre…"
        emptyTitle="Sin beneficiarios"
        emptyDescription="No hay beneficiarios registrados."
      />
    </div>
  `,
})
export class BeneficiariosPage {
  private readonly api = inject(ApiService);
  protected readonly rows = signal<JDataTableRow[]>([]);
  protected readonly rowKey = (r: JDataTableRow) => String((r as unknown as Beneficiario).ben_v_numerodocumento);

  protected readonly columns: JDataTableColumn[] = [
    { key: 'ben_n_id_tipodocumento_code', header: 'Tipo doc.', sortable: true, align: 'center' },
    { key: 'ben_v_numerodocumento', header: 'Documento', sortable: true },
    { key: 'ben_v_nombre', header: 'Nombre / Razón social', sortable: true },
    { key: 'ben_v_email', header: 'Correo', render: (v) => String(v ?? '—') },
  ];

  constructor() {
    this.api.beneficiarios().subscribe((res) => this.rows.set(res.items as unknown as JDataTableRow[]));
  }
}
