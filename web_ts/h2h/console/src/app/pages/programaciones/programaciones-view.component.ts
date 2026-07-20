import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  JBadge,
  JDataTable,
  JDialog,
  JPagination,
  JSectionHeading,
  type JBadgeVariant,
  type JDataTableColumn,
  type JDataTableRow,
} from 'uijona-4ngular';
import { OperacionDetalleDialog } from '../../shared/operacion-detalle-dialog';
import type {
  Operacion,
  OperacionDetalle,
  OperacionDetalleRegistro,
  Paginated,
  ProductoGrupo,
  ProgramacionCrear,
  ProgramacionDetalleFull,
  ProgramacionFiltro,
  ProgramacionRow,
} from '../../core/models';

const NUM = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 });
// timestamptz (prg_dt_programado / prg_dt_ejecutado) -> fecha + hora:min:seg
const FDT = new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'medium', hour12: false });
// date (prg_d_fecha_proceso) -> solo fecha
const FD = new Intl.DateTimeFormat('es-PE', { dateStyle: 'short' });

type Registro = OperacionDetalleRegistro;

/** Opción de catálogo (parametría) para los selects de producto/moneda. */
export interface OpcionCatalogo {
  id: number;
  codigo: string;
  abreviatura: string;
  label: string;
}

export const ESTADOS_PROGRAMACION = ['ABIERTA', 'PROGRAMADA', 'GENERADA', 'ENVIADA', 'RESPONDIDA', 'ERROR', 'CANCELADA'];
export const TIPOS_DESTINO = ['INTERBANCARIA', 'TERCEROS', 'CUENTA_PROPIA'];
export const CANALES = ['CCE', 'BCR', 'INTERNO'];
export const MODOS = ['AUTOMATICO', 'MANUAL'];

/** Abreviatura BCP#TIPO_PRODUCTO#* → grupo de operaciones para filtrar la tabla. */
const GRUPO_POR_PRODUCTO: Record<string, ProductoGrupo> = {
  P: 'pagos_masivos',
  C: 'pagos_masivos',
  CG: 'pagos_masivos',
  H: 'pagos_masivos',
  T: 'transferencias',
  FA: 'factoring',
};

const BADGE: Record<string, JBadgeVariant> = {
  ABIERTA: 'outline',
  PROGRAMADA: 'secondary',
  GENERADA: 'default',
  ENVIADA: 'default',
  RESPONDIDA: 'default',
  ERROR: 'destructive',
  CANCELADA: 'ghost',
  PLANIFICADO: 'secondary',
  GENERADO: 'default',
  ENVIADO: 'default',
  RESPONDIDO: 'default',
  EXCLUIDO: 'ghost',
  AUTOMATICO: 'default',
  MANUAL: 'outline',
};

@Component({
  selector: 'app-programaciones-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, JBadge, JDialog, OperacionDetalleDialog],
  templateUrl: './programaciones-view.component.html',
})
export class ProgramacionesViewComponent {
  protected readonly rowsSignal = signal<ProgramacionRow[]>([]);
  protected readonly page = signal<number>(1);
  protected readonly pageSize = signal<number>(10);
  protected readonly total = signal<number>(0);

  protected readonly filtroCodigo = signal<string>('');
  protected readonly filtroEstado = signal<string>('');
  protected readonly filtroModo = signal<string>('');
  protected readonly filtroTipoDestino = signal<string>('');
  protected readonly filtroMoneda = signal<string>('');

  protected readonly detalle = signal<ProgramacionDetalleFull | null>(null);
  protected readonly detalleLoading = signal<string | null>(null);
  protected readonly detalleSeleccionado = signal<ProgramacionRow | null>(null);

  // Detalle de una operación (beneficiario, cuenta, ítems, contabilidad)
  protected readonly opDetalle = signal<OperacionDetalle | null>(null);
  protected readonly opDetalleLoading = signal<string | null>(null);

  // Diálogo de creación
  protected readonly crearOpen = signal<boolean>(false);
  protected readonly crearGuardando = signal<boolean>(false);
  protected readonly crearError = signal<string>('');
  protected readonly nuevoIdProducto = signal<string>('');
  protected readonly nuevoIdMoneda = signal<string>('');
  protected readonly nuevoFechaProceso = signal<string>('');
  protected readonly nuevoFechaProgramado = signal<string>('');
  protected readonly nuevoModo = signal<string>('MANUAL');
  protected readonly nuevoTipoDestino = signal<string>('');
  protected readonly nuevoCanal = signal<string>('');

  // Catálogos y selección de operaciones
  protected readonly productosOpc = signal<OpcionCatalogo[]>([]);
  protected readonly monedasOpc = signal<OpcionCatalogo[]>([]);
  protected readonly opsRows = signal<Operacion[]>([]);
  protected readonly opsCargando = signal<boolean>(false);
  protected readonly loteFiltro = signal<string>('');
  protected readonly seleccion = signal<Set<string>>(new Set());

