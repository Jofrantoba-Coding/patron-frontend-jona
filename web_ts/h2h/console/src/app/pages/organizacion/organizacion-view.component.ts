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
  type JDataTableColumn,
  type JDataTableRow,
} from 'uijona-4ngular';
import type { OperacionDetalleRegistro, OrganizacionConfiguracion, OrganizacionDetalle } from '../../core/models';

interface DetalleCampo {
  key: string;
  label: string;
  value: string;
  isJson: boolean;
}

type ConfigTab = 'datos' | 'json';

@Component({
  selector: 'app-organizacion-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, JDialog, JTabs, JTabsList, JTabsTrigger, JTabsContent, JBadge],
  templateUrl: './organizacion-view.component.html',
})
export class OrganizacionViewComponent {
  protected readonly detalle = signal<OrganizacionDetalle | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly filtroConfiguracion = signal<string>('');
  protected readonly configSeleccionada = signal<OrganizacionConfiguracion | null>(null);
  protected readonly configTab = signal<ConfigTab>('datos');
  protected readonly page = signal<number>(1);
  protected readonly pageSize = signal<number>(5);

  protected readonly rowKey = (row: JDataTableRow) => String((row as unknown as OrganizacionConfiguracion).id);
  protected readonly configuraciones = computed(() => this.detalle()?.configuraciones ?? []);
  protected readonly configuracionesFiltradas = computed<OrganizacionConfiguracion[]>(() => {
    const filtro = this.filtroConfiguracion().trim().toLowerCase();
    const rows = this.configuraciones();
    if (!filtro) {
      return rows;
    }
    return rows.filter((row) => {
      const text = `${row.pk ?? ''} ${row.sk ?? ''} ${row.codigo ?? ''} ${row.codigoPadre ?? ''} ${row.descripcion ?? ''} ${row.clase ?? ''}`.toLowerCase();
      return text.includes(filtro);
    });
  });
  protected readonly total = computed(() => this.configuracionesFiltradas().length);
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  protected readonly configuracionesPaginadas = computed<JDataTableRow[]>(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.configuracionesFiltradas().slice(start, start + this.pageSize()) as unknown as JDataTableRow[];
  });

  protected readonly columns: JDataTableColumn[] = [
    { key: 'pk', header: 'PK', sortable: true },
    { key: 'sk', header: 'SK', sortable: true, render: (value) => String(value ?? '-') },
    { key: 'codigo', header: 'Codigo', sortable: true },
    { key: 'descripcion', header: 'Descripcion', sortable: true },
    { key: 'typeValor', header: 'Tipo valor', sortable: true, render: (value) => String(value ?? '-') },
    { key: 'clase', header: 'Clase', sortable: true, render: (value) => String(value ?? '-') },
  ];

  protected load(): void {
    return;
  }

  protected setDetalle(detalle: OrganizacionDetalle): void {
    this.detalle.set(detalle);
    this.page.set(1);
  }

  protected onFiltroConfiguracion(event: Event): void {
    this.filtroConfiguracion.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  protected onPageChange(page: number): void {
    this.page.set(page);
  }

  protected onRowClick(event: { row: JDataTableRow; index: number }): void {
    this.configSeleccionada.set(event.row as unknown as OrganizacionConfiguracion);
    this.configTab.set('datos');
  }

  protected closeConfig(): void {
    this.configSeleccionada.set(null);
    this.configTab.set('datos');
  }

  protected onConfigTab(tab: string): void {
    this.configTab.set(tab as ConfigTab);
  }

  protected configRecord(config: OrganizacionConfiguracion | null): OperacionDetalleRegistro {
    return (config ?? {}) as unknown as OperacionDetalleRegistro;
  }

  protected recordEntries(record: OperacionDetalleRegistro | null | undefined): DetalleCampo[] {
    if (!record) {
      return [];
    }
    return Object.entries(record).map(([key, value]) => ({
      key,
      label: this.label(key),
      value: this.formatDetailValue(value),
      isJson: this.isJsonValue(value),
    }));
  }

  protected scalarEntries(record: OperacionDetalleRegistro | null | undefined): DetalleCampo[] {
    return this.recordEntries(record).filter((field) => !field.isJson && !['idorganizacion', 'version', 'ispersistente'].includes(field.key.toLowerCase()));
  }

  protected jsonEntries(record: OperacionDetalleRegistro | null | undefined): DetalleCampo[] {
    return this.recordEntries(record).filter((field) => field.isJson);
  }

  protected detailValue(record: OperacionDetalleRegistro | null | undefined, key: string): string {
    if (!record) {
      return '-';
    }
    return this.formatDetailValue(record[key] ?? record[key.toLowerCase()]);
  }

  private formatDetailValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    if (typeof value === 'boolean') {
      return value ? 'Si' : 'No';
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
      codigo: 'Codigo',
      abreviatura: 'Abreviatura',
      razonsocial: 'Razon social',
      razonSocial: 'Razon social',
      nombrecomercial: 'Nombre comercial',
      nombreComercial: 'Nombre comercial',
      tipodocumentocodigo: 'Tipo documento',
      tipoDocumentoCodigo: 'Tipo documento',
      numerodocumento: 'Numero documento',
      numeroDocumento: 'Numero documento',
      ambiente: 'Ambiente',
      secretoalgoritmo: 'Algoritmo secreto',
      secretoAlgoritmo: 'Algoritmo secreto',
      secretorotado: 'Secreto rotado',
      secretoRotado: 'Secreto rotado',
      isusakeycloak: 'Usa Keycloak',
      isUsaKeycloak: 'Usa Keycloak',
      keycloakrealm: 'Keycloak realm',
      keycloakRealm: 'Keycloak realm',
      keycloakclient: 'Keycloak client',
      keycloakClient: 'Keycloak client',
      claimorgid: 'Claim org id',
      claimOrgid: 'Claim org id',
      isactivo: 'Activo',
      isActivo: 'Activo',
      pk: 'PK',
      sk: 'SK',
      codigopadre: 'Codigo padre',
      codigoPadre: 'Codigo padre',
      descripcion: 'Descripcion',
      valor: 'Valor',
      typevalor: 'Tipo valor',
      typeValor: 'Tipo valor',
      schemajson: 'Schema JSON',
      schemaJson: 'Schema JSON',
      orden: 'Orden',
      clase: 'Clase',
      marcatiempo: 'Marca tiempo',
      marcaTiempo: 'Marca tiempo',
    };
    return labels[key] ?? labels[key.toLowerCase()] ?? key;
  }
}
