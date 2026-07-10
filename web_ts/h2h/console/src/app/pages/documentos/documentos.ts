import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
} from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import { SessionService } from '../../core/session.service';
import type { Documento, DocumentoFiltro, DocumentoPreview } from '../../core/models';
import { DocumentosViewComponent } from './documentos-view.component';

/** Bandeja global de documentos H2H: planillas (envío) + respuestas BCP, claro y cifrado. */
@Component({
  selector: 'app-documentos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JTable, JTableHeader, JTableBody, JTableRow, JTableHead, JTableCell, JBadge, JButton, JDialog],
  templateUrl: './documentos-view.component.html',
})
export class DocumentosPage extends DocumentosViewComponent {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);

  protected override set(key: keyof DocumentoFiltro, e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
    this.filtro.update((f) => {
      const next = { ...f };
      if (key === 'cifrado') {
        if (value === '') delete next.cifrado;
        else next.cifrado = value === 'true';
      } else if (value === '') {
        delete next[key];
      } else {
        (next as Record<string, unknown>)[key] = value;
      }
      return next;
    });
    this.load();
  }

  protected override preview(d: Documento): void {
    this.api.previewDocumento(d.id).subscribe((res) => this.preview_.set(res));
  }

  protected override descargar(d: Documento, variante: 'claro' | 'cifrado'): void {
    this.api.descargarDocumento(d.id, variante).subscribe((res) => {
      window.open(res.url, '_blank');
    });
  }

  protected load(): void {
    this.api.documentos(this.filtro()).subscribe((res) => this.rows.set(res.items));
  }

  constructor() {
    super();
    this.canDownloadSignal.set(this.session.can('documentos:download'));
    this.canDownloadCifradoSignal.set(this.session.can('documentos:download_cifrado'));
    this.load();
  }
}
