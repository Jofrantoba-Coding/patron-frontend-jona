import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { JDataTable, JDialog, JPagination, JSectionHeading, JTabs, JTabsContent, JTabsList, JTabsTrigger } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { Beneficiario } from '../../core/models';
import { BeneficiariosViewComponent } from './beneficiarios-view.component';

/** Maestro de beneficiarios (solo lectura en esta iteración). */
@Component({
  selector: 'app-beneficiarios',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, JDialog, JTabs, JTabsList, JTabsTrigger, JTabsContent],
  templateUrl: './beneficiarios-view.component.html',
})
export class BeneficiariosPage extends BeneficiariosViewComponent implements OnInit {
  private readonly api = inject(ApiService);

  ngOnInit(): void {
    this.load();
  }

  override load(): void {
    this.api
      .beneficiarios({ page: this.page(), pageSize: this.pageSize(), filters: this.buildBackendFilters() })
      .subscribe((res) => this.setPagedResult(res));
  }

  protected override openDetalle(beneficiario: Beneficiario): void {
    this.detalleSeleccionado.set(beneficiario);
    this.detalle.set(null);
    this.detalleLoading.set(beneficiario.id);
    this.detalleTab.set('datos');
    this.api
      .beneficiarioDetalle(beneficiario.id)
      .pipe(
        finalize(() => {
          if (this.detalleLoading() === beneficiario.id) {
            this.detalleLoading.set(null);
          }
        })
      )
      .subscribe((res) => {
        if (this.detalleSeleccionado()?.id === beneficiario.id) {
          this.setDetalle(res);
        }
      });
  }
}
