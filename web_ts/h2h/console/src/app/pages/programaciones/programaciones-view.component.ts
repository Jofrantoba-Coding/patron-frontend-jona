import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal } from '@angular/core';
import {
  JBadge,
  JDataTable,
  JDatePicker,
  JDialog,
  JPagination,
  JSectionHeading,
  type JBadgeVariant,
  type JDataTableColumn,
  type JDataTableRow,
} from 'uijona-4ngular';
import { OperacionDetalleDialog } from '../../shared/operacion-detalle-dialog';
import { siguientePasoProgramacion } from './inter-programaciones';
import type {
  ConversionProducto,
  DiaVentana,
  Operacion,
  OperacionDetalle,
  OperacionDetalleRegistro,
  Paginated,
  ProductoGrupo,
  ProgramacionCrear,
  ProgramacionDetalleFull,
  ProgramacionFiltro,
  ProgramacionRow,
  VentanaSemanal,
} from '../../core/models';
import { instanteDeBackendAHoraDePared } from '../../core/zona-horaria';

const NUM = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 });
// timestamptz (prg_dt_programado / prg_dt_ejecutado) -> fecha + hora:min:seg
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

/**
 * Transiciones que la consola puede pedir, por estado de origen. Espejo de `TRANSICIONES_OPERADOR`
 * en `ProcessProgramacionEnvio`.
 *
 * <p>Es una copia deliberada, no la autoridad: el backend valida igual, porque el endpoint se puede
 * llamar sin pasar por aquí. Esto solo evita ofrecer un botón que va a fallar —hasta ahora
 * «Cancelar» aparecía incluso en un plan RESPONDIDA, y el backend lo aceptaba—.</p>
 *
 * <p>`GENERADA`, `ENVIADA` y `RESPONDIDA` no listan nada: sus transiciones las escribe el sistema
 * con su propia evidencia. Cancelar un plan ya generado se hace anulando su planilla.</p>
 */
export const ACCIONES_POR_ESTADO: Record<string, string[]> = {
  ABIERTA: ['PROGRAMADA', 'CANCELADA'],
  PROGRAMADA: ['CANCELADA'],
  ERROR: ['PROGRAMADA', 'CANCELADA'],
  GENERADA: [],
  ENVIADA: [],
  RESPONDIDA: [],
  CANCELADA: [],
};

/**
 * Estados desde los que tiene sentido materializar la planilla. Es una lista aparte de
 * `ACCIONES_POR_ESTADO` porque generar no es un cambio de estado que pida el operador: lo escribe el
 * gatillado, y el estado resultante (`GENERADA`) no está en la lista blanca.
 */
export const ESTADOS_GENERABLES = ['ABIERTA', 'PROGRAMADA', 'ERROR'];

