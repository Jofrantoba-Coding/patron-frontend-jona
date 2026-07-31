import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { JDataTable, JDialog, JPagination, JSectionHeading, type JDataTableColumn, type JDataTableRow } from 'uijona-4ngular';
import type {
  Operacion,
  OperacionDetalle,
  OperacionDetalleRegistro,
  OperacionFiltro,
  Paginated,
  ProductoGrupo,
} from '../../core/models';
import { OperacionDetalleDialog } from '../../shared/operacion-detalle-dialog';
import { ANULACION_NEGADA, ESTADO_OPE_ANULADA, META, META_TODAS, TIPOOP_GRUPO, type OperacionMeta } from './inter-operaciones';

const NUM = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 });

type Registro = OperacionDetalleRegistro;

@Component({
  selector: 'app-operaciones-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, JDialog, OperacionDetalleDialog],
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
  protected readonly master = signal<Operacion[]>([]);
  protected readonly page = signal<number>(1);
  protected readonly pageSize = signal<number>(50);
  protected readonly total = signal<number>(0);

  // Detalle de operación (diálogo compartido)
  protected readonly opDetalle = signal<OperacionDetalle | null>(null);
  protected readonly opDetalleLoading = signal<string | null>(null);

  protected readonly esTodas = computed(() => this.producto() === null);
  protected readonly meta = computed<OperacionMeta>(() => (this.producto() ? META[this.producto() as ProductoGrupo] : META_TODAS));
  protected readonly rowKey = (row: JDataTableRow) => String((row as unknown as Operacion).id);

  protected readonly estados = computed(() => Array.from(new Set(this.master().map((operacion) => operacion.estadoOperacionCodigo))).sort());
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));

  protected readonly rows = computed<JDataTableRow[]>(() => this.master() as unknown as JDataTableRow[]);

  protected readonly columns: JDataTableColumn[] = [
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
    { key: 'estadoOperacionCodigo', header: 'Estado', sortable: true },
  ];

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
    this.abrirOpDetalle(String((event.row as unknown as Operacion).id));
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
