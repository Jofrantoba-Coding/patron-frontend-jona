import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  JBadge,
  JDataTable,
  JDialog,
  JPagination,
  JSectionHeading,
  JTabs,
  JTabsContent,
  JTabsList,
  JTabsTrigger,
  type JBadgeVariant,
  type JDataTableColumn,
  type JDataTableRow,
} from 'uijona-4ngular';
import type { OperacionDetalleRegistro, Paginated, PlanillaDetalleFull, PlanillaFiltro, PlanillaRow } from '../../core/models';

const NUM = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 });

type Registro = OperacionDetalleRegistro;
type DetalleTab = 'resumen' | 'archivo' | 'registros' | 'respuestas';

/** Etapas del ciclo de vida de una planilla (para el stepper del detalle). */
export const ETAPAS = ['GENERADA', 'VALIDADA', 'CIFRADA', 'ENVIADA', 'RESPUESTA_RECIBIDA', 'PROCESADA'] as const;

/** Catálogo BCP#TIPO_PRODUCTO#* → etiqueta legible. */
const PRODUCTO_LABEL: Record<string, string> = {
  T: 'Transferencias',
  C: 'CTS',
  CG: 'Cheque de Gerencia',
  FA: 'Factoring',
  H: 'Haberes',
  P: 'Proveedores',
};

/** Estados de planilla del catálogo GLOBAL#ESTADO_PLANILLA# (para el select del filtro). */
const ESTADOS_PLANILLA = [
  'GENERADA',
  'VALIDADA',
  'PENDIENTE_CIFRADO',
  'CIFRADA',
  'PENDIENTE_ENVIO',
  'ENVIADA',
  'RESPUESTA_RECIBIDA',
  'PROCESADA',
  'PROCESADA_PARCIAL',
  'RECHAZADA',
  'ERROR',
  'ERROR_CIFRADO',
];

const productoLabel = (codigo: unknown): string => {
  const c = codigo == null || codigo === '' ? '' : String(codigo);
  if (!c) return '-';
  return PRODUCTO_LABEL[c] ?? c;
};

const BADGE: Record<string, JBadgeVariant> = {
  GENERADA: 'secondary',
  VALIDADA: 'secondary',
  PENDIENTE_CIFRADO: 'outline',
  CIFRADA: 'default',
  PENDIENTE_ENVIO: 'outline',
  ENVIADA: 'default',
  RESPUESTA_RECIBIDA: 'default',
  PROCESADA: 'default',
  PROCESADA_PARCIAL: 'outline',
  RECHAZADA: 'destructive',
  ERROR: 'destructive',
  ERROR_CIFRADO: 'destructive',
  ANULADA: 'ghost',
  GENERADO: 'secondary',
  ENVIADO: 'default',
  CONFIRMADO: 'default',
  DEVUELTO: 'destructive',
};

@Component({
  selector: 'app-planillas-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, JBadge, JDialog, JTabs, JTabsList, JTabsTrigger, JTabsContent],
  templateUrl: './planillas-view.component.html',
})
export class PlanillasViewComponent {
  protected readonly rowsSignal = signal<PlanillaRow[]>([]);
  protected readonly page = signal<number>(1);
  protected readonly pageSize = signal<number>(10);
  protected readonly total = signal<number>(0);

  protected readonly filtroNombre = signal<string>('');
  protected readonly filtroSecuencial = signal<string>('');
  protected readonly filtroEstado = signal<string>('');
  protected readonly filtroMoneda = signal<string>('');

  protected readonly detalle = signal<PlanillaDetalleFull | null>(null);
  protected readonly detalleLoading = signal<string | null>(null);
  protected readonly detalleSeleccionado = signal<PlanillaRow | null>(null);
  protected readonly detalleTab = signal<DetalleTab>('resumen');

  protected readonly etapas = ETAPAS;
  protected readonly estadosPlanilla = ESTADOS_PLANILLA;

  protected readonly rows = computed<JDataTableRow[]>(() => this.rowsSignal() as unknown as JDataTableRow[]);
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  protected readonly rowKey = (row: JDataTableRow) => String((row as unknown as PlanillaRow).id);

  protected readonly detalleTitle = computed(() => this.detalleSeleccionado()?.nombreArchivo ?? 'Detalle de planilla');
  protected readonly detalleDescription = computed(() => {
    const p = this.detalleSeleccionado();
    if (!p) return '';
    return `${p.productoCodigo ?? '-'} · ${p.estadoPlanillaCodigo ?? '-'} · ${p.monedaCodigo ?? '-'} ${NUM.format(Number(p.montoTotal ?? 0))}`;
  });

