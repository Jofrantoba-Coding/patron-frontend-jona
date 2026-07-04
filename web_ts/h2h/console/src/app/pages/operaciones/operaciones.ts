import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JDataTable, JSectionHeading, type JDataTableColumn, type JDataTableRow } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { Operacion, ProductoGrupo } from '../../core/models';

const NUM = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 });

/** Tipo de operación → grupo de producto (para filtrar en modo "todas"). */
const TIPOOP_GRUPO: Record<string, ProductoGrupo> = {
  PAGO_HABER: 'pagos_masivos',
  PAGO_CTS: 'pagos_masivos',
  PAGO_PROVEEDOR: 'pagos_masivos',
  PAGO_CHEQUE_GERENCIA: 'pagos_masivos',
  RETIRO_INVITADO: 'pagos_masivos',
  PAGO_TRANSFERENCIA: 'transferencias',
  PAGO_FACTORING: 'factoring',
};

interface Subtipo {
  code: string;
  label: string;
}
interface ProductoMeta {
  eyebrow: string;
  heading: string;
  description: string;
  subtipos: Subtipo[];
}

const META: Record<ProductoGrupo, ProductoMeta> = {
  pagos_masivos: {
    eyebrow: 'Producto · Pagos Masivos',
    heading: 'Pagos Masivos',
    description: 'Operaciones de Haberes, CTS, Proveedores y Cheque de Gerencia.',
    subtipos: [
      { code: '', label: 'Todos los subtipos' },
      { code: 'PAGO_HABER', label: 'Haberes' },
      { code: 'PAGO_CTS', label: 'CTS' },
      { code: 'PAGO_PROVEEDOR', label: 'Proveedores' },
      { code: 'PAGO_CHEQUE_GERENCIA', label: 'Cheque de Gerencia' },
      { code: 'RETIRO_INVITADO', label: 'Retiro invitado' },
    ],
  },
  transferencias: {
    eyebrow: 'Producto · Transferencias',
    heading: 'Transferencias',
    description: 'Transferencias a cuentas propias/terceros BCP e interbancarias (CCE/BCR).',
    subtipos: [],
  },
  factoring: {
    eyebrow: 'Producto · Factoring Electrónico',
    heading: 'Factoring Electrónico',
    description: 'Planillas de Confirming (Factoring Electrónico) por bloques de documentos.',
    subtipos: [],
  },
};

const META_TODAS: ProductoMeta = {
  eyebrow: 'Operación',
  heading: 'Todas las operaciones',
  description: 'Todas las operaciones cargadas para el flujo H2H. Use el panel para filtrar.',
  subtipos: [],
};

@Component({
  selector: 'app-operaciones',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable],
  template: `
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <j-section-heading [eyebrow]="meta().eyebrow" [heading]="meta().heading" [description]="meta().description" />

      @if (esTodas()) {
        <div class="flex flex-wrap items-end gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-neutral-500" for="f-producto">Producto</label>
            <select id="f-producto" class="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm" [value]="filtroProducto()" (change)="onProducto($event)">
              <option value="">Todos</option>
              <option value="pagos_masivos">Pagos Masivos</option>
              <option value="transferencias">Transferencias</option>
              <option value="factoring">Factoring Electrónico</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-neutral-500" for="f-estado">Estado</label>
            <select id="f-estado" class="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm" [value]="filtroEstado()" (change)="onEstado($event)">
              <option value="">Todos</option>
              @for (e of estados(); track e) {
                <option [value]="e">{{ e }}</option>
              }
            </select>
          </div>
        </div>
      } @else if (meta().subtipos.length > 1) {
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-neutral-600" for="subtipo">Subtipo</label>
          <select
            id="subtipo"
            class="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            [value]="subtipo()"
            (change)="onSubtipo($event)"
          >
            @for (s of meta().subtipos; track s.code) {
              <option [value]="s.code">{{ s.label }}</option>
            }
          </select>
        </div>
      }

      <j-data-table
        [columns]="columns"
        [data]="rows()"
        [rowKey]="rowKey"
        [showFilter]="true"
        filterPlaceholder="Buscar por código, beneficiario, cuenta…"
        emptyTitle="Sin operaciones"
        emptyDescription="No hay operaciones para el filtro actual."
      />
    </div>
  `,
})
export class OperacionesPage {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  protected readonly producto = signal<ProductoGrupo | null>(null);
  protected readonly subtipo = signal<string>('');
  protected readonly filtroProducto = signal<string>('');
  protected readonly filtroEstado = signal<string>('');
  private readonly master = signal<Operacion[]>([]);

