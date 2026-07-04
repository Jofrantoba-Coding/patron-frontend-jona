import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
import { ApiService } from '../../core/api.service';
import { SessionService } from '../../core/session.service';
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

/** Bandeja global de documentos H2H: planillas (envío) + respuestas BCP, claro y cifrado. */
@Component({
  selector: 'app-documentos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JTable, JTableHeader, JTableBody, JTableRow, JTableHead, JTableCell, JBadge, JButton, JDialog],
  template: `
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <j-section-heading
        eyebrow="Gestión documental"
        heading="Documentos"
        description="Todos los archivos del flujo H2H: planillas enviadas y respuestas BCP, en claro y cifrado."
      />

      <div class="flex flex-wrap items-end gap-3">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-neutral-500" for="f-producto">Producto</label>
          <select id="f-producto" class="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm" [value]="filtro().producto ?? ''" (change)="set('producto', $event)">
            <option value="">Todos</option>
            <option value="pagos_masivos">Pagos Masivos</option>
            <option value="transferencias">Transferencias</option>
            <option value="factoring">Factoring Electrónico</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-neutral-500" for="f-tipo">Tipo</label>
          <select id="f-tipo" class="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm" [value]="filtro().tipoDocumento ?? ''" (change)="set('tipoDocumento', $event)">
            <option value="">Todos</option>
            <option value="PLANILLA">Planillas (envío)</option>
            <option value="RESPUESTA">Respuestas BCP</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-neutral-500" for="f-formato">Formato</label>
          <select id="f-formato" class="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm" [value]="filtro().formato ?? ''" (change)="set('formato', $event)">
            <option value="">Todos</option>
            <option value="TXT">TXT</option>
            <option value="XML">XML</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-neutral-500" for="f-cifrado">Cifrado</label>
          <select id="f-cifrado" class="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm" [value]="cifradoValue()" (change)="set('cifrado', $event)">
            <option value="">Todos</option>
            <option value="true">Cifrado</option>
            <option value="false">Solo claro</option>
          </select>
        </div>
      </div>

      <j-table responsiveMode="scroll">
        <j-table-header>
          <j-table-row>
            <j-table-head>Archivo</j-table-head>
            <j-table-head>Tipo</j-table-head>
            <j-table-head>Producto</j-table-head>
            <j-table-head>Formato</j-table-head>
            <j-table-head>Modalidad</j-table-head>
            <j-table-head>Estado</j-table-head>
            <j-table-head>Cifrado</j-table-head>
            <j-table-head className="text-right">Ops.</j-table-head>
            <j-table-head>Fecha</j-table-head>
            <j-table-head>Acciones</j-table-head>
          </j-table-row>
        </j-table-header>
        <j-table-body>
          @for (d of rows(); track d.id) {
            <j-table-row>
              <j-table-cell><span class="font-mono text-xs">{{ d.nombre }}</span></j-table-cell>
              <j-table-cell><j-badge [variant]="d.tipoDocumento === 'PLANILLA' ? 'secondary' : 'outline'">{{ d.tipoDocumento }}</j-badge></j-table-cell>
              <j-table-cell>{{ productoLabel(d.producto) }}</j-table-cell>
              <j-table-cell>{{ d.formato }}</j-table-cell>
              <j-table-cell>{{ d.modalidad ?? '—' }}</j-table-cell>
              <j-table-cell><j-badge [variant]="badge(d.estado)">{{ d.estado }}</j-badge></j-table-cell>
              <j-table-cell><j-badge [variant]="d.cifrado ? 'default' : 'ghost'">{{ d.cifrado ? 'Sí' : 'No' }}</j-badge></j-table-cell>
              <j-table-cell className="text-right tabular-nums">{{ d.totalOperaciones ?? '—' }}</j-table-cell>
              <j-table-cell>{{ fecha(d.fecha) }}</j-table-cell>
              <j-table-cell>
                <div class="flex flex-wrap gap-1.5">
                  <j-button size="sm" variant="ghost" (clicked)="preview(d)">Ver</j-button>
                  @if (canDownload() && d.urlClaro) {
                    <j-button size="sm" variant="outline" (clicked)="descargar(d, 'claro')">Claro</j-button>
                  }
                  @if (canDownloadCifrado() && d.cifrado) {
                    <j-button size="sm" variant="outline" (clicked)="descargar(d, 'cifrado')">Cifrado</j-button>
                  }
                </div>
              </j-table-cell>
            </j-table-row>
          } @empty {
            <j-table-row>
              <j-table-cell [attr.colspan]="10"><span class="text-sm text-neutral-400">Sin documentos para el filtro actual.</span></j-table-cell>
            </j-table-row>
          }
        </j-table-body>
      </j-table>
    </div>

    <j-dialog
      [open]="preview_() !== null"
      size="lg"
      [title]="preview_()?.nombre ?? ''"
      [description]="preview_() ? preview_()!.tipoDocumento + ' · ' + preview_()!.formato : ''"
      (closed)="preview_.set(null)"
      (cancel)="preview_.set(null)"
    >
      <pre class="max-h-[60vh] overflow-auto rounded-md bg-neutral-900 p-4 font-mono text-xs leading-relaxed text-neutral-100">{{ preview_()?.contenido }}</pre>
    </j-dialog>
  `,
})
export class DocumentosPage {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);

  protected readonly rows = signal<Documento[]>([]);
  protected readonly filtro = signal<DocumentoFiltro>({});
  protected readonly preview_ = signal<DocumentoPreview | null>(null);

  protected readonly canDownload = () => this.session.can('documentos:download');
  protected readonly canDownloadCifrado = () => this.session.can('documentos:download_cifrado');
  protected readonly cifradoValue = () => (this.filtro().cifrado === undefined ? '' : String(this.filtro().cifrado));

  protected readonly num = (n: number) => NUM.format(n);
  protected fecha(iso: string): string {
    return iso ? FECHA.format(new Date(iso)) : '—';
  }
  protected badge(estado: string): JBadgeVariant {
    return ESTADO_BADGE[estado] ?? 'secondary';
  }
  protected productoLabel(p: Documento['producto']): string {
    return p === 'pagos_masivos' ? 'Pagos Masivos' : p === 'transferencias' ? 'Transferencias' : p === 'factoring' ? 'Factoring' : '—';
  }

  protected set(key: keyof DocumentoFiltro, e: Event): void {
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

  protected preview(d: Documento): void {
    this.api.previewDocumento(d.id).subscribe((res) => this.preview_.set(res));
  }

  protected descargar(d: Documento, variante: 'claro' | 'cifrado'): void {
    this.api.descargarDocumento(d.id, variante).subscribe((res) => {
      // En el mock no hay binario: abrimos/mostramos la URL de referencia.
      window.open(res.url, '_blank');
    });
  }

  private load(): void {
    this.api.documentos(this.filtro()).subscribe((res) => this.rows.set(res.items));
  }

  constructor() {
    this.load();
  }
}
