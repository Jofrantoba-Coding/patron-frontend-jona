import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
import type { RespuestaBCP } from '../../core/models';

@Component({
  selector: 'app-respuestas-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlicePipe, JSectionHeading, JTable, JTableHeader, JTableBody, JTableRow, JTableHead, JTableCell, JBadge, JButton],
  templateUrl: './respuestas-view.component.html',
})
export class RespuestasViewComponent {
  protected readonly rows = signal<RespuestaBCP[]>([]);
  protected readonly busy = signal<string | null>(null);

  protected procesar(_r: RespuestaBCP): void {}
}
