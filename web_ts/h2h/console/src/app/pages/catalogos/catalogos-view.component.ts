import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
import type { EstructuraArchivo } from '../../core/models';

interface CatalogoRow {
  code: string;
  values: string[];
}

@Component({
  selector: 'app-catalogos-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JTable, JTableHeader, JTableBody, JTableRow, JTableHead, JTableCell, JBadge],
  templateUrl: './catalogos-view.component.html',
})
export class CatalogosViewComponent {
  protected readonly catalogos = signal<CatalogoRow[]>([]);
  protected readonly estructuras = signal<EstructuraArchivo[]>([]);
}
