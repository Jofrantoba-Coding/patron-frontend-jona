import { J_TABLE_TEMPLATE_1, J_TABLE_TEMPLATE_2, J_TABLE_TEMPLATE_3, J_TABLE_TEMPLATE_4, J_TABLE_TEMPLATE_5, J_TABLE_TEMPLATE_6, J_TABLE_TEMPLATE_7, J_TABLE_TEMPLATE_8 } from './JTableView';
import type { JTableResponsiveMode, JTableSortDirection } from './InterJTable';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';

const OUTER_CLASSES: Record<JTableResponsiveMode, string> = {
  scroll: 'relative flex w-full max-w-full flex-col md:rounded-md md:border md:border-neutral-200',
  cards: 'relative flex w-full max-w-full flex-col md:rounded-md md:border md:border-neutral-200',
  none: 'relative flex w-full max-w-full flex-col rounded-md border border-neutral-200',
};

const INNER_CLASSES: Record<JTableResponsiveMode, string> = {
  scroll: 'overflow-x-auto',
  cards: '',
  none: 'overflow-x-auto',
};

/**
 * JTable — tabla componible. Se compone con JTableHeader / JTableBody /
 * JTableFooter / JTableRow / JTableHead / JTableCell / JTableCaption.
 * `responsiveMode`: scroll (default), cards (apila en móvil) o none.
 *
 * Nota: el redimensionado de columnas por arrastre y el filtro auto-gestionado por
 * contexto del original React no se portan; usa `sortable` + `(sortChange)` y
 * proyecta tus propios controles de filtro.
 */
@Component({
  selector: 'j-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_TABLE_TEMPLATE_1,
})
export class JTable {
  readonly responsiveMode = input<JTableResponsiveMode>('scroll');
  readonly wrapperClassName = input<string>('');
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  protected readonly cn = cn;
  protected readonly outer = computed(() => OUTER_CLASSES[this.responsiveMode()]);
  protected readonly inner = computed(() => INNER_CLASSES[this.responsiveMode()]);
  protected readonly tableClasses = computed(() => {
    const m = this.responsiveMode();
    return cn(
      'caption-bottom text-sm text-neutral-900',
      m === 'scroll' && 'w-full min-w-max',
      m === 'cards' && 'block w-full min-w-0 md:table',
      m === 'none' && 'w-full min-w-max',
      this.className()
    );
  });
}

@Component({
  selector: 'j-table-caption',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_TABLE_TEMPLATE_2,
})
export class JTableCaption {
  readonly className = input<string>('');
  protected readonly cn = cn;
}

@Component({
  selector: 'j-table-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_TABLE_TEMPLATE_3,
})
export class JTableHeader {
  private readonly table = inject(JTable, { optional: true });
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn(
      this.table?.responsiveMode() === 'cards' ? 'hidden md:table-header-group' : 'table-header-group',
      'bg-neutral-50 [&_tr]:border-b',
      this.className()
    )
  );
}

@Component({
  selector: 'j-table-body',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_TABLE_TEMPLATE_4,
})
export class JTableBody {
  private readonly table = inject(JTable, { optional: true });
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn(
      this.table?.responsiveMode() === 'cards' ? 'block md:table-row-group' : 'table-row-group',
      '[&_tr:last-child]:border-b-0',
      this.className()
    )
  );
}

@Component({
  selector: 'j-table-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_TABLE_TEMPLATE_5,
})
export class JTableFooter {
  private readonly table = inject(JTable, { optional: true });
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn(
      this.table?.responsiveMode() === 'cards' ? 'block md:table-footer-group' : 'table-footer-group',
      'bg-neutral-50 font-medium [&>tr]:last:border-b-0',
      this.className()
    )
  );
}

@Component({
  selector: 'j-table-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_TABLE_TEMPLATE_6,
})
export class JTableRow {
  private readonly table = inject(JTable, { optional: true });
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn(
      'transition-colors hover:bg-neutral-50 data-[state=selected]:bg-primary-50',
      this.table?.responsiveMode() === 'cards'
        ? 'mb-3 grid min-w-0 grid-cols-1 gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm md:table-row md:rounded-none md:border-0 md:border-b md:border-neutral-200 md:bg-transparent md:p-0 md:shadow-none'
        : 'border-b border-neutral-200',
      this.className()
    )
  );
}

@Component({
  selector: 'j-table-head',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_TABLE_TEMPLATE_7,
})
export class JTableHead {
  readonly columnIndex = input<number>();
  readonly groupHeader = input<boolean>(false);
  readonly sortable = input<boolean>(false);
  readonly sortDirection = input<JTableSortDirection>(null);
  readonly sortCycle = input<JTableSortDirection[]>(['asc', 'desc', null]);
  readonly colSpan = input<number>();
  readonly scope = input<string>();
  readonly width = input<string>();
  readonly className = input<string>('');

  readonly sortChange = output<JTableSortDirection>();

  protected readonly cn = cn;
  protected readonly ariaSort = computed(() => {
    if (!this.sortable() || this.groupHeader()) return null;
    const d = this.sortDirection();
    return d === 'asc' ? 'ascending' : d === 'desc' ? 'descending' : null;
  });

  protected readonly classes = computed(() =>
    cn(
      'relative h-10 px-4 text-left align-middle font-medium text-neutral-500 whitespace-nowrap',
      this.groupHeader() && 'border-b border-neutral-200 bg-neutral-100 text-center text-neutral-700',
      this.sortable() && 'select-none',
      this.className()
    )
  );

  protected onSort(event: MouseEvent): void {
    event.stopPropagation();
    const cycle = this.sortCycle();
    const idx = cycle.indexOf(this.sortDirection());
    const next = cycle[idx === -1 || idx === cycle.length - 1 ? 0 : idx + 1];
    this.sortChange.emit(next);
  }
}

@Component({
  selector: 'j-table-cell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_TABLE_TEMPLATE_8,
})
export class JTableCell {
  private readonly table = inject(JTable, { optional: true });
  readonly colSpan = input<number>();
  readonly dataLabel = input<string>();
  readonly className = input<string>('');

  protected readonly classes = computed(() =>
    cn(
      'break-words text-neutral-900',
      this.table?.responsiveMode() === 'cards'
        ? cn(
            'flex min-w-0 flex-col gap-1 text-sm md:table-cell md:px-4 md:py-3 md:align-middle',
            'before:break-words before:text-[10px] before:font-semibold before:uppercase before:tracking-wide before:text-neutral-400',
            'before:content-[attr(data-label)] md:before:content-none'
          )
        : 'px-4 py-3 align-middle',
      this.className()
    )
  );
}
