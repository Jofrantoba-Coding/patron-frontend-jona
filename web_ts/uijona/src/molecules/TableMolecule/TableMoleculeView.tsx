import React from 'react';
import { cn } from '../../lib/cn';
import {
  InterTableHeadProps,
  InterTableMolecule,
  TablePaginationConfig,
  TableResponsiveMode,
  TableSortDirection,
} from './InterTableMolecule';
import { useTableContext } from './TableMoleculeContext';

const outerClasses: Record<TableResponsiveMode, string> = {
  scroll: 'relative flex w-full max-w-full flex-col md:rounded-md md:border md:border-neutral-200',
  cards: 'relative flex w-full max-w-full flex-col md:rounded-md md:border md:border-neutral-200',
  none: 'relative flex w-full max-w-full flex-col rounded-md border border-neutral-200',
};

const innerScrollClasses: Record<TableResponsiveMode, string> = {
  scroll: 'overflow-x-auto',
  cards: '',
  none: 'overflow-x-auto',
};

export const TableMoleculeView = React.forwardRef<HTMLTableElement, InterTableMolecule>(
  ({ className, wrapperClassName, responsiveMode = 'scroll', pagination, style,
     columns: _columns, data: _data, caption: _caption, emptyMessage: _emptyMessage,
     ...props }, ref) => (
    <div className={cn(outerClasses[responsiveMode], wrapperClassName)}>
      <div className={innerScrollClasses[responsiveMode]}>
        <table
          ref={ref}
          style={responsiveMode !== 'none' ? undefined : style}
          className={cn(
            'caption-bottom text-sm text-neutral-900',
            responsiveMode === 'scroll' && 'w-full min-w-max',
            responsiveMode === 'cards' && 'block w-full min-w-0 md:table',
            responsiveMode === 'none' && 'w-full min-w-max',
            className
          )}
          {...props}
        />
      </div>
      {pagination && <TablePaginationView {...pagination} />}
    </div>
  )
);
TableMoleculeView.displayName = 'TableMolecule';

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);

  const windowStart = Math.max(2, current - 2);
  const windowEnd = Math.min(total - 1, current + 2);
  const pages: (number | 'ellipsis')[] = [1];

  if (windowStart > 2) pages.push('ellipsis');
  for (let i = windowStart; i <= windowEnd; i += 1) pages.push(i);
  if (windowEnd < total - 1) pages.push('ellipsis');

  pages.push(total);
  return pages;
}

function PaginationButton({
  children,
  active,
  disabled,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-8 min-w-[2rem] items-center justify-center rounded-md px-2 text-sm font-medium transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        active ? 'bg-primary-600 text-white' : 'text-neutral-600 hover:bg-neutral-100',
        disabled && 'pointer-events-none opacity-40'
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function TablePaginationView({
  currentPage,
  pageSize,
  totalRows,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  showRowsInfo = true,
}: TablePaginationConfig) {
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(totalRows / safePageSize));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const firstRow = totalRows === 0 ? 0 : Math.min((safeCurrentPage - 1) * safePageSize + 1, totalRows);
  const lastRow = Math.min(safeCurrentPage * safePageSize, totalRows);
  const pages = getPageNumbers(safeCurrentPage, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-neutral-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      {showRowsInfo && (
        <p className="shrink-0 text-sm text-neutral-500">
          Mostrando{' '}
          <span className="font-medium text-neutral-700">{firstRow}</span>
          {' - '}
          <span className="font-medium text-neutral-700">{lastRow}</span>
          {' '}de{' '}
          <span className="font-medium text-neutral-700">{totalRows}</span>
          {' '}resultados
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <span className="shrink-0">Filas por pagina</span>
            <select
              value={pageSize}
              onChange={(event) => {
                onPageSizeChange(Number(event.target.value));
                onPageChange(1);
              }}
              className="h-8 rounded-md border border-neutral-300 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}

        <nav aria-label="Paginacion de tabla" className="flex items-center gap-1">
          <PaginationButton
            aria-label="Primera pagina"
            disabled={safeCurrentPage === 1}
            onClick={() => onPageChange(1)}
          >
            {'<<'}
          </PaginationButton>

          <PaginationButton
            aria-label="Pagina anterior"
            disabled={safeCurrentPage === 1}
            onClick={() => onPageChange(safeCurrentPage - 1)}
          >
            {'<'}
          </PaginationButton>

          {pages.map((page, index) =>
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="select-none px-1 text-neutral-400">...</span>
            ) : (
              <PaginationButton
                key={page}
                active={page === safeCurrentPage}
                aria-label={`Pagina ${page}`}
                aria-current={page === safeCurrentPage ? 'page' : undefined}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationButton>
            )
          )}

          <PaginationButton
            aria-label="Pagina siguiente"
            disabled={safeCurrentPage === totalPages}
            onClick={() => onPageChange(safeCurrentPage + 1)}
          >
            {'>'}
          </PaginationButton>

          <PaginationButton
            aria-label="Ultima pagina"
            disabled={safeCurrentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            {'>>'}
          </PaginationButton>
        </nav>
      </div>
    </div>
  );
}

export const TableCaptionView = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('mt-4 text-sm text-neutral-500', className)} {...props} />
  )
);
TableCaptionView.displayName = 'TableCaption';

