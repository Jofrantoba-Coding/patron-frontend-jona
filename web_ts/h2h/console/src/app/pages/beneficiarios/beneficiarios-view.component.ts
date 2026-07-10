import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  JDataTable,
  JDialog,
  JPagination,
  JSectionHeading,
  JTabs,
  JTabsContent,
  JTabsList,
  JTabsTrigger,
  type JDataTableColumn,
  type JDataTableRow,
} from 'uijona-4ngular';
import type { Beneficiario, BeneficiarioDetalle, BeneficiarioFiltro, Operacion, OperacionDetalleRegistro, Paginated } from '../../core/models';

const NUM = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 });

interface DetalleCampo {
  key: string;
  label: string;
  value: string;
  isJson: boolean;
}

type DetalleTab = 'datos' | 'cuentas' | 'operaciones' | 'json';

const BENEFICIARIO_EXCLUDED_FIELDS = new Set([
  'id',
  'idbeneficiario',
  'identidadfin',
  'entidadfinfullcode',
  'idtipocuenta',
  'tipocuentafullcode',
  'idmoneda',
  'monedafullcode',
  'idtipobeneficiario',
  'tipobeneficiariofullcode',
  'idtipodocumento',
  'tipodocumentofullcode',
  'idorganizacion',
  'typevalor',
  'version',
  'ispersistente',
]);

@Component({
  selector: 'app-beneficiarios-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, JDialog, JTabs, JTabsList, JTabsTrigger, JTabsContent],
  templateUrl: './beneficiarios-view.component.html',
})
export class BeneficiariosViewComponent {
  protected readonly rowsSignal = signal<Beneficiario[]>([]);
  protected readonly page = signal<number>(1);
  protected readonly pageSize = signal<number>(5);
  protected readonly total = signal<number>(0);
  protected readonly filtroDocumento = signal<string>('');
  protected readonly filtroTitular = signal<string>('');
  protected readonly filtroActivo = signal<string>('');
  protected readonly detalle = signal<BeneficiarioDetalle | null>(null);
  protected readonly detalleLoading = signal<string | null>(null);
  protected readonly detalleSeleccionado = signal<Beneficiario | null>(null);
  protected readonly detalleTab = signal<DetalleTab>('datos');

  protected readonly rows = computed<JDataTableRow[]>(() => this.rowsSignal() as unknown as JDataTableRow[]);
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  protected readonly rowKey = (row: JDataTableRow) => String((row as unknown as Beneficiario).id);
  protected readonly detalleTitle = computed(() => this.detalleSeleccionado()?.titular ?? 'Detalle de beneficiario');
  protected readonly detalleDescription = computed(() => {
    const beneficiario = this.detalleSeleccionado();
    if (!beneficiario) {
      return '';
    }
    return `${beneficiario.tipoDocumentoCodigo ?? '-'} ${beneficiario.numeroDocumento ?? '-'} - ${beneficiario.isActivo ? 'Activo' : 'Inactivo'}`;
  });

  protected readonly columns: JDataTableColumn[] = [
    { key: 'tipoDocumentoCodigo', header: 'Tipo doc.', sortable: true, align: 'center' },
    { key: 'numeroDocumento', header: 'Documento', sortable: true },
    { key: 'titular', header: 'Titular', sortable: true },
    { key: 'email', header: 'Correo', render: (value) => String(value ?? '-') },
    {
      key: 'totalCuentas',
      header: 'Cuentas',
      sortable: true,
      align: 'right',
      render: (value) => String(value ?? 0),
    },
    {
      key: 'totalOperaciones',
      header: 'Operaciones',
      sortable: true,
      align: 'right',
      render: (value) => String(value ?? 0),
    },
    {
      key: 'isActivo',
      header: 'Estado',
      sortable: true,
      render: (value) => (value ? 'Activo' : 'Inactivo'),
    },
  ];

  protected onDocumento(event: Event): void {
    this.filtroDocumento.set((event.target as HTMLInputElement).value);
  }

  protected onTitular(event: Event): void {
    this.filtroTitular.set((event.target as HTMLInputElement).value);
  }

  protected onActivo(event: Event): void {
    this.filtroActivo.set((event.target as HTMLSelectElement).value);
  }

  protected onAplicarFiltros(): void {
    this.page.set(1);
    this.load();
  }

  protected onResetFiltros(): void {
    this.filtroDocumento.set('');
    this.filtroTitular.set('');
    this.filtroActivo.set('');
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
    this.openDetalle(event.row as unknown as Beneficiario);
  }

  protected openDetalle(beneficiario: Beneficiario): void {
    this.detalleSeleccionado.set(beneficiario);
    this.detalleTab.set('datos');
  }

  protected closeDetalle(): void {
    this.detalle.set(null);
    this.detalleLoading.set(null);
    this.detalleSeleccionado.set(null);
    this.detalleTab.set('datos');
  }

  protected load(): void {
    return;
  }

  protected buildBackendFilters(): BeneficiarioFiltro {
    const filters: BeneficiarioFiltro = {};
    const numeroDocumento = this.filtroDocumento().trim();
    const titular = this.filtroTitular().trim();
    const activo = this.filtroActivo().trim();

    if (numeroDocumento) filters.numeroDocumento = numeroDocumento;
    if (titular) filters.titular = titular;
    if (activo === 'true' || activo === 'false') {
      filters.isActivo = activo === 'true';
    }

    return filters;
  }

