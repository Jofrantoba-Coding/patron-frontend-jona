import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  JBadge,
  JButton,
  JDialog,
  JSectionHeading,
  JTable,
  JTableBody,
  JTableCell,
  JTableHead,
  JTableHeader,
  JTableRow,
  type JBadgeVariant,
} from 'uijona-4ngular';
import type { Documento, DocumentoFiltro, DocumentoPreview } from '../../core/models';

const NUM = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 });
const FECHA = new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' });

const ESTADO_BADGE: Record<string, JBadgeVariant> = {
  PROCESADA: 'default',
  PROCESADA_PARCIAL: 'outline',
  ENVIADA: 'default',
  CIFRADA: 'default',
  GENERADA: 'secondary',
  RECHAZADA: 'destructive',
  ERROR: 'destructive',
  RES: 'default',
  RES2: 'default',
  PAR: 'outline',
  VAL: 'destructive',
};

@Component({
  selector: 'app-documentos-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JTable, JTableHeader, JTableBody, JTableRow, JTableHead, JTableCell, JBadge, JButton, JDialog],
  templateUrl: './documentos-view.component.html',
})
export class DocumentosViewComponent {
  protected readonly rows = signal<Documento[]>([]);
  protected readonly filtro = signal<DocumentoFiltro>({});
  protected readonly preview_ = signal<DocumentoPreview | null>(null);
  protected readonly canDownloadSignal = signal(false);
  protected readonly canDownloadCifradoSignal = signal(false);

  protected readonly canDownload = () => this.canDownloadSignal();
  protected readonly canDownloadCifrado = () => this.canDownloadCifradoSignal();

  protected readonly num = (value: number) => NUM.format(value);
  protected set(_key: keyof DocumentoFiltro, _event: Event): void {}
  protected preview(_d: Documento): void {}
  protected descargar(_d: Documento, _variante: 'claro' | 'cifrado'): void {}
  protected fecha(iso: string): string {
    return iso ? FECHA.format(new Date(iso)) : '—';
  }
  protected badge(estado: string): JBadgeVariant {
    return ESTADO_BADGE[estado] ?? 'secondary';
  }
  protected productoLabel(producto: Documento['producto']): string {
    return producto === 'pagos_masivos' ? 'Pagos Masivos' : producto === 'transferencias' ? 'Transferencias' : producto === 'factoring' ? 'Factoring' : '—';
  }

  protected readonly cifradoValue = () => (this.filtro().cifrado === undefined ? '' : String(this.filtro().cifrado));
}
