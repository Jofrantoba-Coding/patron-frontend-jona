import type { JDataTableResponsiveMode, JDataTableSortDirection, JDataTableRow, JDataTableColumn, JDataTableSort, InterJDataTable } from './InterJDataTable';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { cn } from '../../core/cn';
/**
 * JDataTable — tabla de datos con columnas configurables, filtro y orden
 * client-side (o controlados por `sort`/`filterValue`), estados loading/vacío.
 */
@Component({
  selector: 'j-data-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  templateUrl: './JDataTableView.html',
})
export class JDataTable {
  readonly columns = input.required<JDataTableColumn[]>();
  readonly data = input.required<JDataTableRow[]>();
  readonly rowKey = input.required<(row: JDataTableRow, index: number) => string>();
  readonly sort = input<JDataTableSort>();
  readonly loading = input<boolean>(false);
  readonly emptyTitle = input<string>('Sin datos');
  readonly emptyDescription = input<string>('No hay registros para mostrar.');
  readonly filterValue = input<string>();
  readonly filterPlaceholder = input<string>('Buscar...');
  readonly showFilter = input<boolean>(false);
  readonly stickyHeader = input<boolean>(false);
  readonly className = input<string>('');
  readonly responsiveMode = input<JDataTableResponsiveMode>('scroll');
  readonly mobileActionLabel = input<string>('Ver detalle');

  readonly sortChange = output<JDataTableSort>();
  readonly filterChange = output<string>();
  readonly rowClick = output<{ row: JDataTableRow; index: number }>();

  protected readonly cn = cn;
  private readonly internalSort = signal<JDataTableSort | undefined>(undefined);
  private readonly internalFilter = signal('');

  protected readonly effectiveSort = computed(() => this.sort() ?? this.internalSort());
  protected readonly effectiveFilter = computed(() => this.filterValue() ?? this.internalFilter());

  private readonly filtered = computed(() => {
    // Controlado externamente: no filtrar
    if (this.filterValue() !== undefined || !this.effectiveFilter().trim()) return this.data();
    const q = this.effectiveFilter().toLowerCase();
    return this.data().filter((row) =>
      this.columns().some((col) => String(row[col.key] ?? '').toLowerCase().includes(q))
    );
  });

  protected readonly rows = computed(() => {
    const sort = this.effectiveSort();
    if (this.sort() !== undefined || !sort || sort.direction === null) return this.filtered();
    const key = sort.key;
    return [...this.filtered()].sort((a, b) => {
      const aStr = String(a[key] ?? '');
      const bStr = String(b[key] ?? '');
      const cmp = isNaN(Number(aStr)) ? aStr.localeCompare(bStr) : Number(aStr) - Number(bStr);
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  });

  protected dirFor(col: JDataTableColumn): JDataTableSortDirection {
    const s = this.effectiveSort();
    return s?.key === col.key ? (s.direction ?? null) : null;
  }

  protected ariaSort(col: JDataTableColumn): string | null {
    const d = this.dirFor(col);
    return d === 'asc' ? 'ascending' : d === 'desc' ? 'descending' : null;
  }

  protected tableClasses(): string {
    return this.responsiveMode() === 'cards'
      ? 'block w-full min-w-0 caption-bottom text-sm md:table'
      : 'w-full min-w-max caption-bottom text-sm';
  }

  protected headerClasses(col: JDataTableColumn): string {
    return cn(
      'h-10 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-neutral-500 select-none',
      col.align === 'center' && 'text-center',
      col.align === 'right' && 'text-right',
      col.sortable && 'cursor-pointer hover:text-neutral-800'
    );
  }
  protected cellClasses(col: JDataTableColumn): string {
    return cn(
      'px-4 py-3 align-middle text-neutral-900',
      col.align === 'center' && 'text-center',
      col.align === 'right' && 'text-right',
      this.responsiveMode() === 'cards' && [
        'flex min-w-0 flex-col gap-1 border-b border-neutral-100 px-0 py-2 text-left last:border-b-0',
        'before:text-[10px] before:font-semibold before:uppercase before:tracking-wide before:text-neutral-500',
        'before:content-[attr(data-label)] md:table-cell md:border-0 md:px-4 md:py-3 md:before:content-none',
      ],
      this.responsiveMode() === 'cards' && (col.mobilePriority ?? 99) <= 4 && 'font-medium text-neutral-950'
    );
  }

  protected mobileOrder(col: JDataTableColumn, index: number): number {
    return col.mobilePriority ?? index + 20;
  }
  protected cellText(col: JDataTableColumn, row: JDataTableRow, ri: number): string {
    const raw = row[col.key];
    return col.render ? col.render(raw, row, ri) : String(raw ?? '');
  }

  protected onHeaderClick(col: JDataTableColumn): void {
    if (!col.sortable) return;
    const s = this.effectiveSort();
    const next: JDataTableSortDirection =
      s?.key === col.key ? (s.direction === 'asc' ? 'desc' : s.direction === 'desc' ? null : 'asc') : 'asc';
    const sort: JDataTableSort = { key: col.key, direction: next };
    this.internalSort.set(next === null ? undefined : sort);
    this.sortChange.emit(sort);
  }

  protected onFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.internalFilter.set(value);
    this.filterChange.emit(value);
  }

  protected onRowClick(row: JDataTableRow, index: number): void {
    this.rowClick.emit({ row, index });
  }

  protected onRowAction(event: MouseEvent, row: JDataTableRow, index: number): void {
    event.stopPropagation();
    this.onRowClick(row, index);
  }
}
