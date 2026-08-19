import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { JDataTable, JDatePicker, JDialog, JPagination, JSectionHeading, type JDataTableColumn, type JDataTableRow } from 'uijona-4ngular';
import type {
  Operacion,
  OperacionDetalle,
  OperacionDetalleRegistro,
  OperacionFiltro,
  Paginated,
  ProductoGrupo,
} from '../../core/models';
import { instanteDeBackendAHoraDePared } from '../../core/zona-horaria';
import { OperacionDetalleDialog } from '../../shared/operacion-detalle-dialog';
import type {
  ComparacionCalimaco,
  EstadoCalimaco,
  SesionCalimaco,
} from '../calimaco/inter-conciliacion';
import {
  ANULACION_NEGADA,
  ESTADO_OPE_ANULADA,
  ESTADO_OPE_CONFIRMADO,
  ESTADO_OPE_INFORMADO,
  META,
  META_TODAS,
  TIPOOP_GRUPO,
  modalidadDe,
  situacionOperacion,
  type OperacionMeta,
} from './inter-operaciones';

const NUM = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 });

/** Catálogo del que salen los estados de la operación. Es GLOBAL: no depende de ningún banco. */
export const CATALOGO_ESTADO_OPERACION = 'GLOBAL#ESTADO_OPERACION';

/**
 * Estados de la operación con los que arranca el filtro, mientras llega el catálogo.
 *
 * <p><b>Por qué existe si se cargan por API.</b> Es el suelo. Antes las opciones salían de las
 * filas ya cargadas —{@code new Set(master().map(o => o.estadoOperacionCodigo))}—, lo que da un
 * filtro que solo deja filtrar por lo que ya se está viendo; y como el filtrado lo resuelve el
 * <b>backend</b> sobre el total, los estados ausentes de la página no aparecían nunca. Dejar el
 * desplegable vacío hasta que responda la API —o para siempre, si falla— sería volver a ese mismo
 * fallo por otra puerta.</p>
 *
 * <p>Orden de aparición en el flujo, igual que el {@code para_n_orden} del catálogo. El valor que
 * viaja a la API es el código corto: el backend compone {@code GLOBAL#ESTADO_OPERACION#<código>}
 * (ver {@code codigoGlobal} en {@code DaoOperacion}).</p>
 */
export const ESTADOS_OPERACION = [
  'REGISTRADA',
  'VALIDADA',
  'EN_PROCESO_PAGO',
  'PAGO_CONFIRMADO',
  'PAGO_RECHAZADO',
  'CONTABILIZADA',
  'ANULADA',
  'ERROR',
];

type Registro = OperacionDetalleRegistro;

@Component({
  selector: 'app-operaciones-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, JDialog, JDatePicker, OperacionDetalleDialog],
  templateUrl: './operaciones-view.component.html',
})
export class OperacionesViewComponent {
  protected readonly producto = signal<ProductoGrupo | null>(null);
  protected readonly subtipo = signal<string>('');
  protected readonly filtroProducto = signal<string>('');
  protected readonly filtroEstado = signal<string>('');
  protected readonly filtroId = signal<string>('');
  protected readonly filtroIdCarga = signal<string>('');
  protected readonly filtroIdPlanilla = signal<string>('');
  protected readonly filtroIdBeneficiario = signal<string>('');
  protected readonly filtroCodigoOperacion = signal<string>('');
  protected readonly filtroReferenciaOrigen = signal<string>('');
  protected readonly filtroSistemaOrigen = signal<string>('');
  protected readonly filtroTipoOperacion = signal<string>('');
  protected readonly filtroMoneda = signal<string>('');
  protected readonly filtroSinPlanillaVigente = signal<string>('');
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
  protected readonly master = signal<Operacion[]>([]);
  protected readonly page = signal<number>(1);
  protected readonly pageSize = signal<number>(50);
  protected readonly total = signal<number>(0);

  // Detalle de operación (diálogo compartido)
  protected readonly opDetalle = signal<OperacionDetalle | null>(null);
  protected readonly opDetalleLoading = signal<string | null>(null);

  protected readonly esTodas = computed(() => this.producto() === null);
  protected readonly meta = computed<OperacionMeta>(() => (this.producto() ? META[this.producto() as ProductoGrupo] : META_TODAS));

