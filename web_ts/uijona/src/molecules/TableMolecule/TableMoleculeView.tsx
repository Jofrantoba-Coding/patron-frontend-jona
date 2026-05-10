import React from 'react';
import { cn } from '../../lib/cn';
import { InterTableMolecule, TableResponsiveMode } from './InterTableMolecule';
import { useTableContext } from './TableMoleculeContext';

const wrapperClasses: Record<TableResponsiveMode, string> = {
  scroll: 'relative w-full max-w-full overflow-x-auto rounded-md border border-neutral-200',
  cards: 'relative w-full max-w-full',
  none: 'relative w-full max-w-full',
};

export const TableMoleculeView = React.forwardRef<HTMLTableElement, InterTableMolecule>(
  ({ className, wrapperClassName, responsiveMode = 'scroll', style, ...props }, ref) => (
    <div className={cn(wrapperClasses[responsiveMode], wrapperClassName)}>
      <table
        ref={ref}
        style={responsiveMode === 'cards' ? undefined : style}
        className={cn(
          'caption-bottom text-sm text-neutral-900',
          responsiveMode === 'scroll' && 'w-full min-w-max',
          responsiveMode === 'cards' && 'block w-full min-w-0 md:table',
          responsiveMode === 'none' && 'w-full',
          className
        )}
        {...props}
      />
    </div>
  )
);
TableMoleculeView.displayName = 'TableMolecule';

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

export const TableHeadView = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-10 px-4 text-left align-middle font-medium text-neutral-500',
        'whitespace-nowrap',
        className
      )}
      {...props}
    />
  )
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
          'text-neutral-900',
          responsiveMode === 'cards'
            ? cn(
              'flex min-w-0 flex-col gap-1 text-sm md:table-cell md:px-4 md:py-3 md:align-middle',
              'before:break-words before:text-[10px] before:font-semibold before:uppercase before:tracking-wide before:text-neutral-400',
              'before:content-[attr(data-label)] md:before:content-none',
              colSpan && colSpan > 1 && 'md:text-center'
            )
            : 'px-4 py-3 align-middle',
          'break-words',
          className
        )}
        {...props}
      />
    );
  }
);
TableCellView.displayName = 'TableCell';