export const TableHeaderView = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    const { responsiveMode } = useTableContext();
    return (
      <thead
        ref={ref}
        className={cn(
          responsiveMode === 'cards' ? 'hidden md:table-header-group' : 'table-header-group',
          'bg-neutral-50 [&_tr]:border-b',
          className
        )}
        {...props}
      />
    );
  }
);
TableHeaderView.displayName = 'TableHeader';

export const TableBodyView = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    const { responsiveMode } = useTableContext();
    return (
      <tbody
        ref={ref}
        className={cn(
          responsiveMode === 'cards' ? 'block md:table-row-group' : 'table-row-group',
          '[&_tr:last-child]:border-b-0',
          className
        )}
        {...props}
      />
    );
  }
);
TableBodyView.displayName = 'TableBody';

export const TableFooterView = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    const { responsiveMode } = useTableContext();
    return (
      <tfoot
        ref={ref}
        className={cn(
          responsiveMode === 'cards' ? 'block md:table-footer-group' : 'table-footer-group',
          'bg-neutral-50 font-medium [&>tr]:last:border-b-0',
          className
        )}
        {...props}
      />
    );
  }
);
TableFooterView.displayName = 'TableFooter';

export const TableRowView = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => {
    const { responsiveMode } = useTableContext();
    return (
      <tr
        ref={ref}
        className={cn(
          'transition-colors hover:bg-neutral-50 data-[state=selected]:bg-primary-50',
          responsiveMode === 'cards'
            ? 'mb-3 grid min-w-0 grid-cols-1 gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm md:table-row md:rounded-none md:border-0 md:border-b md:border-neutral-200 md:bg-transparent md:p-0 md:shadow-none'
            : 'border-b border-neutral-200',
          className
        )}
        {...props}
      />
    );
  }
);
TableRowView.displayName = 'TableRow';

function getNextSortDirection(current: TableSortDirection, cycle: TableSortDirection[]) {
  const currentIndex = cycle.indexOf(current);
  return cycle[currentIndex === -1 || currentIndex === cycle.length - 1 ? 0 : currentIndex + 1];
}

function getAriaSort(direction: TableSortDirection) {
  if (direction === 'asc') return 'ascending';
  if (direction === 'desc') return 'descending';
  return undefined;
}

function getWidthValue(width?: number | string) {
  if (typeof width === 'number') return `${width}px`;
  return width;
}

function getNumericWidth(width?: number | string) {
  if (typeof width === 'number') return width;
  if (typeof width === 'string' && width.endsWith('px')) return Number.parseFloat(width);
  return undefined;
}

function clampWidth(width: number, minWidth?: number, maxWidth?: number) {
  const min = minWidth ?? 48;
  const max = maxWidth ?? Number.POSITIVE_INFINITY;
  return Math.min(Math.max(width, min), max);
}

function SortIcon({ direction }: { direction: TableSortDirection }) {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <polyline points="6 9 12 3 18 9" className={direction === 'asc' ? 'text-primary-600' : 'text-neutral-300'} />
      <polyline points="6 15 12 21 18 15" className={direction === 'desc' ? 'text-primary-600' : 'text-neutral-300'} />
    </svg>
  );
}

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