  protected readonly estados = ESTADOS_PROGRAMACION;
  protected readonly tiposDestino = TIPOS_DESTINO;
  protected readonly canales = CANALES;
  protected readonly modos = MODOS;

  protected readonly rows = computed<JDataTableRow[]>(() => this.rowsSignal() as unknown as JDataTableRow[]);
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  protected readonly rowKey = (row: JDataTableRow) => String((row as unknown as ProgramacionRow).id);

  protected readonly detalleTitle = computed(() => this.detalleSeleccionado()?.codigo ?? 'Detalle del plan');
  protected readonly detalleDescription = computed(() => {
    const p = this.detalleSeleccionado();
    if (!p) return '';
    return `${p.productoCodigo ?? '-'} · ${p.estadoCodigo ?? '-'} · ${p.modoEnvio ?? '-'} · ${p.monedaCodigo ?? '-'} ${NUM.format(Number(p.montoTotal ?? 0))}`;
  });

  /** Abreviatura y código de la moneda seleccionada (para filtrar las operaciones). */
  protected readonly productoAbrevSel = computed(() => {
    const id = Number(this.nuevoIdProducto());
    return this.productosOpc().find((o) => o.id === id)?.abreviatura ?? '';
  });
  protected readonly monedaCodigoSel = computed(() => {
    const id = Number(this.nuevoIdMoneda());
    return this.monedasOpc().find((o) => o.id === id)?.abreviatura ?? '';
  });

  /** Lotes de ingesta presentes en las operaciones cargadas (para el select de filtro). */
  protected readonly lotesOpc = computed(() => {
    const conteo = new Map<string, number>();
    for (const op of this.opsRows()) {
      const carga = op.idCarga ? String(op.idCarga) : '';
      if (!carga) continue;
      conteo.set(carga, (conteo.get(carga) ?? 0) + 1);
    }
    return Array.from(conteo.entries()).map(([id, count]) => ({ id, count }));
  });

  /** Operaciones mostradas: filtradas por el lote seleccionado (si hay). */
  protected readonly opsFiltradas = computed(() => {
    const lote = this.loteFiltro();
    const rows = this.opsRows();
    if (!lote) return rows;
    return rows.filter((op) => String(op.idCarga ?? '') === lote);
  });
  protected readonly seleccionCount = computed(() => this.seleccion().size);

  protected readonly columns: JDataTableColumn[] = [
    { key: 'codigo', header: 'Código', sortable: true },
    { key: 'productoCodigo', header: 'Producto', sortable: true, render: (v) => String(v ?? '-') },
    { key: 'tipoDestino', header: 'Destino', align: 'center', render: (v) => String(v ?? '-') },
    { key: 'canalLiquidacion', header: 'Canal', align: 'center', render: (v) => String(v ?? '-') },
    { key: 'modoEnvio', header: 'Modo', align: 'center' },
    { key: 'monedaCodigo', header: 'Mon.', align: 'center', render: (v) => String(v ?? '-') },
    { key: 'montoTotal', header: 'Monto', align: 'right', sortable: true, render: (v) => NUM.format(Number(v ?? 0)) },
    { key: 'totalOperaciones', header: 'Ops.', align: 'right', sortable: true, render: (v) => String(v ?? 0) },
    { key: 'estadoCodigo', header: 'Estado', sortable: true },
    { key: 'fechaProceso', header: 'F. proceso', sortable: true, render: (v) => this.fd(v) },
    { key: 'fechaProgramado', header: 'Programado', align: 'center', render: (v) => this.fdt(v) },
  ];

  protected badge(estado: string): JBadgeVariant {
    return BADGE[estado] ?? 'secondary';
  }
  protected num(value: unknown): string {
    return NUM.format(Number(value ?? 0));
  }
  protected grupoProducto(abrev: string): ProductoGrupo | undefined {
    return GRUPO_POR_PRODUCTO[abrev];
  }

  protected onCodigo(event: Event): void {
    this.filtroCodigo.set((event.target as HTMLInputElement).value);
  }
  protected onEstado(event: Event): void {
    this.filtroEstado.set((event.target as HTMLSelectElement).value);
  }
  protected onModo(event: Event): void {
    this.filtroModo.set((event.target as HTMLSelectElement).value);
  }
  protected onTipoDestino(event: Event): void {
    this.filtroTipoDestino.set((event.target as HTMLSelectElement).value);
  }
  protected onMoneda(event: Event): void {
    this.filtroMoneda.set((event.target as HTMLSelectElement).value);
  }

