import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  JBadge,
  JDataTable,
  JDatePicker,
  JDialog,
  JPagination,
  JProgress,
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
import { instanteDeBackendAHoraDePared } from '../../core/zona-horaria';
import { esperaOperador, siguientePaso, type SiguientePaso } from './inter-planillas';

const NUM = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 });

type Registro = OperacionDetalleRegistro;
type DetalleTab = 'resumen' | 'archivo' | 'registros' | 'respuestas';

/** Etapas del ciclo de vida de una planilla que sale por SFTP (stepper del detalle). */
export const ETAPAS = ['GENERADA', 'VALIDADA', 'CIFRADA', 'ENVIADA', 'RESPUESTA_RECIBIDA', 'PROCESADA'] as const;

/**
 * Las del canal H2W, que no son las mismas. Dos diferencias, y ninguna es cosmética:
 *
 * <ul>
 *   <li><b>No hay CIFRADA.</b> El cifrado protege el tramo SFTP, donde el archivo viaja solo hasta
 *       el buzón del banco. Aquí lo descarga una persona ya autenticada en la consola y lo sube por
 *       HTTPS al portal: la envoltura PGP no añade protección y sí un paso que puede fallar.</li>
 *   <li><b>PENDIENTE_ENVIO sí es un paso.</b> No estaba en la lista de SFTP —allí es un estado de
 *       paso—, y al no estarlo el stepper daba índice −1 y «rebobinaba» por detrás de GENERADA:
 *       justo cuando la planilla espera a que alguien la suba, que es el momento en que más se
 *       mira.</li>
 *   <li><b>No hay RESPUESTA_RECIBIDA.</b> En este canal no llega nada al buzón; el resultado lo
 *       declara el operador desde la pantalla del banco.</li>
 * </ul>
 */
export const ETAPAS_H2W = ['GENERADA', 'VALIDADA', 'PENDIENTE_ENVIO', 'ENVIADA', 'PROCESADA'] as const;

/**
 * Estados en los que la planilla ya no admite más etapas. Solo `PROCESADA` pertenece al pipeline;
 * los demás son desenlaces alternativos de la fase 8 (o un fallo) y NO están en {@link ETAPAS}.
 * Sin esta lista el stepper los trataría como "estado desconocido" y volvería al primer paso.
 */
