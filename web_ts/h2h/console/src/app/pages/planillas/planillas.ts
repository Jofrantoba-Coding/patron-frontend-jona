import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { JBadge, JDataTable, JDialog, JPagination, JSectionHeading, JTabs, JTabsContent, JTabsList, JTabsTrigger } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { PlanillaRow } from '../../core/models';
import { PlanillasViewComponent } from './planillas-view.component';

/** Consulta de planillas H2H: listado paginado, filtros y detalle del archivo con sus etapas. */
@Component({
  selector: 'app-planillas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, JBadge, JDialog, JTabs, JTabsList, JTabsTrigger, JTabsContent],
  templateUrl: './planillas-view.component.html',
})
export class PlanillasPage extends PlanillasViewComponent implements OnInit {
  private readonly api = inject(ApiService);

  ngOnInit(): void {
    this.load();
  }

  override load(): void {
    this.api
      .planillasBackend({ page: this.page(), pageSize: this.pageSize(), filters: this.buildBackendFilters() })
      .subscribe((res) => this.setPagedResult(res));
  }

  protected override openDetalle(planilla: PlanillaRow): void {
    this.detalleSeleccionado.set(planilla);
    this.detalle.set(null);
    this.detalleLoading.set(planilla.id);
    this.detalleTab.set('resumen');
    this.api
      .planillaDetalleBackend(planilla.id)
      .pipe(
        finalize(() => {
          if (this.detalleLoading() === planilla.id) {
            this.detalleLoading.set(null);
          }
        })
      )
      .subscribe((res) => {
        if (this.detalleSeleccionado()?.id === planilla.id) {
          this.setDetalle(res);
        }
      });
  }
}