  protected onAplicarFiltros(): void {
    this.page.set(1);
    this.load();
  }
  protected onResetFiltros(): void {
    this.filtroCodigo.set('');
    this.filtroEstado.set('');
    this.filtroModo.set('');
    this.filtroTipoDestino.set('');
    this.filtroMoneda.set('');
    this.page.set(1);
    this.load();
  }
  protected onPageChange(page: number): void {
    this.page.set(page);
    this.load();
  }
  protected onRowClick(event: { row: JDataTableRow; index: number }): void {
    this.openDetalle(event.row as unknown as ProgramacionRow);
  }

  protected buildBackendFilters(): ProgramacionFiltro {
    const filters: ProgramacionFiltro = {};
    const codigo = this.filtroCodigo().trim();
    const estado = this.filtroEstado().trim();
    const modo = this.filtroModo().trim();
    const destino = this.filtroTipoDestino().trim();
    const moneda = this.filtroMoneda().trim();
    if (codigo) filters.codigo = codigo;
    if (estado) filters.estado = estado;
    if (modo) filters.modoEnvio = modo;
    if (destino) filters.tipoDestino = destino;
    if (moneda) filters.moneda = moneda;
    return filters;
  }

  // ── crear ────────────────────────────────────────────────────────────
  protected onNuevoIdProducto(e: Event): void {
    this.nuevoIdProducto.set((e.target as HTMLSelectElement).value);
    this.opsRows.set([]);
    this.seleccion.set(new Set());
    this.loteFiltro.set('');
  }
  protected onNuevoIdMoneda(e: Event): void {
    this.nuevoIdMoneda.set((e.target as HTMLSelectElement).value);
    this.opsRows.set([]);
    this.seleccion.set(new Set());
    this.loteFiltro.set('');
  }
  protected onNuevoFechaProceso(e: Event): void {
    this.nuevoFechaProceso.set((e.target as HTMLInputElement).value);
  }
  protected onNuevoFechaProgramado(e: Event): void {
    this.nuevoFechaProgramado.set((e.target as HTMLInputElement).value);
  }
  protected onNuevoModo(e: Event): void {
    this.nuevoModo.set((e.target as HTMLSelectElement).value);
  }
  protected onNuevoTipoDestino(e: Event): void {
    this.nuevoTipoDestino.set((e.target as HTMLSelectElement).value);
  }
  protected onNuevoCanal(e: Event): void {
    this.nuevoCanal.set((e.target as HTMLSelectElement).value);
  }
  protected onLoteFiltro(e: Event): void {
    this.loteFiltro.set((e.target as HTMLSelectElement).value);
  }

  protected abrirCrear(): void {
    this.crearError.set('');
    this.opsRows.set([]);
    this.seleccion.set(new Set());
    this.loteFiltro.set('');
    this.crearOpen.set(true);
    this.cargarCatalogos();
  }
  protected cerrarCrear(): void {
    this.crearOpen.set(false);
    this.crearGuardando.set(false);
  }

  protected isSel(id: string): boolean {
    return this.seleccion().has(id);
  }
  protected toggleOp(id: string): void {
    const s = new Set(this.seleccion());
    if (s.has(id)) s.delete(id);
    else s.add(id);
    this.seleccion.set(s);
  }
  /** Marca/desmarca todas las operaciones visibles (según el filtro de lote). */
  protected toggleTodas(): void {
    const visibles = this.opsFiltradas().map((op) => op.id);
    const s = new Set(this.seleccion());
    const todasMarcadas = visibles.length > 0 && visibles.every((id) => s.has(id));
    for (const id of visibles) {
      if (todasMarcadas) s.delete(id);
      else s.add(id);
    }
    this.seleccion.set(s);
  }

  protected buildCrearPayload(): ProgramacionCrear | null {
    const idProducto = Number(this.nuevoIdProducto());
    const idMoneda = Number(this.nuevoIdMoneda());
    const fechaProceso = this.nuevoFechaProceso().trim();
    const operaciones = Array.from(this.seleccion());
    if (!Number.isFinite(idProducto) || idProducto <= 0 || !Number.isFinite(idMoneda) || idMoneda <= 0) {
      this.crearError.set('Seleccione producto y moneda.');
      return null;
    }
    if (!fechaProceso) {
      this.crearError.set('La fecha de proceso es obligatoria.');
      return null;
    }
    if (operaciones.length === 0) {
      this.crearError.set('Seleccione al menos una operación para el plan.');
      return null;
    }
    const payload: ProgramacionCrear = { idProducto, idMoneda, fechaProceso, modoEnvio: this.nuevoModo(), operaciones };
    if (this.nuevoTipoDestino()) payload.tipoDestino = this.nuevoTipoDestino();
    if (this.nuevoCanal()) payload.canalLiquidacion = this.nuevoCanal();
    // datetime-local (hora local, sin zona) -> ISO con offset que acepta OffsetDateTime en el backend
    const programado = this.nuevoFechaProgramado().trim();
    if (programado) {
      const d = new Date(programado);
      if (!Number.isNaN(d.getTime())) payload.fechaProgramado = d.toISOString();
    }
    return payload;
  }

