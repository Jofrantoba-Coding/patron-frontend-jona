import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  JButton,
  JDataTable,
  JDialog,
  JPagination,
  JSectionHeading,
  type JDataTableColumn,
  type JDataTableRow,
} from 'uijona-4ngular';
import type { Correlativo, Parametria } from '../../core/models';

/** Formatos y periodicidades soportadas (alineadas a tm_cor_correlativo). */
export const FORMATOS = ['NUMERICO', 'CADENA_CEROS'] as const;
export const PERIODICIDADES = ['NINGUNA', 'DIARIA', 'MENSUAL', 'ANUAL'] as const;

@Component({
  selector: 'app-correlativos-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, JDialog, JButton],
  templateUrl: './correlativos-view.component.html',
})
export class CorrelativosViewComponent {
  protected readonly formatos = FORMATOS;
  protected readonly periodicidades = PERIODICIDADES;

  /** Tipos de documento (parametria con codigoPadre = GLOBAL#TIPO_CORRELATIVO). */
  protected readonly tiposDocumento = signal<Parametria[]>([]);

  // ── Estado de la grilla ────────────────────────────────────────────────
  protected readonly rowsSignal = signal<Correlativo[]>([]);
  protected readonly page = signal<number>(1);
  protected readonly pageSize = signal<number>(10);

  // ── Filtros ────────────────────────────────────────────────────────────
  protected readonly filtroTipo = signal<string>('');
  protected readonly filtroFormato = signal<string>('');
  protected readonly filtroPeriodicidad = signal<string>('');
  protected readonly filtroActivo = signal<string>('');

  // ── Formulario (alta/edicion) ──────────────────────────────────────────
  protected readonly formOpen = signal<boolean>(false);
  protected readonly editId = signal<string | null>(null);
  protected readonly fIdOrganizacion = signal<string>('');
  protected readonly fIdTipoDocumento = signal<string>('');
  protected readonly fFormato = signal<string>('NUMERICO');
  protected readonly fLongitud = signal<string>('6');
  protected readonly fValorInicial = signal<string>('1');
  protected readonly fValorActual = signal<string>('0');
  protected readonly fIncremento = signal<string>('1');
  protected readonly fValorMaximo = signal<string>('');
  protected readonly fPrefijo = signal<string>('');
  protected readonly fSufijo = signal<string>('');
  protected readonly fPeriodicidad = signal<string>('NINGUNA');
  protected readonly fIsActivo = signal<string>('true');

  protected readonly total = computed(() => this.rowsFiltradas().length);
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  protected readonly rowKey = (row: JDataTableRow) => String((row as unknown as Correlativo).id);

  protected readonly rowsFiltradas = computed<Correlativo[]>(() => {
    const tipo = this.filtroTipo();
    const formato = this.filtroFormato();
    const period = this.filtroPeriodicidad();
    const activo = this.filtroActivo();
    return this.rowsSignal().filter((r) => {
      if (tipo && String(r.idTipoDocumento) !== tipo) return false;
      if (formato && r.formato !== formato) return false;
      if (period && r.periodicidad !== period) return false;
      if (activo === 'true' && !r.isActivo) return false;
      if (activo === 'false' && r.isActivo) return false;
      return true;
    });
  });

