import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  JBadge,
  JSectionHeading,
  JTable,
  JTableBody,
  JTableCell,
  JTableHead,
  JTableHeader,
  JTableRow,
} from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import { CatalogosViewComponent } from './catalogos-view.component';

/** Catálogos (parametría) y estructuras de archivo del dominio H2H. */
@Component({
  selector: 'app-catalogos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JTable, JTableHeader, JTableBody, JTableRow, JTableHead, JTableCell, JBadge],
  templateUrl: './catalogos-view.component.html',
})
export class CatalogosPage extends CatalogosViewComponent {
  private readonly api = inject(ApiService);

  constructor() {
    super();
    this.api.catalogs().subscribe((map) => this.catalogos.set(Object.entries(map).map(([code, values]) => ({ code, values }))));
    this.api.estructuras().subscribe((res) => this.estructuras.set(res.items));
  }
}