  /** Índice de la etapa actual dentro del pipeline (para resaltar el stepper). */
  protected readonly etapaActual = computed(() => {
    const estado = this.pv(this.detalle()?.planilla, 'estadoPlanillaCodigo');
    const idx = ETAPAS.indexOf(estado as (typeof ETAPAS)[number]);
    return idx;
  });

  protected readonly columns: JDataTableColumn[] = [
    { key: 'nombreArchivo', header: 'Archivo', sortable: true },
    { key: 'secuencial', header: 'Sec.', sortable: true, align: 'center' },
    { key: 'entidadFinCodigo', header: 'Entidad', sortable: true, align: 'center' },
    { key: 'productoCodigo', header: 'Producto', sortable: true, render: (value) => productoLabel(value) },
    { key: 'cuentaCargo', header: 'Cuenta cargo', render: (value) => (value ? String(value) : '-') },
    { key: 'monedaCodigo', header: 'Mon.', align: 'center', render: (value) => String(value ?? '-') },
    { key: 'montoTotal', header: 'Monto', align: 'right', sortable: true, render: (value) => NUM.format(Number(value ?? 0)) },
    { key: 'totalOperaciones', header: 'Ops.', align: 'right', sortable: true, render: (value) => String(value ?? 0) },
    { key: 'estadoPlanillaCodigo', header: 'Estado', sortable: true },
    { key: 'fechaArchivo', header: 'F. archivo', sortable: true },
    { key: 'fechaEnvio', header: 'Envío', align: 'center', render: (value) => (value ? String(value) : 'No enviada') },
  ];

  protected badge(estado: string): JBadgeVariant {
    return BADGE[estado] ?? 'secondary';
  }

  protected num(value: unknown): string {
    return NUM.format(Number(value ?? 0));
  }

  protected onNombre(event: Event): void {
    this.filtroNombre.set((event.target as HTMLInputElement).value);
  }
  protected onSecuencial(event: Event): void {
    this.filtroSecuencial.set((event.target as HTMLInputElement).value);
  }
  protected onEstado(event: Event): void {
    this.filtroEstado.set((event.target as HTMLSelectElement).value);
  }
  protected onMoneda(event: Event): void {
    this.filtroMoneda.set((event.target as HTMLSelectElement).value);
  }

  protected onAplicarFiltros(): void {
    this.page.set(1);
    this.load();
  }
  protected onResetFiltros(): void {
    this.filtroNombre.set('');
    this.filtroSecuencial.set('');
    this.filtroEstado.set('');
    this.filtroMoneda.set('');
    this.page.set(1);
    this.load();
  }
  protected onPageChange(page: number): void {
    this.page.set(page);
    this.load();
  }
  protected onDetalleTab(tab: string): void {
    this.detalleTab.set(tab as DetalleTab);
  }
  protected onRowClick(event: { row: JDataTableRow; index: number }): void {
    this.openDetalle(event.row as unknown as PlanillaRow);
  }

  protected buildBackendFilters(): PlanillaFiltro {
    const filters: PlanillaFiltro = {};
    const nombre = this.filtroNombre().trim();
    const secuencial = this.filtroSecuencial().trim();
    const estado = this.filtroEstado().trim();
    const moneda = this.filtroMoneda().trim();
    if (nombre) filters.nombreArchivo = nombre;
    if (secuencial) filters.secuencial = secuencial;
    if (estado) filters.estadoPlanilla = estado;
    if (moneda) filters.moneda = moneda;
    return filters;
  }

  protected load(): void {
    return;
  }
  protected openDetalle(_planilla: PlanillaRow): void {
    return;
  }
  protected closeDetalle(): void {
    this.detalle.set(null);
    this.detalleLoading.set(null);
    this.detalleSeleccionado.set(null);
    this.detalleTab.set('resumen');
  }

  protected setPagedResult(result: Paginated<PlanillaRow>): void {
    this.rowsSignal.set(result.items);
    this.page.set(result.pagination.page);
    this.pageSize.set(result.pagination.pageSize);
    this.total.set(result.pagination.total);
  }
  protected setDetalle(detalle: PlanillaDetalleFull): void {
    this.detalle.set(detalle);
  }

  protected registros(detalle: PlanillaDetalleFull | null): Registro[] {
    return detalle?.detalles ?? [];
  }
  protected respuestas(detalle: PlanillaDetalleFull | null): Registro[] {
    return detalle?.respuestas ?? [];
  }
  protected contenidoTxt(detalle: PlanillaDetalleFull | null): string {
    const txt = this.pv(detalle?.planilla, 'contenidoTxt');
    return txt && txt !== '-' ? txt : '';
  }

  /** Lectura case-insensitive: la query nativa devuelve los alias en minúsculas. */
  private raw(record: Registro | null | undefined, key: string): unknown {
    if (!record) return undefined;
    return record[key] ?? record[key.toLowerCase()];
  }

