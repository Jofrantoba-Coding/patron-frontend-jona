import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JDataTable, JPagination, JSectionHeading } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { ProductoGrupo } from '../../core/models';
import { OperacionesViewComponent } from './operaciones-view.component';

@Component({
  selector: 'app-operaciones',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination],
  templateUrl: './operaciones-view.component.html',
})
export class OperacionesPage extends OperacionesViewComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const producto = (data['producto'] as ProductoGrupo | undefined) ?? null;
      this.setProducto(producto);
      this.load();
    });
  }

  override load(): void {
    const producto = this.producto();
    const filters = this.buildBackendFilters();
    if (producto) {
      const subtipo = this.subtipo() || undefined;
      this.api
        .operaciones({ producto, subtipo, page: this.page(), pageSize: this.pageSize(), filters })
        .subscribe((res) => this.setPagedResult(res));
    } else {
      this.api.operaciones({ page: this.page(), pageSize: this.pageSize(), filters }).subscribe((res) => this.setPagedResult(res));
    }
  }
}