  /** Permisos efectivos; la Page los sustituye por los de la sesión. */
  protected can: (permiso: string) => boolean = () => true;

  /**
   * Los productos como pestañas y no como entradas del menú.
   *
   * <p>Pagos Masivos, Transferencias y Factoring no son destinos distintos: son
   * la misma bandeja de operaciones filtrada. Tenerlos en el menú lateral los
   * presentaba como secciones hermanas de Planillas —que es una etapa
   * posterior—, y aplanaba el proceso. Aquí se leen como lo que son: un filtro
   * sobre la vista actual, con "Todas" como punto de partida.</p>
   *
   * <p>Cada pestaña sigue navegando a su ruta, así que los enlaces guardados y
   * el botón de atrás del navegador se comportan igual que antes.</p>
   */
  protected readonly pestanasProducto = computed<{ valor: string; ruta: string; label: string }[]>(
    () => {
      const tabs = [{ valor: 'todas', ruta: 'operaciones', label: 'Todas' }];
      if (this.can('operaciones.pagos_masivos:read'))
        tabs.push({ valor: 'pagos_masivos', ruta: 'operaciones/pagos-masivos', label: 'Pagos masivos' });
      if (this.can('operaciones.transferencias:read'))
        tabs.push({ valor: 'transferencias', ruta: 'operaciones/transferencias', label: 'Transferencias' });
      if (this.can('operaciones.factoring:read'))
        tabs.push({ valor: 'factoring', ruta: 'operaciones/factoring', label: 'Factoring' });
      return tabs;
    }
  );

  protected readonly pestanaActiva = computed(() => this.producto() ?? 'todas');

  /** La Page la sobrescribe para navegar. */
  protected onPestanaProducto(_ruta: string): void {}
  protected readonly rowKey = (row: JDataTableRow) => String((row as unknown as Operacion).id);

  /**
   * Opciones del filtro de estado. Arrancan con {@link ESTADOS_OPERACION} y la Page las sustituye
   * por el catálogo real en cuanto responde la API.
   */
  protected readonly estados = signal<readonly string[]>(ESTADOS_OPERACION);