/** Por qué no se puede cancelar desde ciertos estados. Se muestra como `title` del botón inhabilitado. */
export const MOTIVO_SIN_CANCELAR: Record<string, string> = {
  GENERADA: 'Ya hay una planilla generada: anúlela desde la planilla, esa vía sí libera las operaciones.',
  ENVIADA: 'El archivo ya está en el banco. Espere su respuesta.',
  RESPONDIDA: 'El banco ya respondió y las operaciones están conciliadas.',
  CANCELADA: 'El plan ya está cancelado.',
};
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
  imports: [JSectionHeading, JDataTable, JPagination, JBadge, JDialog, JDatePicker, OperacionDetalleDialog],
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

  /**
   * Motivo por el que el backend rechazó la última acción sobre el plan.
   *
   * <p><b>Por qué existe.</b> Estas acciones se suscribían solo con `next`, así que un rechazo del
   * backend no se veía en ninguna parte: el botón parecía no hacer nada. Y los mensajes del dominio
   * no son un «no permitido» seco —dicen cuál es la vía alternativa: «anule la planilla, esa vía sí
   * libera las operaciones»—, que es justo lo que el operador necesita para saber qué hacer.</p>
   */
  protected readonly accionError = signal<string>('');

  /**
   * Mensaje del envelope ALMIL, con reserva.
   *
   * <p>Mismo orden que en el resto de la consola: primero el detalle por campo, luego el mensaje
   * general y, si no hay ninguno —una caída de red no trae envelope—, el texto por defecto.</p>
   */
  protected mensajeError(err: unknown, porDefecto: string): string {
    const e = err as { error?: { message?: string; errors?: { message?: string }[] } };
    return e?.error?.errors?.[0]?.message ?? e?.error?.message ?? porDefecto;
  }
  protected readonly nuevoIdProducto = signal<string>('');
  protected readonly nuevoIdMoneda = signal<string>('');
  protected readonly nuevoFechaProceso = signal<string>('');
  protected readonly nuevoFechaProgramado = signal<string>('');
  protected readonly nuevoModo = signal<string>('MANUAL');
  /**
   * Canal de salida del plan nuevo. Por defecto H2H: es el camino de siempre y el que el job
   * sabe llevar solo. H2W se elige cuando ya se sabe que ese lote se sube a mano al portal.
   */
  protected readonly nuevoModalidad = signal<string>('H2H');
  /**
   * Producto con el que saldrá el plan nuevo. Igual que en el diálogo de canal, arranca en
   * `MANTENER`: convertir anula las operaciones seleccionadas y revierte sus asientos.
   */
  protected readonly nuevoConversion = signal<ConversionProducto>('MANTENER');
  protected readonly nuevoTipoDestino = signal<string>('');
  protected readonly nuevoCanal = signal<string>('');

  // Catálogos y selección de operaciones
  protected readonly productosOpc = signal<OpcionCatalogo[]>([]);
  protected readonly monedasOpc = signal<OpcionCatalogo[]>([]);
  protected readonly opsRows = signal<Operacion[]>([]);
  protected readonly opsCargando = signal<boolean>(false);
  protected readonly loteFiltro = signal<string>('');
  protected readonly seleccion = signal<Set<string>>(new Set());

  // ── Cambio de canal sobre un plan ya creado (contingencia) ─────────────
  protected readonly modalidadOpen = signal<boolean>(false);
  protected readonly modalidadDestino = signal<'H2H' | 'H2W'>('H2W');
  protected readonly modalidadPlan = signal<ProgramacionRow | null>(null);

  /**
   * Fecha de proceso con la que se reprograma el lote al cambiar de canal.
   *
   * <p>No es un extra del formulario: a H2W se llega casi siempre porque el camino automático
   * falló, y para entonces la fecha del plan suele estar vencida. El TXT la lleva en el nombre y en
   * la cabecera, así que sin moverla el archivo sale caducado y el banco lo rechaza —lo suba un job
   * o una persona—.</p>
   */
  protected readonly modalidadFecha = signal<string>('');

  /**
   * Hoy en la zona del CANAL, en `yyyy-MM-dd`.
   *
   * <p>Con la del navegador, un operador en otro huso vería un mínimo distinto del que aplica el
   * backend y el formulario aceptaría una fecha que luego se rechaza —o al revés—. `en-CA` rinde
   * exactamente `yyyy-MM-dd`, que es lo que espera un `input type="date"`.</p>
   */
  protected readonly hoyCanal = computed<string>(() =>
    new Intl.DateTimeFormat('en-CA', {
      timeZone: this.ventana()?.zonaHoraria ?? 'America/Lima',
    }).format(new Date())
  );

  /**
   * Abre el cambio de canal. Propone el canal CONTRARIO al actual, que es lo que se viene a
   * hacer: nadie abre este dialogo para dejar el plan como estaba.
   */
  protected abrirModalidad(plan: ProgramacionRow): void {
    this.modalidadPlan.set(plan);
    this.modalidadDestino.set(
      String(plan.modalidadCodigo ?? 'H2H').toUpperCase() === 'H2W' ? 'H2H' : 'H2W'
    );
    // Se propone la del plan mientras siga sirviendo; si ya venció, hoy —el mínimo que el banco
    // aceptaría—, para que el operador no tenga que calcularlo ni topar con el rechazo después.
    const suya = this.fechaProcesoDe(plan);
    this.modalidadFecha.set(suya && suya >= this.hoyCanal() ? suya : this.hoyCanal());
    this.accionError.set('');
    // Cada apertura parte de MANTENER: convertir anula operaciones y revierte asientos, y heredar
    // esa eleccion del diálogo anterior seria la forma de convertir un plan sin querer.
    this.modalidadConversion.set('MANTENER');
    this.modalidadOpen.set(true);
  }

  protected cerrarModalidad(): void {
    this.modalidadOpen.set(false);
  }

  protected onModalidadDestino(event: Event): void {
    this.modalidadDestino.set((event.target as HTMLSelectElement).value as 'H2H' | 'H2W');
  }

  protected onModalidadFecha(event: Event): void {
    this.modalidadFecha.set((event.target as HTMLInputElement).value);
  }

  /**
   * Producto con el que saldrá el plan. Arranca siempre en `MANTENER`: convertir anula las
   * operaciones originales y revierte sus asientos, así que tiene que ser una elección explícita
   * y no algo que quede pegado del diálogo anterior.
   */
  protected readonly modalidadConversion = signal<ConversionProducto>('MANTENER');

  protected onModalidadConversion(event: Event): void {
    this.modalidadConversion.set(
      (event.target as HTMLSelectElement).value as ConversionProducto
    );
  }

  /**
   * ¿Se ofrece convertir a pago masivo de proveedores?
   *
   * <p>Solo al ir al portal web y solo si TODAS las operaciones del plan son transferencias a
   * terceros. El backend lo rechaza todo o nada, así que ofrecerlo sobre un plan mixto sería
   * ofrecer un botón que solo puede fallar.</p>
   */
  protected readonly conversionDisponible = computed<boolean>(() => {
    if (this.modalidadDestino() !== 'H2W') return false;
    const ops = this.operaciones(this.detalle());
    if (!ops.length) return false;
    return ops.every(
      (op) =>
        String(this.raw(op, 'tipoOperacionCodigo') ?? '').toUpperCase() ===
        'TRANSFERENCIA_TERCEROS'
    );
  });

  /** `fechaProceso` de un plan como `yyyy-MM-dd`, o `''`. El backend puede mandarla con hora. */
  private fechaProcesoDe(plan: ProgramacionRow | null): string {
    return String(plan?.fechaProceso ?? '').slice(0, 10);
  }

  /** Motivo por el que la fecha elegida no vale, o `null`. Espejo de lo que valida el backend. */
  /**
   * Por qué este plan NO puede cambiar de canal, o `null` si puede.
   *
   * <p>La regla es del backend y aquí solo se anticipa: un plan que ya generó planilla no cambia de
   * canal. Los dos canales no comparten archivo —H2H envía el TXT cifrado por SFTP, H2W lo sube una
   * persona en claro al portal del banco—, así que el archivo ya hecho no sirve para el otro.</p>
   *
   * <p>Se comprueba en la consola porque antes no se comprobaba en ninguna parte del frontend: el
   * botón salía habilitado, el operador lo pulsaba y el rechazo llegaba del servidor. La guarda de
   * verdad sigue estando en el dominio; esto solo evita ofrecer algo imposible.</p>
   */
  protected readonly motivoNoCambiaCanal = computed<string | null>(() => {
    const plan = this.modalidadPlan();
    if (!plan) return null;
    if (!plan.idPlanilla) return null;
    return 'Este plan ya generó su planilla, y el archivo pertenece al canal con el que se creó.'
      + ' Anule la planilla para liberar sus operaciones y cree un plan nuevo en el otro canal.';
  });

  protected readonly motivoFechaModalidad = computed<string | null>(() => {
    const fecha = this.modalidadFecha();
    if (!fecha) return 'Indique la fecha de proceso.';
    if (fecha < this.hoyCanal()) {
      return `La fecha de proceso no puede ser anterior a hoy (${this.hoyCanal()}): el archivo saldría caducado.`;
    }
    return null;
  });

  /** ¿La fecha propuesta cambia la que tiene el plan? Si no, no se manda y no se reescribe nada. */
  protected readonly modalidadFechaCambia = computed<boolean>(
    () => this.modalidadFecha() !== this.fechaProcesoDe(this.modalidadPlan())
  );

  /**
   * Aviso sobre la fecha del plan abierto, o `null` si está en regla.
   *
   * <p>Va junto al botón de generar porque es ahí donde importa: el rechazo por fecha vencida llega
   * al pulsarlo, y sin este aviso el operador solo ve un error sin saber que lo que falta es
   * cambiar la fecha —ni desde dónde—.</p>
   */
  protected readonly avisoFechaPlanVencida = computed<string | null>(() => {
    const fecha = this.fechaProcesoDe(this.detalleSeleccionado());
    if (!fecha) return null;
    if (fecha < this.hoyCanal()) {
      return `La fecha de proceso del plan (${fecha}) ya pasó. Cámbiela desde «Canal de salida» antes de generar: el TXT la lleva en el nombre y el banco lo rechazaría.`;
    }
    return null;
  });

  /** Canal legible de una fila del listado. */
  protected canalDe(row: unknown): string {
    const codigo = String((row as ProgramacionRow).modalidadCodigo ?? 'H2H').toUpperCase();
    return codigo === 'H2W' ? 'Portal web' : 'SFTP';
  }

  /** La Page la sobrescribe: es quien tiene el servicio. */
  protected confirmarModalidad(): void {}

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

  /**
   * ¿Se ofrece convertir a proveedores al crear el plan?
   *
   * <p>Mismas dos condiciones que en el cambio de canal: se va al portal web y las operaciones
   * <b>seleccionadas</b> son todas transferencias a terceros. Se mira la selección y no el listado
   * completo, porque es la selección lo que entra al plan.</p>
   */
  protected readonly conversionNuevoDisponible = computed<boolean>(() => {
    if (String(this.nuevoModalidad()).toUpperCase() !== 'H2W') return false;
    const elegidas = this.seleccion();
    if (elegidas.size === 0) return false;
    const porId = new Map(this.opsRows().map((op) => [String(op.id), op]));
    for (const id of elegidas) {
      const op = porId.get(String(id));
      // Una seleccionada que ya no está en el listado (cambió el filtro) no se puede verificar; no
      // se asume que sea convertible.
      if (!op) return false;
      if (String(op.tipoOperacionCodigo ?? '').toUpperCase() !== 'TRANSFERENCIA_TERCEROS') {
        return false;
      }
    }
    return true;
  });

  protected onNuevoConversion(event: Event): void {
    this.nuevoConversion.set((event.target as HTMLSelectElement).value as ConversionProducto);
  }

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
    // Qué toca hacer con este plan, sin abrir el detalle.
    {
      key: 'estadoCodigo',
      header: 'Siguiente paso',
      render: (value) => siguientePasoProgramacion(value as string),
    },
    // Canal de salida. Va en el listado porque decide si el plan sale solo o si alguien tiene
    // que bajarse el archivo y subirlo a mano al banco.
    { key: 'modalidadCodigo', header: 'Canal', align: 'center', render: (_v, row) => this.canalDe(row) },
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
  protected readonly filtroProcDesde = signal<string>('');
  protected readonly filtroProcHasta = signal<string>('');
  protected onProcDesde(valor: string): void {
    this.filtroProcDesde.set(valor);
  }
  protected onProcHasta(valor: string): void {
    this.filtroProcHasta.set(valor);
  }
  protected readonly filtroFechaDesde = signal<string>('');
  protected readonly filtroFechaHasta = signal<string>('');

  // JDatePicker emite el valor ISO ya formado, no un Event del DOM.
  protected onFechaDesde(valor: string): void {
    this.filtroFechaDesde.set(valor);
  }
  protected onFechaHasta(valor: string): void {
    this.filtroFechaHasta.set(valor);
  }

  protected onResetFiltros(): void {
    this.filtroCodigo.set('');
    this.filtroEstado.set('');
    this.filtroModo.set('');
    this.filtroTipoDestino.set('');
    this.filtroMoneda.set('');
    this.filtroFechaDesde.set('');
    this.filtroFechaHasta.set('');
    this.filtroProcDesde.set('');
    this.filtroProcHasta.set('');
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
    if (this.filtroFechaDesde()) filters.fechaDesde = this.filtroFechaDesde();
    if (this.filtroFechaHasta()) filters.fechaHasta = this.filtroFechaHasta();
    if (this.filtroProcDesde()) filters.fechaProcesoDiaDesde = this.filtroProcDesde();
    if (this.filtroProcHasta()) filters.fechaProcesoDiaHasta = this.filtroProcHasta();
    return filters;
  }

  // ── crear ────────────────────────────────────────────────────────────
  protected onNuevoIdProducto(e: Event): void {
    this.nuevoIdProducto.set((e.target as HTMLSelectElement).value);
    this.opsRows.set([]);
    this.seleccion.set(new Set());
    this.loteFiltro.set('');
    // Cada producto tiene su rama horaria: sin recargar, el formulario seguiría mostrando la
    // ventana del producto anterior mientras el backend valida contra la del nuevo.
    this.onProductoParaVentana(this.productoAbrevSel());
  }

  /** La Page la sobrescribe: es quien tiene el servicio. */
  protected onProductoParaVentana(_abreviatura: string): void {
    return;
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

  // JDatePicker emite el valor ya en ISO, sin Event de por medio: el contrato del
  // componente entrega el dato, no el evento del DOM.
  protected onNuevaFechaProcesoValor(valor: string): void {
    this.nuevoFechaProceso.set(valor);
  }
  protected onNuevaFechaProgramadoValor(valor: string): void {
    this.nuevoFechaProgramado.set(valor);
  }
  protected onNuevoModo(e: Event): void {
    this.nuevoModo.set((e.target as HTMLSelectElement).value);
  }
  /**
   * Elegir H2W fuerza MANUAL: en ese canal no hay job que suba nada al portal, asi que un plan
   * AUTOMATICO seria un plan que nadie dispara. El backend lo rechaza; aqui se ajusta antes para
   * no ofrecer una combinacion que va a fallar.
   */
  protected onNuevaModalidad(e: Event): void {
    const valor = (e.target as HTMLSelectElement).value;
    this.nuevoModalidad.set(valor);
    if (valor === 'H2W') {
      this.nuevoModo.set('MANUAL');
    }
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

  // ── Ventana de atención del canal ──────────────────────────────────────
  //
  // La entrega el backend ya resuelta (días que opera, horas con el margen restado). No se
  // interpreta aquí ni se codifican los horarios: el mismo validador que responde el endpoint es el
  // que rechaza al crear, y una segunda copia de la regla ofrecería días que el backend no acepta.

  protected readonly ventana = signal<VentanaSemanal | null>(null);

  protected setVentana(v: VentanaSemanal | null): void {
    this.ventana.set(v);
  }

  /**
   * Día de la ventana que corresponde a una fecha `YYYY-MM-DD`.
   *
   * <p>La fecha se arma por partes y no con `new Date(iso)`: esa forma interpreta la cadena como
   * UTC, y en Lima (-05:00) retrocede al día anterior —un lunes se leería como domingo y el
   * formulario rechazaría una fecha perfectamente válida—.</p>
   */
  protected diaDeVentana(iso: string): DiaVentana | null {
    const v = this.ventana();
    if (!v || !iso) return null;
    const [anio, mes, dia] = iso.slice(0, 10).split('-').map(Number);
    if (!anio || !mes || !dia) return null;
    const js = new Date(anio, mes - 1, dia);
    if (Number.isNaN(js.getTime())) return null;
    // JS numera el domingo como 0; ISO-8601 y DayOfWeek lo numeran 7.
    const diaSemana = js.getDay() === 0 ? 7 : js.getDay();
    return v.dias?.find((d) => d.diaSemana === diaSemana) ?? null;
  }

  /** Días que el canal atiende, para decirlo antes de que el usuario elija mal. */
  protected readonly resumenVentana = computed<string | null>(() => {
    const v = this.ventana();
    if (!v) return null;
    if (!v.resuelta) return 'No se pudo leer la ventana de atención del canal.';
    const abiertos = (v.dias ?? []).filter((d) => d.opera);
    if (!abiertos.length) return 'El canal no tiene ningún día de atención configurado.';
    return abiertos
      .sort((a, b) => a.diaSemana - b.diaSemana)
      .map((d) => `${d.nombre} ${this.hhmm(d.desde)}–${this.hhmm(d.hasta)}`)
      .join(' · ');
  });

  /**
   * Días cerrados, nombrados por la propia configuración.
   *
   * <p>Antes esto era un «domingos no opera» escrito en la plantilla. Sobraba decirlo a mano —el
   * backend ya declara los siete días— y además habría quedado mintiendo el día que el banco
   * cambie su calendario o se cierre un feriado.</p>
   */
  protected readonly diasCerrados = computed<string | null>(() => {
    const v = this.ventana();
    if (!v?.resuelta) return null;
    const cerrados = (v.dias ?? [])
      .filter((d) => !d.opera)
      .sort((a, b) => a.diaSemana - b.diaSemana)
      .map((d) => d.nombre);
    if (!cerrados.length) return null;
    return cerrados.length === 1 ? `${cerrados[0]} no opera.` : `No opera: ${cerrados.join(', ')}.`;
  });

  /** Aviso sobre la fecha de proceso elegida. Informa mientras se escribe; el corte es al guardar. */
  protected readonly avisoFechaProceso = computed<string | null>(() => {
    // Mismo criterio que motivoFueraDeVentana: en H2W la ventana del SFTP no aplica. Sin esto el
    // campo se pintaría en rojo diciendo «el plan no podría enviarse» sobre un plan que sí puede.
    if (String(this.nuevoModalidad()).toUpperCase() === 'H2W') return null;
    const iso = this.nuevoFechaProceso().trim();
    if (!iso) return null;
    const dia = this.diaDeVentana(iso);
    if (!dia) return null;
    return dia.opera
      ? null
      : `${dia.nombre}: el canal no atiende ese día. El plan no podría enviarse.`;
  });

  /** `HH:mm:ss` → `HH:mm`. El segundo no aporta nada en una ventana de atención. */
  protected hhmm(hora: string | undefined): string {
    return hora ? hora.slice(0, 5) : '—';
  }

  /**
   * Subtipos habilitados que cierran ANTES que la ventana consolidada.
   *
   * <p>El resumen de arriba toma el cierre más tardío, así que por sí solo daría vía libre hasta las
   * 20:15 cuando una interbancaria en el lote no pasa de las 12:15. El formulario no puede saber el
   * subtipo —se deriva de las operaciones—, así que lo que corresponde es mostrar la restricción y
   * dejar la decisión al operador, no fingir que no existe.</p>
   *
   * <p>Solo se listan los que difieren: si los tres cierran igual, repetirlo es ruido.</p>
   */
  protected readonly subtiposRestringidos = computed<{ subtipo: string; detalle: string }[]>(() => {
    const v = this.ventana();
    if (!v?.resuelta || !v.subtipos?.length) return [];
    const consolidado = new Map((v.dias ?? []).map((d) => [d.diaSemana, d.hasta ?? '']));
    const salida: { subtipo: string; detalle: string }[] = [];
    for (const s of v.subtipos) {
      if (!s.habilitado) continue;
      const antes = (s.dias ?? []).filter(
        (d) => d.opera && (d.hasta ?? '') < (consolidado.get(d.diaSemana) ?? '')
      );
      if (!antes.length) continue;
      salida.push({
        subtipo: s.subtipo,
        detalle: antes
          .sort((a, b) => a.diaSemana - b.diaSemana)
          .map((d) => `${d.nombre} hasta ${this.hhmm(d.hasta)}`)
          .join(' · '),
      });
    }
    return salida;
  });

  /** Límites del `datetime-local` para la fecha de proceso elegida, si ese día opera. */
  protected readonly limiteProgramado = computed<{ min: string; max: string } | null>(() => {
    const iso = this.nuevoFechaProceso().trim().slice(0, 10);
    const dia = this.diaDeVentana(iso);
    if (!dia?.opera) return null;
    return { min: `${iso}T${this.hhmm(dia.desde)}`, max: `${iso}T${this.hhmm(dia.hasta)}` };
  });

  /**
   * Motivo por el que las fechas caen fuera de la ventana del canal, o `null`.
   *
   * <p>Cuando la ventana no se pudo leer se deja pasar: el backend vuelve a validar y rechaza. Es
   * preferible a bloquear el formulario por un fallo de lectura que el usuario no puede arreglar.</p>
   *
   * <p>En **H2W no se comprueba**: la ventana es la del SFTP —a qué hora el banco acepta el PUT— y
   * en H2W no hay PUT, sino una persona que descarga el archivo y lo sube al portal cuando le
   * toca. Bloquear un plan de portal por caer en domingo negaría algo que el canal sí permite, y
   * además contradiría al generador, que ya exime a H2W de la ventana.</p>
   */
  private motivoFueraDeVentana(fechaProceso: string, programadoLocal: string): string | null {
    if (String(this.nuevoModalidad()).toUpperCase() === 'H2W') return null;
    const v = this.ventana();
    if (!v?.resuelta) return null;

    const diaProceso = this.diaDeVentana(fechaProceso);
    if (diaProceso && !diaProceso.opera) {
      return `La fecha de proceso cae en ${diaProceso.nombre} y el canal no atiende ese día.`;
    }
    if (!programadoLocal) return null;

    const diaProgramado = this.diaDeVentana(programadoLocal);
    if (diaProgramado && !diaProgramado.opera) {
      return `La fecha programada cae en ${diaProgramado.nombre} y el canal no atiende ese día.`;
    }
    // `2026-08-03T20:45` → `20:45`. Se compara como texto: `HH:mm` ordena igual que el reloj.
    const hora = programadoLocal.slice(11, 16);
    if (!hora || !diaProgramado?.opera) return null;
    const desde = this.hhmm(diaProgramado.desde);
    const hasta = this.hhmm(diaProgramado.hasta);
    if (hora < desde || hora > hasta) {
      return `La hora programada (${hora}) queda fuera de la ventana: ${diaProgramado.nombre} se atiende de ${desde} a ${hasta}.`;
    }
    return null;
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
    // La ventana se comprueba con las operaciones ya validadas: si el día está mal, el mensaje que
    // hay que leer es ese y no «seleccione operaciones».
    const fuera = this.motivoFueraDeVentana(fechaProceso, this.nuevoFechaProgramado().trim());
    if (fuera) {
      this.crearError.set(fuera);
      return null;
    }
    const payload: ProgramacionCrear = {
      idProducto,
      idMoneda,
      fechaProceso,
      modoEnvio: this.nuevoModo(),
      modalidad: this.nuevoModalidad(),
      operaciones,
    };
    // Igual que en el cambio de canal: solo viaja si la opción llegó a ofrecerse, para que una
    // selección que dejó de ser elegible no arrastre una conversión que el backend rechazaría.
    if (this.conversionNuevoDisponible() && this.nuevoConversion() !== 'MANTENER') {
      payload.conversion = this.nuevoConversion();
    }
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
  // ── Acciones permitidas por estado ─────────────────────────────────────

  /** Estado del plan abierto en el diálogo de detalle. */
  private estadoDetalle(): string {
    return this.pv(this.detalle()?.programacion, 'estadoCodigo').toUpperCase();
  }

  protected puede(accion: string): boolean {
    return (ACCIONES_POR_ESTADO[this.estadoDetalle()] ?? []).includes(accion);
  }

  /** Materializar la planilla: el plan debe estar vivo y no tener ya una. */
  protected puedeGenerar(sinPlanilla: boolean): boolean {
    return sinPlanilla && ESTADOS_GENERABLES.includes(this.estadoDetalle());
  }

  /**
   * Texto del `title` cuando la acción está vedada. Vacío si está permitida.
   *
   * <p>Un botón inhabilitado sin explicación obliga a adivinar; el motivo es justo lo que hace falta
   * saber —sobre todo en GENERADA, donde la acción existe pero la vía es anular la planilla—.</p>
   */
  protected motivo(accion: string): string {
    if (this.puede(accion)) return '';
    const estado = this.estadoDetalle();
    if (accion === 'CANCELADA') {
      return MOTIVO_SIN_CANCELAR[estado] ?? `No disponible en estado ${estado}.`;
    }
    return `No disponible en estado ${estado}.`;
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
  /*
   * Antes formateaba con `new Date(...)` + Intl SIN `timeZone`, o sea en la zona del
   * NAVEGADOR. Coincidía con la del canal solo mientras quien mirase estuviera en Lima,
   * y el backend además manda el timestamptz con el desplazamiento de la JVM que corre
   * la API: dos fuentes de desfase que no se ven hasta cuadrar un corte horario.
   */
  protected fdt(value: unknown): string {
    if (value === null || value === undefined || value === '') return '-';
    return instanteDeBackendAHoraDePared(value, undefined, true) || '-';
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
