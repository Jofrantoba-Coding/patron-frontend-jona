import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JButton, JDataTable, JDialog, JPagination, JSectionHeading } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import { SessionService } from '../../core/session.service';
import { CorrelativosViewComponent } from './correlativos-view.component';

/** Mantenimiento (CRUD) de correlativos de documentos por organizacion. */
@Component({
  selector: 'app-correlativos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, JDialog, JButton],
  templateUrl: './correlativos-view.component.html',
})
export class CorrelativosPage extends CorrelativosViewComponent {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);

  constructor() {
    super();
    this.api.parametrias({ codigoPadre: 'GLOBAL#TIPO_CORRELATIVO' }).subscribe((list) => this.setTipos(list));
    this.load();
  }

  protected override orgDefault(): string {
    return this.session.tenant()?.org_u_id ?? '';
  }

  protected override load(): void {
    this.api.correlativos({}).subscribe((rows) => this.setRows(rows));
  }

  protected override guardar(): void {
    const payload = this.buildPayload();
    if (!payload.idOrganizacion || !payload.idTipoDocumento) {
      return;
    }
    const req = this.editId() ? this.api.correlativoActualizar(payload) : this.api.correlativoGuardar(payload);
    req.subscribe({
      next: () => {
        this.cerrarForm();
        this.load();
      },
      error: (e) => console.error('Error al guardar correlativo', e),
    });
  }

  protected override eliminar(): void {
    const id = this.editId();
    if (!id) {
      return;
    }
    this.api.correlativoEliminar(id).subscribe({
      next: () => {
        this.cerrarForm();
        this.load();
      },
      error: (e) => console.error('Error al eliminar correlativo', e),
    });
  }
}