  /**
   * Sustituye las opciones por las del catálogo. Ignora una respuesta vacía a propósito: dejar el
   * desplegable sin opciones es el fallo que este filtro ya tuvo una vez, y con la lista de
   * arranque el operador al menos puede seguir filtrando.
   */
  protected setEstados(codigos: readonly string[]): void {
    if (codigos.length) {
      this.estados.set(codigos);
    }
  }
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));

  protected readonly rows = computed<JDataTableRow[]>(() => this.master() as unknown as JDataTableRow[]);

  private readonly columnasBase: JDataTableColumn[] = [
    { key: 'codigoOperacion', header: 'Código', sortable: true },
    { key: 'tipoOperacionCodigo', header: 'Tipo', sortable: true },
    {
      key: 'beneficiario',
      header: 'Beneficiario',
      render: (_value, row) => {
        const operacion = row as unknown as Operacion;
        const beneficiario = operacion.beneficiario ?? { titular: '-', tipoDocumentoCodigo: '-', numeroDocumento: '-' };
        return `${beneficiario.titular ?? '-'} - ${beneficiario.tipoDocumentoCodigo ?? '-'} ${beneficiario.numeroDocumento ?? '-'}`;
      },
    },
    {
      key: 'beneficiarioCuenta',
      header: 'Cuenta',
      render: (_value, row) => {
        const cuenta = (row as unknown as Operacion).beneficiarioCuenta;
        if (!cuenta) {
          return '-';
        }
        return `${cuenta.entidadFinCodigo ?? '-'} ${cuenta.tipoCuentaCodigo ?? '-'} - ${cuenta.numeroCuenta ?? cuenta.cuentaInterbancaria ?? '-'}`;
      },
    },
    { key: 'monedaCodigo', header: 'Mon.', sortable: true, align: 'center' },
    {
      key: 'montoTotal',
      header: 'Monto',
      sortable: true,
      align: 'right',
      render: (value) => NUM.format(Number(value ?? 0)),
    },
    // Momento en que la operación entró al canal. Es la columna por la que filtra
    // "Desde/Hasta", y sin ella el filtro parece no hacer nada: se acota un periodo
    // pero no hay forma de comprobar en pantalla qué quedó dentro.
    {
      key: 'fechaOperacion',
      header: 'Registrada',
      sortable: true,
      align: 'center',
      render: (value) => instanteDeBackendAHoraDePared(value) || '—',
    },
    // El día en que el banco debe procesarla. Manda sobre el corte horario, así
    // que es dato de primera línea y no de detalle.
    {
      key: 'fechaProceso',
      header: 'F. proceso',
      sortable: true,
      align: 'center',
      render: (value) => (value ? String(value) : '—'),
    },
    // H2H sale sola; H2W queda pendiente de firma en la banca web. Dos filas
    // idénticas pueden exigir trabajo humano distinto.
    {
      key: 'atributos',
      header: 'Modalidad',
      align: 'center',
      render: (value) => modalidadDe(value),
    },
    { key: 'estadoOperacionCodigo', header: 'Estado', sortable: true },
    // Si ya está en una planilla no se puede programar de nuevo. Sin esta
    // columna, el operador lo descubría al intentarlo y recibir el rechazo.
    {
      key: 'idPlanillaVigente',
      header: 'Situación',
      align: 'center',
      render: (value) => situacionOperacion(value).etiqueta,
    },
    // El cierre del flujo: en qué informe se avisó el pago al sistema de origen. Va en la tabla y no
    // solo en el detalle porque la pregunta se hace sobre la lista —«¿dónde se cerró este?»— y
    // obligar a abrir cada fila para responderla es lo que vuelve inútil el dato.
    //
    // Vacío no es un hueco: significa que la operación todavía no cerró. Se pinta con una raya en vez
    // de en blanco para que se lea como «aún no» y no como «falta el dato».
    {
      key: 'codigoInforme',
      header: 'Informe',
      align: 'center',
      render: (value) => (value ? String(value) : '—'),
    },
  ];

  /**
   * Columnas de la tabla. En modo conversión se antepone una de selección.
   *
   * <p>`j-data-table` no tiene selección propia, así que la marca se pinta como texto y el clic de
   * fila hace de casilla. Sale más barato —y más consistente— que duplicar la tabla entera solo
   * para poder marcar filas.</p>
   */
  protected readonly columns = computed<JDataTableColumn[]>(() => {
    if (!this.modoConversion()) {
      return this.columnasBase;
    }
    const marca: JDataTableColumn = {
      key: 'id',
      header: '',
      align: 'center',
      render: (value, row) => {
        const op = row as unknown as Operacion;
        // Una fila que no se puede convertir se marca como tal en la propia tabla: descubrirlo al
        // pulsar «Convertir» —con el 422 del backend— obligaría a adivinar cuál de todas estorba.
        if (this.motivoNoConvertible(op)) return '·';
        return this.enConversion(String(value ?? '')) ? '✓' : '○';
      },
    };
    return [marca, ...this.columnasBase];
  });

  // ── Conversión a pago masivo de proveedores ───────────────────────────
  //
  // Convertir crea una operación nueva por transferencia y ANULA la original, revirtiendo su
  // asiento (el debe pasa de 4699 a 4212). No hay deshacer, así que la pantalla exige entrar a un
  // modo explícito y no ofrece la acción suelta en cada fila.

  /** ¿Está la tabla en modo «marcar para convertir»? */
  protected readonly modoConversion = signal<boolean>(false);
  protected readonly seleccionConversion = signal<Set<string>>(new Set());
  protected readonly convertirAbierto = signal<boolean>(false);
  protected readonly convirtiendo = signal<boolean>(false);
  /** Opcional: sin fecha, cada operación conserva la suya (igual que el backend). */
  protected readonly convertirFechaProceso = signal<string>('');

  /**
   * Por qué esta operación NO se puede convertir, o `null` si se puede.
   *
   * <p>Espejo de las guardas del backend, en su mismo orden. Es <b>optimista</b>: el backend sigue
   * siendo la autoridad —valida además el aislamiento del tenant— y su 422 se muestra tal cual.
   * Lo que se gana aquí es que el operador no marque filas que van a hacer fallar el lote entero,
   * porque la conversión es todo o nada.</p>
   */
  protected motivoNoConvertible(op: Operacion): string | null {
    if (String(op.tipoOperacionCodigo ?? '').toUpperCase() !== 'TRANSFERENCIA_TERCEROS') {
      return 'no es una transferencia a terceros.';
    }
    const estado = String(op.estadoOperacionCodigo ?? '').toUpperCase();
    if (estado !== 'REGISTRADA' && estado !== 'VALIDADA') {
      return `su estado (${estado || '—'}) ya no admite conversión.`;
    }
    if (op.idPlanillaVigente) {
      return `ya está en la planilla ${op.idPlanillaVigente}: viajó al banco como transferencia.`;
    }
    if (op.idProgramacion) {
      return 'pertenece a un plan; conviértalo desde el plan al pasarlo a portal web (H2W).';
    }
    return null;
  }

  protected enConversion(id: string): boolean {
    return this.seleccionConversion().has(id);
  }

  /** Operaciones de la página que sí admiten conversión. */
  protected readonly convertibles = computed<Operacion[]>(() =>
    this.master().filter((op) => !this.motivoNoConvertible(op))
  );

  protected readonly seleccionConversionCount = computed(() => this.seleccionConversion().size);

  protected toggleModoConversion(): void {
    const entrando = !this.modoConversion();
    this.modoConversion.set(entrando);
    // Salir del modo limpia la selección: dejarla viva la reaplicaría sobre otra página o otro
    // filtro sin que se vea, que es como se convierte algo que no se estaba mirando.
    if (!entrando) this.seleccionConversion.set(new Set());
  }

  protected toggleConversion(id: string): void {
    const op = this.master().find((o) => String(o.id) === id);
    if (!op || this.motivoNoConvertible(op)) return;
    const s = new Set(this.seleccionConversion());
    if (s.has(id)) s.delete(id);
    else s.add(id);
    this.seleccionConversion.set(s);
  }

  /** Marca o desmarca todas las convertibles de la página visible. */
  protected toggleTodasConvertibles(): void {
    const visibles = this.convertibles().map((op) => String(op.id));
    const s = new Set(this.seleccionConversion());
    const todasMarcadas = visibles.length > 0 && visibles.every((id) => s.has(id));
    for (const id of visibles) {
      if (todasMarcadas) s.delete(id);
      else s.add(id);
    }
    this.seleccionConversion.set(s);
  }

  /** Las seleccionadas, en el orden en que se ven, para poder nombrarlas en la confirmación. */
  protected readonly seleccionadasParaConvertir = computed<Operacion[]>(() =>
    this.master().filter((op) => this.seleccionConversion().has(String(op.id)))
  );

  /** Importe total de lo que se va a convertir: es la magnitud de lo que se está anulando. */
  protected readonly totalAConvertir = computed(() =>
    NUM.format(
      this.seleccionadasParaConvertir().reduce((suma, op) => suma + Number(op.montoTotal ?? 0), 0)
    )
  );

  /** Monedas distintas en la selección. Ver el aviso del diálogo. */
  protected readonly monedasEnConversion = computed<string[]>(() =>
    Array.from(new Set(this.seleccionadasParaConvertir().map((op) => String(op.monedaCodigo ?? '—'))))
  );

  protected abrirConvertir(): void {
    if (this.seleccionConversionCount() === 0) return;
    this.convertirFechaProceso.set('');
    this.avisoMensaje.set(null);
    this.convertirAbierto.set(true);
  }

  protected cerrarConvertir(): void {
    this.convertirAbierto.set(false);
  }

  protected onConvertirFecha(event: Event): void {
    this.convertirFechaProceso.set((event.target as HTMLInputElement).value);
  }

  /** La Page la sobrescribe: es quien tiene el servicio. */
  protected confirmarConvertir(): void {}

  protected onSubtipo(event: Event): void {
    this.subtipo.set((event.target as HTMLSelectElement).value);
    this.page.set(1);
    this.load();
  }

  protected onProducto(event: Event): void {
    this.filtroProducto.set((event.target as HTMLSelectElement).value);
  }

  protected onEstado(event: Event): void {
    this.filtroEstado.set((event.target as HTMLSelectElement).value);
  }

  protected onId(event: Event): void {
    this.filtroId.set((event.target as HTMLInputElement).value);
  }

  protected onIdCarga(event: Event): void {
    this.filtroIdCarga.set((event.target as HTMLInputElement).value);
  }

  protected onIdPlanilla(event: Event): void {
    this.filtroIdPlanilla.set((event.target as HTMLInputElement).value);
  }

  protected onIdBeneficiario(event: Event): void {
    this.filtroIdBeneficiario.set((event.target as HTMLInputElement).value);
  }

  protected onCodigoOperacion(event: Event): void {
    this.filtroCodigoOperacion.set((event.target as HTMLInputElement).value);
  }

  protected onReferenciaOrigen(event: Event): void {
    this.filtroReferenciaOrigen.set((event.target as HTMLInputElement).value);
  }

  protected onSistemaOrigen(event: Event): void {
    this.filtroSistemaOrigen.set((event.target as HTMLInputElement).value);
  }

  protected onTipoOperacion(event: Event): void {
    this.filtroTipoOperacion.set((event.target as HTMLInputElement).value);
  }

  protected onMoneda(event: Event): void {
    this.filtroMoneda.set((event.target as HTMLInputElement).value);
  }

  protected onSinPlanilla(event: Event): void {
    this.filtroSinPlanillaVigente.set((event.target as HTMLSelectElement).value);
  }

  // JDatePicker entrega el valor ISO ya formado, no un Event del DOM.
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
    this.filtroProducto.set('');
    this.filtroEstado.set('');
    this.filtroId.set('');
    this.filtroIdCarga.set('');
    this.filtroIdPlanilla.set('');
    this.filtroIdBeneficiario.set('');
    this.filtroCodigoOperacion.set('');
    this.filtroReferenciaOrigen.set('');
    this.filtroSistemaOrigen.set('');
    this.filtroTipoOperacion.set('');
    this.filtroMoneda.set('');
    this.filtroSinPlanillaVigente.set('');
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

  protected buildBackendFilters(): OperacionFiltro {
    const filters: OperacionFiltro = {};
    const id = this.filtroId().trim();
    const idCarga = this.filtroIdCarga().trim();
    const idPlanilla = this.filtroIdPlanilla().trim();
    const idBeneficiario = this.filtroIdBeneficiario().trim();
    const codigoOperacion = this.filtroCodigoOperacion().trim();
    const referenciaOrigen = this.filtroReferenciaOrigen().trim();
    const sistemaOrigen = this.filtroSistemaOrigen().trim();
    const tipoOperacion = this.filtroTipoOperacion().trim();
    const estadoOperacion = this.filtroEstado().trim();
    const moneda = this.filtroMoneda().trim();
    const sinPlanilla = this.filtroSinPlanillaVigente().trim();
    const productoFiltro = this.filtroProducto().trim() as ProductoGrupo | '';

    if (id) filters.id = id;
    if (idCarga) filters.idCarga = idCarga;
    if (idPlanilla) filters.idPlanillaVigente = idPlanilla;
    if (idBeneficiario) filters.idBeneficiario = idBeneficiario;
    if (codigoOperacion) filters.codigoOperacion = codigoOperacion;
    if (referenciaOrigen) filters.referenciaOrigen = referenciaOrigen;
    if (sistemaOrigen) filters.sistemaOrigen = sistemaOrigen;
    if (tipoOperacion) {
      filters.tipoOperacion = tipoOperacion;
    } else if (productoFiltro) {
      filters.tipoOperaciones = Object.entries(TIPOOP_GRUPO)
        .filter(([, grupo]) => grupo === productoFiltro)
        .map(([codigo]) => codigo);
    }
    if (estadoOperacion) filters.estadoOperacion = estadoOperacion;
    if (moneda) filters.moneda = moneda;
    if (this.filtroFechaDesde()) filters.fechaDesde = this.filtroFechaDesde();
    if (this.filtroFechaHasta()) filters.fechaHasta = this.filtroFechaHasta();
    if (this.filtroProcDesde()) filters.fechaProcesoDesde = this.filtroProcDesde();
    if (this.filtroProcHasta()) filters.fechaProcesoHasta = this.filtroProcHasta();
    if (sinPlanilla === 'true' || sinPlanilla === 'false') {
      filters.sinPlanillaVigente = sinPlanilla === 'true';
    }

    return filters;
  }

  protected load(): void {
    return;
  }

  protected setPagedResult(result: Paginated<Operacion>): void {
    this.master.set(result.items);
    this.page.set(result.pagination.page);
    this.pageSize.set(result.pagination.pageSize);
    this.total.set(result.pagination.total);
  }

  protected onRowClick(event: { row: JDataTableRow; index: number }): void {
    const id = String((event.row as unknown as Operacion).id);
    // En modo conversión el clic marca la fila. Abrir el detalle ahí obligaría a cerrarlo tras
    // cada marca, que con un lote de veinte operaciones es inusable.
    if (this.modoConversion()) {
      this.toggleConversion(id);
      return;
    }
    this.abrirOpDetalle(id);
  }
  protected abrirOpDetalle(_idOperacion: string): void {
    return;
  }
  protected cerrarOpDetalle(): void {
    this.opDetalle.set(null);
    this.opDetalleLoading.set(null);
    // La comparación es una foto del momento en que se pulsó: dejarla viva al abrir OTRA operación
    // mostraría los datos de la anterior junto al botón irreversible de esta.
    this.limpiarComparacion();
  }
  protected setOpDetalle(d: OperacionDetalle): void {
    this.opDetalle.set(d);
  }

  // ── Anulación de la operación ─────────────────────────────────────────
  // ── Conciliación con Calimaco ─────────────────────────────────────────
  protected readonly comparacion = signal<ComparacionCalimaco | null>(null);
  protected readonly comparando = signal<boolean>(false);
  protected readonly informando = signal<boolean>(false);

  /** Paso 1: la credencial de la cuenta de servicio. No depende de la operación elegida. */
  protected readonly sesionCalimaco = signal<SesionCalimaco | null>(null);
  protected readonly verificandoSesion = signal<boolean>(false);

  /** Paso 4: cómo quedó el pago al releerlo. */
  protected readonly estadoCalimaco = signal<EstadoCalimaco | null>(null);
  protected readonly verificandoEstado = signal<boolean>(false);

  /**
   * Por qué NO se puede informar a Calimaco, o `null`.
   *
   * <p>Igual que el de anular, es una comprobación <b>optimista</b> que solo evita el viaje obvio: la
   * autoridad es el backend, que además vuelve a comparar antes de mandar. Devuelve texto y no un
   * booleano porque el bloqueo hay que explicarlo — «no veo el botón» no dice nada.</p>
   */
  protected readonly bloqueoCalimaco = computed<string | null>(() => {
    const registro = this.opRegistro();
    if (!registro) return null;
    const estado = this.estadoOpDetalle();
    if (estado === ESTADO_OPE_INFORMADO) {
      return 'la operación ya está informada a Calimaco.';
    }
    if (estado !== ESTADO_OPE_CONFIRMADO) {
      // Solo se informa lo que el banco YA pagó: avisar antes sería decirle al casino que pagamos
      // algo que todavía puede rechazarse.
      return `solo se informa lo que ya está en ${ESTADO_OPE_CONFIRMADO}, y está en ${estado}.`;
    }
    if (this.pv(registro, 'codigoExterno') === '-') {
      return 'la operación no tiene código externo, así que no hay identificador con el que'
        + ' buscarla en Calimaco.';
    }
    return null;
  });

  /** La comparación caduca al cerrar el detalle: es una foto de un momento, no un estado. */
  protected limpiarComparacion(): void {
    this.comparacion.set(null);
    this.comparando.set(false);
    this.informando.set(false);
    // El paso 4 también es una foto de UNA operación: dejarlo vivo al abrir otra mostraría el
    // «verificado» de la anterior. La sesión (paso 1) NO se limpia: es de la integración, no del
    // pago, así que sigue valiendo para el siguiente.
    this.estadoCalimaco.set(null);
    this.verificandoEstado.set(false);
  }

  /** La Page los sobrescribe. */
  protected compararCalimaco(): void {}
  protected informarCalimaco(): void {}
  protected verificarSesionCalimaco(): void {}
  protected verificarEstadoCalimaco(): void {}

  // ── Anulación de la operación ─────────────────────────────────────────
  protected readonly anularAbierto = signal<boolean>(false);
  protected readonly anularMotivo = signal<string>('');
  protected readonly anulando = signal<boolean>(false);
  /** Operación sobre la que se abrió la confirmación: sobrevive al cierre del detalle. */
  protected readonly anularId = signal<string | null>(null);
  protected readonly anularCodigo = signal<string>('');
  /** Resultado de la última anulación (incluye el desenlace contable). */
  protected readonly avisoMensaje = signal<string | null>(null);
  protected readonly avisoError = signal<boolean>(false);

  /** Registro plano de la operación abierta en el detalle. */
  private readonly opRegistro = computed<Registro | null>(() => this.opDetalle()?.operacion ?? null);

  protected readonly estadoOpDetalle = computed(() => this.pv(this.opRegistro(), 'estadoOperacionCodigo'));

  /**
   * Por qué NO se puede anular, o `null` si se puede. Se comprueba en el mismo orden que el
   * backend, y se devuelve un texto en vez de un booleano porque el bloqueo hay que explicarlo.
   *
   * <p>Es una comprobación <b>optimista</b>: el backend además valida el aislamiento de la
   * organización y puede negar por reglas que esta pantalla no ve. Por eso el 422 se muestra tal
   * cual llega en lugar de intentar predecirlo aquí — la autoridad es el backend.</p>
   */
  protected readonly bloqueoAnular = computed<string | null>(() => {
    const registro = this.opRegistro();
    if (!registro) return null;
    const estado = this.estadoOpDetalle();
    if (estado === ESTADO_OPE_ANULADA) {
      return 'la operación ya está anulada.';
    }
    const negado = ANULACION_NEGADA[estado];
    if (negado) {
      return negado;
    }
    // El HECHO manda sobre el estado: con planilla vigente existe un archivo que contiene esta
    // operación y que pudo salir al banco. La vía es anular la planilla, que sí comprueba el PUT.
    const idPlanilla = this.pv(registro, 'idPlanillaVigente');
    if (idPlanilla !== '-') {
      return `ya está incluida en la planilla ${idPlanilla}, cuyo archivo pudo llegar al banco. Anule esa planilla primero.`;
    }
    return null;
  });

  /** El motivo es obligatorio: es la única constancia de por qué este pago no se hizo. */
  protected readonly motivoAnularValido = computed(() => this.anularMotivo().trim().length > 0);

  /**
   * Abre la confirmación y CIERRA el detalle: apilar dos diálogos deja el de atrás inerte y con
   * scroll propio, y lo que hay que leer en ese momento es el motivo, no el snapshot.
   */
  protected abrirAnular(): void {
    const registro = this.opRegistro();
    if (!registro || this.bloqueoAnular()) return;
    const id = this.pv(registro, 'id');
    if (id === '-') return;
    this.anularId.set(id);
    this.anularCodigo.set(this.pv(registro, 'codigoOperacion'));
    this.anularMotivo.set('');
    this.avisoMensaje.set(null);
    this.avisoError.set(false);
    this.cerrarOpDetalle();
    this.anularAbierto.set(true);
  }

  protected cerrarAnular(): void {
    this.anularAbierto.set(false);
    this.anularId.set(null);
    this.anularMotivo.set('');
  }

  protected onAnularMotivo(event: Event): void {
    this.anularMotivo.set((event.target as HTMLTextAreaElement).value);
  }

  protected cerrarAviso(): void {
    this.avisoMensaje.set(null);
    this.avisoError.set(false);
  }

  /** Hook de confirmación, sobrescrito por la Page (es la que tiene el ApiService). */
  protected confirmarAnular(): void {
    return;
  }

  /** Lectura case-insensitive: la query nativa devuelve los alias en minúsculas. */
  private raw(record: Registro | null | undefined, key: string): unknown {
    if (!record) return undefined;
    return record[key] ?? record[key.toLowerCase()];
  }

  /** Valor escalar de un registro formateado como texto; `'-'` si no está. */
  protected pv(record: Registro | null | undefined, key: string): string {
    const value = this.raw(record, key);
    if (value === null || value === undefined || value === '') return '-';
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    return String(value);
  }

  protected setProducto(producto: ProductoGrupo | null): void {
    this.producto.set(producto);
    this.subtipo.set('');
    this.filtroProducto.set('');
    this.filtroEstado.set('');
    this.page.set(1);
  }
}
