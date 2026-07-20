import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { JDataTable, JPagination, JSectionHeading, type JDataTableColumn, type JDataTableRow } from 'uijona-4ngular';
import type { Operacion, OperacionDetalle, OperacionFiltro, Paginated, ProductoGrupo } from '../../core/models';
import { OperacionDetalleDialog } from '../../shared/operacion-detalle-dialog';
import { META, META_TODAS, TIPOOP_GRUPO, type OperacionMeta } from './inter-operaciones';

const NUM = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 });

@Component({
  selector: 'app-operaciones-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, OperacionDetalleDialog],
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
  protected readonly pageSize = signal<number>(2);
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

  protected setProducto(producto: ProductoGrupo | null): void {
    this.producto.set(producto);
    this.subtipo.set('');
    this.filtroProducto.set('');
    this.filtroEstado.set('');
    this.page.set(1);
  }
}