  protected readonly rowsPaginadas = computed<JDataTableRow[]>(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.rowsFiltradas().slice(start, start + this.pageSize()) as unknown as JDataTableRow[];
  });

  protected readonly formTitle = computed(() => (this.editId() ? 'Editar correlativo' : 'Nuevo correlativo'));

  /** Vista previa (cliente) del siguiente valor: (actual + incremento) con formato. */
  protected readonly preview = computed<string>(() => {
    const inc = Number(this.fIncremento() || 1);
    const act = Number(this.fValorActual() || 0);
    const sig = act + inc;
    let base = String(sig);
    if (this.fFormato() === 'CADENA_CEROS') {
      const l = Number(this.fLongitud() || 0);
      base = base.padStart(l, '0');
    }
    return `${this.fPrefijo() ?? ''}${base}${this.fSufijo() ?? ''}` || '-';
  });

  protected readonly columns: JDataTableColumn[] = [
    { key: 'tipoCodigo', header: 'Tipo documento', sortable: true, render: (v) => String(v ?? '-') },
    { key: 'formato', header: 'Formato', sortable: true },
    { key: 'longitud', header: 'Long.', align: 'right', render: (v) => String(v ?? '-') },
    { key: 'valorActual', header: 'Valor actual', align: 'right', render: (v) => String(v ?? 0) },
    { key: 'incremento', header: 'Incr.', align: 'right', render: (v) => String(v ?? 1) },
    { key: 'periodicidad', header: 'Periodicidad', sortable: true },
    { key: 'periodoActual', header: 'Periodo', render: (v) => String(v ?? '-') },
    { key: 'isActivo', header: 'Estado', render: (v) => (v ? 'Activo' : 'Inactivo') },
  ];

  // ── Setters desde el template ──────────────────────────────────────────
  protected onFiltroTipo(e: Event): void { this.filtroTipo.set((e.target as HTMLInputElement).value); this.page.set(1); }
  protected onFiltroFormato(e: Event): void { this.filtroFormato.set((e.target as HTMLSelectElement).value); this.page.set(1); }
  protected onFiltroPeriodicidad(e: Event): void { this.filtroPeriodicidad.set((e.target as HTMLSelectElement).value); this.page.set(1); }
  protected onFiltroActivo(e: Event): void { this.filtroActivo.set((e.target as HTMLSelectElement).value); this.page.set(1); }
  protected onResetFiltros(): void {
    this.filtroTipo.set(''); this.filtroFormato.set(''); this.filtroPeriodicidad.set(''); this.filtroActivo.set(''); this.page.set(1);
  }
  protected onPageChange(p: number): void { this.page.set(p); }

  protected set(signalName: 'idOrg' | 'idTipo' | 'formato' | 'longitud' | 'ini' | 'act' | 'inc' | 'max' | 'pre' | 'suf' | 'period' | 'activo', e: Event): void {
    const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
    switch (signalName) {
      case 'idOrg': this.fIdOrganizacion.set(value); break;
      case 'idTipo': this.fIdTipoDocumento.set(value); break;
      case 'formato': this.fFormato.set(value); break;
      case 'longitud': this.fLongitud.set(value); break;
      case 'ini': this.fValorInicial.set(value); break;
      case 'act': this.fValorActual.set(value); break;
      case 'inc': this.fIncremento.set(value); break;
      case 'max': this.fValorMaximo.set(value); break;
      case 'pre': this.fPrefijo.set(value); break;
      case 'suf': this.fSufijo.set(value); break;
      case 'period': this.fPeriodicidad.set(value); break;
      case 'activo': this.fIsActivo.set(value); break;
    }
  }

  protected nuevo(): void {
    this.editId.set(null);
    this.fIdOrganizacion.set(this.orgDefault());
    this.fIdTipoDocumento.set('');
    this.fFormato.set('NUMERICO'); this.fLongitud.set('6');
    this.fValorInicial.set('1'); this.fValorActual.set('0'); this.fIncremento.set('1');
    this.fValorMaximo.set(''); this.fPrefijo.set(''); this.fSufijo.set('');
    this.fPeriodicidad.set('NINGUNA'); this.fIsActivo.set('true');
    this.formOpen.set(true);
  }

  protected editar(row: Correlativo): void {
    this.editId.set(row.id);
    this.fIdOrganizacion.set(row.idOrganizacion ?? '');
    this.fIdTipoDocumento.set(String(row.idTipoDocumento ?? ''));
    this.fFormato.set(row.formato ?? 'NUMERICO');
    this.fLongitud.set(row.longitud != null ? String(row.longitud) : '');
    this.fValorInicial.set(row.valorInicial != null ? String(row.valorInicial) : '1');
    this.fValorActual.set(row.valorActual != null ? String(row.valorActual) : '0');
    this.fIncremento.set(row.incremento != null ? String(row.incremento) : '1');
    this.fValorMaximo.set(row.valorMaximo != null ? String(row.valorMaximo) : '');
    this.fPrefijo.set(row.prefijo ?? '');
    this.fSufijo.set(row.sufijo ?? '');
    this.fPeriodicidad.set(row.periodicidad ?? 'NINGUNA');
    this.fIsActivo.set(String(row.isActivo));
    this.formOpen.set(true);
  }

  protected onRowClick(event: { row: JDataTableRow; index: number }): void {
    this.editar(event.row as unknown as Correlativo);
  }

  protected cerrarForm(): void { this.formOpen.set(false); this.editId.set(null); }

  protected buildPayload(): Partial<Correlativo> {
    const num = (v: string): number | null => (v.trim() === '' ? null : Number(v));
    const str = (v: string): string | null => (v.trim() === '' ? null : v.trim());
    const payload: Partial<Correlativo> = {
      idOrganizacion: this.fIdOrganizacion().trim(),
      idTipoDocumento: Number(this.fIdTipoDocumento()),
      formato: this.fFormato(),
      longitud: num(this.fLongitud()),
      valorInicial: num(this.fValorInicial()),
      valorActual: num(this.fValorActual()),
      incremento: num(this.fIncremento()),
      valorMaximo: num(this.fValorMaximo()),
      prefijo: str(this.fPrefijo()),
      sufijo: str(this.fSufijo()),
      periodicidad: this.fPeriodicidad(),
      isActivo: this.fIsActivo() === 'true',
    };
    const id = this.editId();
    if (id) payload.id = id;
    return payload;
  }

  protected setRows(rows: Correlativo[]): void {
    this.rowsSignal.set(rows);
    if (this.page() > this.totalPages()) this.page.set(1);
  }

  protected setTipos(tipos: Parametria[]): void {
    this.tiposDocumento.set(tipos);
  }

  /** Sobrescrito por la Page para inyectar la org por defecto. */
  protected orgDefault(): string { return ''; }

  // ── Hooks sobrescritos por la Page (que inyecta ApiService) ─────────────
  protected load(): void { return; }
  protected guardar(): void { return; }
  protected eliminar(): void { return; }
}
