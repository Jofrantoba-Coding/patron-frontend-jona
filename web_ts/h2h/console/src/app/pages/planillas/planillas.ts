import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
} from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import { SessionService } from '../../core/session.service';
import type { Planilla } from '../../core/models';
import { PlanillasViewComponent, type AccionDef } from './planillas-view.component';

@Component({
  selector: 'app-planillas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JTable, JTableHeader, JTableBody, JTableRow, JTableHead, JTableCell, JBadge, JButton, JOptionPane],
  templateUrl: './planillas-view.component.html',
})
export class PlanillasPage extends PlanillasViewComponent {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);

  protected override run(p: Planilla, a: AccionDef): void {
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

  protected override doConfirmed(): void {
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
    super();
    this.canSendSignal.set(this.session.can('planillas:enviar'));
    this.api.planillas().subscribe((res) => this.rows.set(res.items));
  }
}
