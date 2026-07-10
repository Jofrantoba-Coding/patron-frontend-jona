import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { RespuestasViewComponent } from './respuestas-view.component';

@Component({
  selector: 'app-respuestas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlicePipe, JSectionHeading, JTable, JTableHeader, JTableBody, JTableRow, JTableHead, JTableCell, JBadge, JButton],
  templateUrl: './respuestas-view.component.html',
})
export class RespuestasPage extends RespuestasViewComponent {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);

  protected override procesar(r: RespuestaBCP): void {
    if (!this.session.can('respuestas:read')) return;
    this.busy.set(r.prb_u_id);
    this.api.procesarRespuesta(r.prb_u_id).subscribe({
      next: () => this.busy.set(null),
      error: () => this.busy.set(null),
    });
  }

  constructor() {
    super();
    this.api.respuestas().subscribe((res) => this.rows.set(res.items));
  }
}
