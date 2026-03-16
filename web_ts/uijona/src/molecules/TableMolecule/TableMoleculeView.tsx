// TableMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';

export const TableMoleculeView = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto rounded-md border border-neutral-200">
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
);
TableMoleculeView.displayName = 'TableMolecule';

export const TableCaptionView = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => <caption ref={ref} className={cn('mt-4 text-sm text-neutral-500', className)} {...props} />
);
export const TableHeaderView = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn('bg-neutral-50 [&_tr]:border-b', className)} {...props} />
);
export const TableBodyView = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
);
export const TableFooterView = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tfoot ref={ref} className={cn('bg-neutral-50 font-medium [&>tr]:last:border-b-0', className)} {...props} />
);
export const TableRowView = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => <tr ref={ref} className={cn('border-b border-neutral-200 transition-colors hover:bg-neutral-50 data-[state=selected]:bg-primary-50', className)} {...props} />
);
export const TableHeadView = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <th ref={ref} className={cn('h-10 px-4 text-left align-middle font-medium text-neutral-500', className)} {...props} />
);
export const TableCellView = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <td ref={ref} className={cn('px-4 py-3 align-middle text-neutral-900', className)} {...props} />
);