const ESTADOS_TERMINALES = ['PROCESADA', 'PROCESADA_PARCIAL', 'RECHAZADA', 'ANULADA', 'ERROR', 'ERROR_CIFRADO'];

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
  'ANULADA',
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
  imports: [JSectionHeading, JDataTable, JPagination, JBadge, JDialog, JDatePicker, JProgress, JTabs, JTabsList, JTabsTrigger, JTabsContent],
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

  /** Las etapas que se pintan, según el canal de la planilla abierta. */
  protected readonly etapas = computed<readonly string[]>(() =>
    this.esH2w() ? ETAPAS_H2W : ETAPAS
  );
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

  /** Estado actual de la planilla abierta en el detalle. */
  protected readonly estadoPlanillaActual = computed(() =>
    this.pv(this.detalle()?.planilla, 'estadoPlanillaCodigo')
  );

  /** La planilla ya está cerrada: ninguna etapa admite acción. */
  protected readonly esTerminal = computed(() => ESTADOS_TERMINALES.includes(this.estadoPlanillaActual()));

  /** Índice de la etapa actual dentro del pipeline (para resaltar el stepper). */
  protected readonly etapaActual = computed(() => {
    const estado = this.estadoPlanillaActual();
    const etapas = this.etapas();
    const idx = etapas.indexOf(estado);
    if (idx >= 0) return idx;
    // RECHAZADA / PROCESADA_PARCIAL / ERROR cierran el ciclo pero no son pasos del pipeline: se
    // muestran en la última posición. Sin esto darían -1 y el stepper "rebobinaría" a GENERADA.
    if (ESTADOS_TERMINALES.includes(estado)) return etapas.length - 1;
    // Estado que no pertenece a ESTE pipeline pero sí al otro: una planilla H2W que se cifró antes
    // de que el cifrado saliera del flujo. Se ancla al paso anterior —VALIDADA— en vez de dejar el
    // −1, que pinta el stepper entero como "pendiente" y hace parecer que no se ha hecho nada.
    if (estado === 'CIFRADA' || estado === 'PENDIENTE_CIFRADO') {
      return Math.max(0, etapas.indexOf('VALIDADA'));
    }
    return idx;
  });

  /**
   * Rótulo del paso. El último muestra el desenlace REAL, porque la fase 8 puede cerrar en
   * `PROCESADA`, `PROCESADA_PARCIAL` o `RECHAZADA`: rotularlo siempre "PROCESADA" mentiría sobre
   * una planilla que el banco rechazó.
   */
  protected etiquetaEtapa(etapa: string, i: number): string {
    if (i !== this.etapas().length - 1) return etapa;
    const estado = this.estadoPlanillaActual();
    return ESTADOS_TERMINALES.includes(estado) ? estado : etapa;
  }

  /** Estado de la acción de validación (etapa VALIDADA). */
  protected readonly validando = signal<boolean>(false);
  protected readonly validarMensaje = signal<string | null>(null);
  protected readonly validarError = signal<boolean>(false);
  /** Hallazgos estructurados de la validación pre-envío (uno por regla UC que falló). */
  protected readonly validarHallazgos = signal<{ code?: string; field?: string; message?: string }[]>([]);

  /** Etapas con endpoint de acción implementado (clave = estado destino). */
  /**
   * Siguiente paso de la planilla abierta en el detalle. Alimenta la llamada a
   * la acción de la cabecera del diálogo, para no obligar a leer el stepper.
   */
  protected readonly pasoDetalle = computed<SiguientePaso>(() =>
    siguientePaso(this.estadoPlanillaActual(), this.modalidadPlanillaActual())
  );

  /** Canal de la planilla abierta. Decide qué acción se ofrece en CIFRADA y en ENVIADA. */
  protected readonly modalidadPlanillaActual = computed<string>(() =>
    String(this.detalleSeleccionado()?.modalidadCodigo ?? 'H2H').toUpperCase()
  );

  /** ¿La planilla abierta sale por el portal web? */
  protected readonly esH2w = computed<boolean>(() => this.modalidadPlanillaActual() === 'H2W');

  // ── H2W · estado de los diálogos del portal ────────────────────────────
  //
  // La View solo guarda el estado y expone los abridores; quien llama a la API es la Page.

  /** Diálogo de "confirmar subida": pide la constancia que devuelve el portal. */
  protected readonly confirmarSubidaOpen = signal<boolean>(false);
  protected readonly constanciaPortal = signal<string>('');

  /** Diálogo de cierre: resultado global o, si se despliega, uno por operación. */
  protected readonly cerrarPortalOpen = signal<boolean>(false);
  protected readonly cierreResultado = signal<'PROCESADA' | 'RECHAZADA'>('PROCESADA');
  protected readonly cierrePorDetalle = signal<boolean>(false);
  /** Veredicto por secuencial cuando el banco procesó solo una parte del lote. */
  protected readonly cierreDetalles = signal<Record<number, 'PROCESADA' | 'RECHAZADA'>>({});

  protected abrirConfirmarSubida(): void {
    this.constanciaPortal.set('');
    this.confirmarSubidaOpen.set(true);
  }

  protected cerrarConfirmarSubida(): void {
    this.confirmarSubidaOpen.set(false);
  }

  protected onConstancia(event: Event): void {
    this.constanciaPortal.set((event.target as HTMLInputElement).value);
  }

  /**
   * Abre el cierre. Arranca con TODAS en PROCESADA porque es el caso normal —el portal acepta
   * el lote entero— y el parcial es la excepción que el operador despliega.
   */
  protected abrirCerrarPortal(): void {
    const inicial: Record<number, 'PROCESADA' | 'RECHAZADA'> = {};
    for (const r of this.registrosDelDetalle()) {
      inicial[r.secuencial] = 'PROCESADA';
    }
    this.cierreDetalles.set(inicial);
    this.cierreResultado.set('PROCESADA');
    this.cierrePorDetalle.set(false);
    this.cerrarPortalOpen.set(true);
  }

  protected cerrarCierrePortal(): void {
    this.cerrarPortalOpen.set(false);
  }

  protected onCierreResultado(event: Event): void {
    this.cierreResultado.set((event.target as HTMLSelectElement).value as 'PROCESADA' | 'RECHAZADA');
  }

  protected alternarCierrePorDetalle(): void {
    this.cierrePorDetalle.set(!this.cierrePorDetalle());
  }

  protected onVeredictoDetalle(secuencial: number, event: Event): void {
    const valor = (event.target as HTMLSelectElement).value as 'PROCESADA' | 'RECHAZADA';
    this.cierreDetalles.set({ ...this.cierreDetalles(), [secuencial]: valor });
  }

  /** Cuántas van marcadas como rechazadas: se muestra antes de cerrar, para que no sorprenda. */
  protected readonly cierreRechazadas = computed<number>(
    () => Object.values(this.cierreDetalles()).filter((v) => v === 'RECHAZADA').length
  );

  /**
   * Operaciones de la planilla abierta, con su secuencial.
   *
   * <p>Es lo que el backend exige declarar entero en un cierre parcial: si falta alguna, la
   * planilla no cierra. La lista sale del detalle ya cargado, así que no hay una llamada extra.</p>
   */
  protected readonly registrosDelDetalle = computed<
    { secuencial: number; titular: string; monto: string }[]
  >(() => {
    // El beneficiario y el importe NO son columnas del detalle: viven dentro del snapshot
    // `bloqueOperacion`. Se reutilizan los mismos lectores que ya usa la tabla de registros
    // —regBeneficiario / regMonto— en vez de leer claves a mano, que es como esta tabla
    // acababa mostrando una lista de filas vacias sobre la que nadie puede decidir nada.
    const detalles = (this.detalle()?.detalles ?? []) as Registro[];
    return detalles.map((r, i) => ({
      secuencial: Number(this.raw(r, 'secuencial') ?? i + 1),
      titular: this.regBeneficiario(r),
      monto: this.regMonto(r),
    }));
  });

  /** La Page las sobrescribe: es quien tiene el servicio. */
  protected descargarParaPortal(_tipo: 'claro' | 'cifrado'): void {}
  protected confirmarSubida(): void {}
  protected confirmarCierrePortal(): void {}

  /**
   * La etapa `i` es la SIGUIENTE al estado actual: habilitada para hacer clic. Al pulsarla dispara
   * la transición desde el estado actual hacia esa etapa (ver {@code onEtapa}).
   *
   * <p>Una planilla en estado terminal no ofrece ninguna: ya fue decidida y reabrirla no es una
   * acción de pantalla.</p>
   */
  protected etapaAccionable(i: number): boolean {
    return !this.esTerminal() && i === this.etapaActual() + 1 && !this.validando();
  }

  /** Hook de acción por etapa (nombre del estado destino), sobrescrito por la Page. */
  protected onEtapa(_etapa: string): void {
    return;
  }

  // ── Anulación voluntaria ──────────────────────────────────────────────
  /** Estados desde los que el archivo NO ha salido y la planilla admite anularse. */
  private static readonly ESTADOS_YA_EN_BANCO = ['ENVIADA', 'RESPUESTA_RECIBIDA'];

  protected readonly anularAbierto = signal<boolean>(false);
  protected readonly anularMotivo = signal<string>('');

  /**
   * La planilla admite anularse: no está cerrada y su archivo aún no salió.
   *
   * <p>Es una comprobación <b>optimista</b>. El backend además rechaza si consta un PUT del
   * archivo en la bitácora SFTP —una excepción de SFTP puede dejar la planilla sin marcar como
   * enviada cuando el archivo ya había llegado—, y eso la pantalla no lo sabe. Por eso el 422 se
   * muestra tal cual llega en vez de intentar predecirlo aquí: la autoridad es el backend.</p>
   */
  protected readonly puedeAnular = computed(
    () =>
      !this.esTerminal() &&
      !PlanillasViewComponent.ESTADOS_YA_EN_BANCO.includes(this.estadoPlanillaActual()) &&
      !this.validando()
  );

  /** El motivo es obligatorio: es la única constancia de por qué la planilla no se envió. */
  protected readonly motivoValido = computed(() => this.anularMotivo().trim().length > 0);

  protected abrirAnular(): void {
    this.anularMotivo.set('');
    this.anularAbierto.set(true);
  }

  protected cerrarAnular(): void {
    this.anularAbierto.set(false);
  }

  protected onAnularMotivo(event: Event): void {
    this.anularMotivo.set((event.target as HTMLTextAreaElement).value);
  }

  /** Hook de confirmación de la anulación, sobrescrito por la Page. */
  protected confirmarAnular(): void {
    return;
  }

  // ── Descarga y preview de archivos (claro/cifrado) ────────────────────
  /** Clave del archivo que se está descargando ('urlClaro' | 'urlCifrado'), o null. */
  protected readonly descargandoArchivo = signal<string | null>(null);
  /** Estado del modal de vista previa. */
  protected readonly previewAbierto = signal<boolean>(false);
  protected readonly previewTitulo = signal<string>('');
  protected readonly previewContenido = signal<string>('');
  protected readonly previewCargando = signal<boolean>(false);
  protected readonly previewError = signal<string | null>(null);

  /** Nombre de descarga sugerido: el de la planilla (+ .gpg para el cifrado). */
  protected nombreArchivoDescarga(detalle: PlanillaDetalleFull | null, key: string): string {
    const nombre = this.pv(detalle?.planilla, 'nombreArchivo');
    const base = nombre && nombre !== '-' ? nombre : 'archivo.txt';
    return key === 'urlCifrado' ? `${base}.gpg` : base;
  }

  /** Hook de descarga (sobrescrito por la Page): key = 'urlClaro' | 'urlCifrado'. */
  protected descargarArchivo(_key: string): void {
    return;
  }
  /** Hook de vista previa (sobrescrito por la Page): key = 'urlClaro' | 'urlCifrado'. */
  protected previewArchivo(_key: string): void {
    return;
  }
  protected cerrarPreview(): void {
    this.previewAbierto.set(false);
    this.previewContenido.set('');
    this.previewError.set(null);
  }

  // ── Respuestas del banco: preview y descarga ──────────────────────────
  /**
   * Id de la respuesta que se está descargando, o null. El contenido no viene en el listado
   * del detalle (proyección base sin `contenidoTxt`), así que se pide por respuesta.
   */
  protected readonly descargandoRespuesta = signal<string | null>(null);

  /** Hook de vista previa de una respuesta del banco (sobrescrito por la Page). */
  protected previewRespuesta(_respuesta: Registro): void {
    return;
  }
  /** Hook de descarga de una respuesta del banco (sobrescrito por la Page). */
  protected descargarRespuesta(_respuesta: Registro): void {
    return;
  }

  /**
   * Hook de descarga del archivo materializado en files-s1: key = 'urlCifrado' (el `.gpg` original
   * del banco) o 'urlClaro' (el TXT descifrado). Sobrescrito por la Page.
   */
  protected descargarArchivoRespuesta(_respuesta: Registro, _key: string): void {
    return;
  }

  /** Path del archivo de la respuesta en files-s1 ('urlClaro' | 'urlCifrado'), o vacío. */
  protected urlRespuesta(respuesta: Registro, key: string): string {
    const v = this.pv(respuesta, key);
    return v === '-' ? '' : v;
  }

  /** Mensaje resumido que dejó el banco (vive en el jsonb atributos de la respuesta). */
  protected mensajeRespuesta(respuesta: Registro): string {
    const a = this.raw(respuesta, 'atributos');
    const obj = a && typeof a === 'object' ? (a as Registro) : {};
    return this.pv(obj, 'mensaje');
  }

  /** ¿La respuesta es un rechazo del banco? (marca `rechazo` de la parametría del tipo). */
  protected esRechazo(respuesta: Registro): boolean {
    const a = this.raw(respuesta, 'atributos');
    const obj = a && typeof a === 'object' ? (a as Registro) : {};
    return this.pv(obj, 'rechazo') === 'true';
  }

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
    // Qué toca hacer, junto al estado. Sin esta columna hay que abrir el detalle
    // de cada fila para descubrir en qué punto del pipeline está.
    {
      key: 'estadoPlanillaCodigo',
      header: 'Siguiente paso',
      // Se pasa la fila entera y no solo el estado: en H2W el mismo estado pide otra accion
      // (CIFRADA no es "Enviar" sino "Descargar y subir al portal").
      render: (value, row) =>
        siguientePaso(value as string, (row as unknown as PlanillaRow).modalidadCodigo).accion,
    },
    // Canal y quien empuja. Van juntos porque responden la misma pregunta del operador:
    // "¿esto avanza solo o me esta esperando a mi?".
    {
      key: 'modalidadCodigo',
      header: 'Canal',
      align: 'center',
      render: (value) => (String(value ?? 'H2H').toUpperCase() === 'H2W' ? 'Portal web' : 'SFTP'),
    },
    {
      key: 'modoProcesamiento',
      header: 'Proceso',
      align: 'center',
      render: (value, row) =>
        esperaOperador(row as unknown as PlanillaRow) ? 'Manual' : 'Automatico',
    },
    { key: 'fechaArchivo', header: 'F. archivo', sortable: true },
    // Se ancla a la zona del negocio: el backend manda el timestamptz con el
    // desplazamiento de la JVM que corre la API, así que en crudo se veía la hora del
    // servidor —y con microsegundos— en vez de la del canal.
    {
      key: 'fechaEnvio',
      header: 'Envío',
      align: 'center',
      render: (value) => instanteDeBackendAHoraDePared(value) || 'No enviada',
    },
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

  protected onAplicarFiltros(): void {
    this.page.set(1);
    this.load();
  }
  protected onResetFiltros(): void {
    this.filtroNombre.set('');
    this.filtroSecuencial.set('');
    this.filtroEstado.set('');
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
    if (this.filtroFechaDesde()) filters.fechaDesde = this.filtroFechaDesde();
    if (this.filtroFechaHasta()) filters.fechaHasta = this.filtroFechaHasta();
    if (this.filtroProcDesde()) filters.fechaArchivoDesde = this.filtroProcDesde();
    if (this.filtroProcHasta()) filters.fechaArchivoHasta = this.filtroProcHasta();
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