export const TableHeadView = React.forwardRef<HTMLTableCellElement, InterTableHeadProps>(
  (
    {
      children,
      className,
      style,
      columnIndex,
      colSpan,
      scope,
      groupHeader = false,
      sortable = false,
      sortDirection = null,
      sortLabel,
      sortCycle = ['asc', 'desc', null],
      onSortChange,
      filterable = false,
      filterValue,
      filterPlaceholder = 'Filtrar...',
      filterInputProps,
      onFilterChange,
      resizable = false,
      width,
      minWidth,
      maxWidth,
      resizeHandleLabel = 'Redimensionar columna',
      onColumnResize,
      onClick,
      ...props
    },
    ref
  ) => {
    const { columnFilters, setColumnFilter } = useTableContext();
    const innerRef = React.useRef<HTMLTableCellElement | null>(null);
    const [internalFilterValue, setInternalFilterValue] = React.useState('');
    const [internalWidth, setInternalWidth] = React.useState<number | undefined>(() => getNumericWidth(width));

    const effectiveWidth = internalWidth ?? getNumericWidth(width);
    const widthStyle = getWidthValue(effectiveWidth ?? width);
    const isGroupedHeader = groupHeader || scope === 'colgroup' || Number(colSpan ?? 1) > 1;
    const canSort = sortable && !isGroupedHeader;
    const effectiveFilterValue = filterValue ?? (
      columnIndex !== undefined ? columnFilters[columnIndex] ?? '' : internalFilterValue
    );

    React.useEffect(() => {
      const nextWidth = getNumericWidth(width);
      if (nextWidth !== undefined) {
        setInternalWidth(nextWidth);
      }
    }, [width]);

    React.useEffect(() => {
      if (filterValue !== undefined && columnIndex !== undefined) {
        setColumnFilter(columnIndex, filterValue);
      }
    }, [columnIndex, filterValue, setColumnFilter]);

    const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onSortChange?.(getNextSortDirection(sortDirection, sortCycle));
    };

    const handleResizeStart = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startWidth = innerRef.current?.offsetWidth || effectiveWidth || minWidth || 120;

      const handleMove = (moveEvent: MouseEvent) => {
        const nextWidth = clampWidth(startWidth + moveEvent.clientX - startX, minWidth, maxWidth);
        setInternalWidth(nextWidth);
        onColumnResize?.(nextWidth);
      };

      const handleEnd = () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
    };

    return (
      <th
        ref={(node) => {
          innerRef.current = node;
          assignRef(ref, node);
        }}
        style={{
          ...style,
          width: widthStyle ?? style?.width,
          minWidth: getWidthValue(minWidth) ?? style?.minWidth,
          maxWidth: getWidthValue(maxWidth) ?? style?.maxWidth,
        }}
        aria-sort={canSort ? getAriaSort(sortDirection) : props['aria-sort']}
        className={cn(
          'relative h-10 px-4 text-left align-middle font-medium text-neutral-500 whitespace-nowrap',
          isGroupedHeader && 'border-b border-neutral-200 bg-neutral-100 text-center text-neutral-700',
          (canSort || filterable) && 'select-none',
          resizable && 'pr-6',
          className
        )}
        colSpan={colSpan}
        scope={scope ?? (isGroupedHeader ? 'colgroup' : undefined)}
        onClick={onClick}
        {...props}
      >
        <div
          className={cn(
            'flex min-w-0 items-center gap-2',
            filterable && 'flex-col items-stretch gap-1 py-2',
            isGroupedHeader && !filterable && 'justify-center'
          )}
        >
          {canSort ? (
            <button
              type="button"
              className="inline-flex min-w-0 items-center gap-1 rounded-sm text-left font-medium text-inherit outline-none hover:text-neutral-800 focus-visible:ring-2 focus-visible:ring-primary-500"
              onClick={handleSortClick}
              aria-label={sortLabel}
            >
              <span className="truncate">{children}</span>
              <SortIcon direction={sortDirection} />
            </button>
          ) : (
            <span className="truncate">{children}</span>
          )}

          {filterable && (
            <input
              {...filterInputProps}
              type={filterInputProps?.type ?? 'text'}
              value={effectiveFilterValue}
              placeholder={filterPlaceholder}
              aria-label={filterInputProps?.['aria-label'] ?? filterPlaceholder}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => {
                const value = event.target.value;
                if (filterValue === undefined) {
                  if (columnIndex !== undefined) {
                    setColumnFilter(columnIndex, value);
                  } else {
                    setInternalFilterValue(value);
                  }
                }
                onFilterChange?.(value);
              }}
              className={cn(
                'h-8 w-full min-w-[8rem] rounded-md border border-neutral-300 bg-white px-2 text-xs font-normal text-neutral-900 placeholder:text-neutral-400',
                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                filterInputProps?.className
              )}
            />
          )}
        </div>

        {resizable && (
          <button
            type="button"
            aria-label={resizeHandleLabel}
            className="absolute right-0 top-0 h-full w-3 cursor-col-resize touch-none border-r border-transparent outline-none hover:border-primary-400 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500"
            onMouseDown={handleResizeStart}
          />
        )}
      </th>
    );
  }
);
TableHeadView.displayName = 'TableHead';

export const TableCellView = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    const { responsiveMode } = useTableContext();
    const colSpan = props.colSpan;

    return (
      <td
        ref={ref}
        className={cn(
          'break-words text-neutral-900',
          responsiveMode === 'cards'
            ? cn(
              'flex min-w-0 flex-col gap-1 text-sm md:table-cell md:px-4 md:py-3 md:align-middle',
              'before:break-words before:text-[10px] before:font-semibold before:uppercase before:tracking-wide before:text-neutral-400',
              'before:content-[attr(data-label)] md:before:content-none',
              colSpan && colSpan > 1 && 'md:text-center'
            )
            : 'px-4 py-3 align-middle',
          className
        )}
        {...props}
      />
    );
  }
);
TableCellView.displayName = 'TableCell';