  protected setPagedResult(result: Paginated<Beneficiario>): void {
    this.rowsSignal.set(result.items);
    this.page.set(result.pagination.page);
    this.pageSize.set(result.pagination.pageSize);
    this.total.set(result.pagination.total);
  }

  protected setDetalle(detalle: BeneficiarioDetalle): void {
    this.detalle.set(detalle);
  }

  protected cuentas(detalle: BeneficiarioDetalle | null): OperacionDetalleRegistro[] {
    return (detalle?.cuentas ?? []) as unknown as OperacionDetalleRegistro[];
  }

  protected operaciones(detalle: BeneficiarioDetalle | null): Operacion[] {
    return detalle?.operaciones ?? [];
  }

  protected recordEntries(record: OperacionDetalleRegistro | null | undefined): DetalleCampo[] {
    if (!record) {
      return [];
    }
    return Object.entries(record).map(([key, value]) => ({
      key,
      label: this.label(key),
      value: this.formatDetailValue(key, value),
      isJson: this.isJsonValue(value),
    }));
  }

  protected scalarEntries(record: OperacionDetalleRegistro | null | undefined): DetalleCampo[] {
    return this.recordEntries(record).filter((field) => !field.isJson && !BENEFICIARIO_EXCLUDED_FIELDS.has(field.key.toLowerCase()));
  }

  protected jsonEntries(record: OperacionDetalleRegistro | null | undefined): DetalleCampo[] {
    return this.recordEntries(record).filter((field) => field.isJson);
  }

  protected hasJson(detalle: BeneficiarioDetalle): boolean {
    return [detalle.beneficiario, ...this.cuentas(detalle)].some((record) => this.jsonEntries(record).length > 0);
  }

  protected detailValue(record: OperacionDetalleRegistro | null | undefined, key: string): string {
    if (!record) {
      return '-';
    }
    const value = record[key] ?? record[key.toLowerCase()];
    return this.formatDetailValue(key, value);
  }

  protected cuentaLabel(cuenta: OperacionDetalleRegistro): string {
    const entidad = this.detailValue(cuenta, 'entidadFinCodigo');
    const tipo = this.detailValue(cuenta, 'tipoCuentaCodigo');
    const moneda = this.detailValue(cuenta, 'monedaCodigo');
    return `${entidad} - ${tipo} - ${moneda}`;
  }

  protected cuentaNumero(cuenta: OperacionDetalleRegistro): string {
    const numero = this.detailValue(cuenta, 'numeroCuenta');
    return numero !== '-' ? numero : this.detailValue(cuenta, 'cuentaInterbancaria');
  }

  protected operacionCuenta(operacion: Operacion): string {
    const cuenta = operacion.beneficiarioCuenta;
    if (!cuenta) {
      return '-';
    }
    return cuenta.numeroCuenta ?? cuenta.cuentaInterbancaria ?? '-';
  }

  protected montoOperacion(operacion: Operacion): string {
    return `${operacion.monedaCodigo ?? ''} ${NUM.format(Number(operacion.montoTotal ?? 0))}`.trim();
  }

  private formatDetailValue(key: string, value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    if (typeof value === 'boolean') {
      return value ? 'Si' : 'No';
    }
    if (typeof value === 'number' && (key.toLowerCase().includes('monto') || key.toLowerCase().includes('importe'))) {
      return NUM.format(value);
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2) ?? '-';
    }
    return String(value);
  }

  private isJsonValue(value: unknown): boolean {
    return value !== null && typeof value === 'object';
  }

  private label(key: string): string {
    const labels: Record<string, string> = {
      id: 'Id',
      tipobeneficiariocodigo: 'Tipo beneficiario',
      tipoBeneficiarioCodigo: 'Tipo beneficiario',
      tipodocumentocodigo: 'Tipo documento',
      tipoDocumentoCodigo: 'Tipo documento',
      numerodocumento: 'Numero documento',
      numeroDocumento: 'Numero documento',
      correlativodoc: 'Correlativo',
      correlativoDoc: 'Correlativo',
      titular: 'Titular',
      email: 'Correo',
      telefono: 'Telefono',
      codigoexterno: 'Codigo externo',
      codigoExterno: 'Codigo externo',
      isactivo: 'Activo',
      isActivo: 'Activo',
      identidadfin: 'Entidad financiera',
      entidadfincodigo: 'Entidad financiera',
      entidadFinCodigo: 'Entidad financiera',
      tipocuentacodigo: 'Tipo cuenta',
      tipoCuentaCodigo: 'Tipo cuenta',
      monedacodigo: 'Moneda',
      monedaCodigo: 'Moneda',
      numerocuenta: 'Numero cuenta',
      numeroCuenta: 'Numero cuenta',
      cuentainterbancaria: 'Cuenta interbancaria',
      cuentaInterbancaria: 'Cuenta interbancaria',
      iscuentapropia: 'Cuenta propia',
      isCuentaPropia: 'Cuenta propia',
      isprincipal: 'Principal',
      isPrincipal: 'Principal',
      atributos: 'Atributos',
      schemajson: 'Schema JSON',
      schemaJson: 'Schema JSON',
    };
    return labels[key] ?? labels[key.toLowerCase()] ?? key;
  }
}