  // Hooks sobrescritos por la Impl
  protected load(): void {
    return;
  }
  protected openDetalle(_p: ProgramacionRow): void {
    return;
  }
  protected guardarNuevo(): void {
    return;
  }
  protected cambiarEstado(_estado: string): void {
    return;
  }
  protected generar(): void {
    return;
  }
  protected quitarOperacion(_idOperacion: string): void {
    return;
  }
  protected cargarCatalogos(): void {
    return;
  }
  protected buscarOperaciones(): void {
    return;
  }
  protected abrirOpDetalle(_idOperacion: string): void {
    return;
  }

  protected cerrarOpDetalle(): void {
    this.opDetalle.set(null);
    this.opDetalleLoading.set(null);
  }
  protected setOpDetalle(d: OperacionDetalle): void {
    this.opDetalle.set(d);
  }

  protected closeDetalle(): void {
    this.detalle.set(null);
    this.detalleLoading.set(null);
    this.detalleSeleccionado.set(null);
  }

  protected setPagedResult(result: Paginated<ProgramacionRow>): void {
    this.rowsSignal.set(result.items);
    this.page.set(result.pagination.page);
    this.pageSize.set(result.pagination.pageSize);
    this.total.set(result.pagination.total);
  }
  protected setDetalle(detalle: ProgramacionDetalleFull): void {
    this.detalle.set(detalle);
  }

  protected operaciones(detalle: ProgramacionDetalleFull | null): Registro[] {
    return detalle?.detalles ?? [];
  }

  /** Lectura case-insensitive (la query nativa devuelve alias en minúsculas). */
  private raw(record: Registro | null | undefined, key: string): unknown {
    if (!record) return undefined;
    return record[key] ?? record[key.toLowerCase()];
  }
  protected pv(record: Registro | null | undefined, key: string): string {
    const value = this.raw(record, key);
    if (value === null || value === undefined || value === '') return '-';
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    return String(value);
  }
  protected pnum(record: Registro | null | undefined, key: string): string {
    const value = this.raw(record, key);
    if (value === null || value === undefined || value === '') return '-';
    return NUM.format(Number(value));
  }

  /** Formatea un timestamp (con hora:min:seg). Usar para columnas *_dt_ (timestamptz). */
  protected fdt(value: unknown): string {
    if (value === null || value === undefined || value === '') return '-';
    const d = new Date(String(value));
    return Number.isNaN(d.getTime()) ? String(value) : FDT.format(d);
  }
  /** Formatea una fecha (sin hora). Usar para columnas *_d_ tipo date. */
  protected fd(value: unknown): string {
    if (value === null || value === undefined || value === '') return '-';
    const s = String(value);
    const d = new Date(s.length <= 10 ? `${s}T00:00:00` : s);
    return Number.isNaN(d.getTime()) ? s : FD.format(d);
  }
  /** Lee y formatea un timestamp de un registro. */
  protected pdt(record: Registro | null | undefined, key: string): string {
    return this.fdt(this.raw(record, key));
  }
  /** Lee y formatea una fecha de un registro. */
  protected pdate(record: Registro | null | undefined, key: string): string {
    return this.fd(this.raw(record, key));
  }

  /** Campos de cabecera para la pestaña Resumen del detalle. */
  protected resumenCampos(detalle: ProgramacionDetalleFull | null): { label: string; value: string }[] {
    const p = detalle?.programacion;
    if (!p) return [];
    return [
      { label: 'Código', value: this.pv(p, 'codigo') },
      { label: 'Producto', value: this.pv(p, 'productoCodigo') },
      { label: 'Tipo destino', value: this.pv(p, 'tipoDestino') },
      { label: 'Canal', value: this.pv(p, 'canalLiquidacion') },
      { label: 'Modo', value: this.pv(p, 'modoEnvio') },
      { label: 'Estado', value: this.pv(p, 'estadoCodigo') },
      { label: 'Moneda', value: this.pv(p, 'monedaCodigo') },
      { label: 'Monto total', value: this.pnum(p, 'montoTotal') },
      { label: 'Total operaciones', value: this.pv(p, 'totalOperaciones') },
      { label: 'Fecha proceso', value: this.pdate(p, 'fechaProceso') },
      { label: 'Programado', value: this.pdt(p, 'fechaProgramado') },
      { label: 'Ejecutado', value: this.pdt(p, 'fechaEjecutado') },
      { label: 'Planilla generada', value: this.pv(p, 'idPlanilla') },
    ].filter((campo) => campo.value !== '-');
  }
}