  /** Valor escalar de un registro (Record) formateado como texto. */
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

  private bloque(row: Registro): Registro {
    const b = this.raw(row, 'bloqueOperacion');
    return b && typeof b === 'object' ? (b as Registro) : {};
  }

  /** Titular del beneficiario tomado del snapshot bloqueOperacion. */
  protected regBeneficiario(row: Registro): string {
    const b = this.bloque(row);
    const ben = b['beneficiario'];
    const obj = ben && typeof ben === 'object' ? (ben as Registro) : {};
    return this.pv(obj, 'titular');
  }
  protected regMonto(row: Registro): string {
    return this.pnum(this.bloque(row), 'montoTotal');
  }
  protected regCodigo(row: Registro): string {
    return this.pv(this.bloque(row), 'codigoOperacion');
  }
  protected regDevolucion(row: Registro): string {
    const cod = this.pv(row, 'codigoDevolucionCodigo');
    const glosa = this.pv(row, 'glosaDevolucion');
    if (cod === '-' && glosa === '-') return '-';
    return [cod === '-' ? '' : cod, glosa === '-' ? '' : glosa].filter(Boolean).join(' · ');
  }

  private ben(row: Registro): Registro {
    const b = this.bloque(row)['beneficiario'];
    return b && typeof b === 'object' ? (b as Registro) : {};
  }
  private cta(row: Registro): Registro {
    const b = this.bloque(row)['cuenta'];
    return b && typeof b === 'object' ? (b as Registro) : {};
  }
  /** Tipo + número de documento del beneficiario (snapshot). */
  protected regDocumento(row: Registro): string {
    const ben = this.ben(row);
    const tipo = this.pv(ben, 'tipoDocumento');
    const num = this.pv(ben, 'numeroDocumento');
    if (tipo === '-' && num === '-') return '-';
    return `${tipo === '-' ? '' : tipo} ${num === '-' ? '' : num}`.trim();
  }
  /** Entidad + tipo + número de cuenta destino (snapshot). */
  protected regCuenta(row: Registro): string {
    const c = this.cta(row);
    const partes = [
      this.pv(c, 'entidadFinancieraDestino'),
      this.pv(c, 'tipoCuenta'),
      this.pv(c, 'numeroCuenta'),
    ].filter((v) => v !== '-');
    return partes.length ? partes.join(' ') : '-';
  }
  protected regEmail(row: Registro): string {
    return this.pv(this.ben(row), 'email');
  }
  protected regReferencia(row: Registro): string {
    return this.pv(this.bloque(row), 'referenciaOrigen');
  }

  /** Lee un campo del jsonb atributos de la cabecera (p.ej. idCarga). */
  protected atributoPlanilla(detalle: PlanillaDetalleFull | null, key: string): string {
    const a = this.raw(detalle?.planilla, 'atributos');
    const obj = a && typeof a === 'object' ? (a as Registro) : {};
    return this.pv(obj, key);
  }
  protected urlPlanilla(detalle: PlanillaDetalleFull | null, key: string): string {
    const v = this.pv(detalle?.planilla, key);
    return v === '-' ? '' : v;
  }
  protected cifrado(detalle: PlanillaDetalleFull | null): boolean {
    return this.urlPlanilla(detalle, 'urlCifrado') !== '';
  }

  /** Campos de cabecera mostrados en la pestaña Resumen. */
  protected resumenCampos(detalle: PlanillaDetalleFull | null): { label: string; value: string }[] {
    const p = detalle?.planilla;
    if (!p) return [];
    return [
      { label: 'Producto', value: productoLabel(this.pv(p, 'productoCodigo')) },
      { label: 'Formato', value: this.pv(p, 'formatoCodigo') },
      { label: 'Modalidad', value: this.pv(p, 'modalidadCodigo') },
      { label: 'Estado', value: this.pv(p, 'estadoPlanillaCodigo') },
      { label: 'Moneda', value: this.pv(p, 'monedaCodigo') },
      { label: 'Monto total', value: this.pnum(p, 'montoTotal') },
      { label: 'Total operaciones', value: this.pv(p, 'totalOperaciones') },
      { label: 'Cuenta cargo', value: this.pv(p, 'cuentaCargo') },
      { label: 'Checksum', value: this.pv(p, 'checksum') },
      { label: 'Secuencial', value: this.pv(p, 'secuencial') },
      { label: 'Fecha archivo', value: this.pv(p, 'fechaArchivo') },
      { label: 'Fecha envío', value: this.pv(p, 'fechaEnvio') },
      { label: 'Reintentos', value: this.pv(p, 'reintentos') },
      { label: 'Flujo PAR', value: this.pv(p, 'isFlujoPar') },
    ].filter((campo) => campo.value !== '-');
  }
}