  protected readonly esTodas = () => this.producto() === null;
  protected readonly meta = () => (this.producto() ? META[this.producto() as ProductoGrupo] : META_TODAS);
  protected readonly rowKey = (r: JDataTableRow) => String((r as unknown as Operacion).ope_u_id);

  /** Estados presentes en el dataset (para el panel de búsqueda en modo "todas"). */
  protected readonly estados = computed(() =>
    Array.from(new Set(this.master().map((o) => o.ope_n_id_estadooperacion_code))).sort()
  );

  /** Filas visibles: en modo "todas" aplica filtros de panel; en modo producto ya vienen filtradas del server. */
  protected readonly rows = computed<JDataTableRow[]>(() => {
    let list = this.master();
    if (this.esTodas()) {
      const gp = this.filtroProducto();
      const est = this.filtroEstado();
      if (gp) list = list.filter((o) => TIPOOP_GRUPO[o.ope_n_id_tipooperacion_code] === gp);
      if (est) list = list.filter((o) => o.ope_n_id_estadooperacion_code === est);
    }
    return list as unknown as JDataTableRow[];
  });

  protected readonly columns: JDataTableColumn[] = [
    { key: 'ope_v_codigo_operacion', header: 'Código', sortable: true },
    { key: 'ope_n_id_tipooperacion_code', header: 'Tipo', sortable: true },
    {
      key: 'beneficiario',
      header: 'Beneficiario',
      render: (_v, row) => {
        const o = row as unknown as Operacion;
        return `${o.beneficiario.ben_v_nombre} · ${o.beneficiario.ben_n_id_tipodocumento_code} ${o.beneficiario.ben_v_numerodocumento}`;
      },
    },
    {
      key: 'cuenta',
      header: 'Cuenta',
      render: (_v, row) => {
        const c = (row as unknown as Operacion).cuenta;
        return `${c.entidadFinanciera} ${c.tipoCuenta} · ${c.numeroCuenta ?? c.cuentaInterbancaria ?? '—'}`;
      },
    },
    { key: 'ope_n_id_moneda_code', header: 'Mon.', sortable: true, align: 'center' },
    {
      key: 'ope_dec_montototal',
      header: 'Monto',
      sortable: true,
      align: 'right',
      render: (v) => NUM.format(Number(v ?? 0)),
    },
    { key: 'ope_n_id_estadooperacion_code', header: 'Estado', sortable: true },
  ];

  protected onSubtipo(e: Event): void {
    this.subtipo.set((e.target as HTMLSelectElement).value);
    this.load();
  }
  protected onProducto(e: Event): void {
    this.filtroProducto.set((e.target as HTMLSelectElement).value);
  }
  protected onEstado(e: Event): void {
    this.filtroEstado.set((e.target as HTMLSelectElement).value);
  }

  private load(): void {
    const prod = this.producto();
    if (prod) {
      const subtipo = this.subtipo() || undefined;
      this.api.operaciones({ producto: prod, subtipo }).subscribe((res) => this.master.set(res.items));
    } else {
      this.api.operaciones({ pageSize: 200 }).subscribe((res) => this.master.set(res.items));
    }
  }

  constructor() {
    this.route.data.subscribe((data) => {
      this.producto.set((data['producto'] as ProductoGrupo) ?? null);
      this.subtipo.set('');
      this.filtroProducto.set('');
      this.filtroEstado.set('');
      this.load();
    });
  }
}
