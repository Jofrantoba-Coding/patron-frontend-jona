// TableMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';

// Wrapper: desktop → overflow-auto + border; mobile → sin overflow (filas se convierten en cards)
export const TableMoleculeView = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full md:overflow-auto md:rounded-md md:border md:border-neutral-200">
      <table
        ref={ref}
        className={cn('block w-full caption-bottom text-sm md:table md:min-w-max', className)}
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

// thead: oculto en mobile (las etiquetas se muestran via data-label en cada celda)
export const TableHeaderView = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn('hidden md:table-header-group bg-neutral-50 [&_tr]:border-b', className)}
      {...props}
    />
  )
);

// tbody: block en mobile para que los tr floten como cards; table-row-group en md+
export const TableBodyView = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn(
        'block md:table-row-group',
        'md:[&_tr:last-child]:border-b-0',
        className
      )}
      {...props}
    />
  )
);

export const TableFooterView = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn('block md:table-footer-group bg-neutral-50 font-medium md:[&>tr]:last:border-b-0', className)}
      {...props}
    />
  )
);

// tr:
//   mobile  → card (grid 2 columnas, borde redondeado, sombra sutil, margen inferior)
//   desktop → fila de tabla normal con borde inferior
export const TableRowView = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        // Mobile: card con grid de 2 columnas
        'grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-neutral-200 bg-white p-4 mb-3 shadow-sm',
        // Desktop: fila de tabla estándar
        'md:table-row md:rounded-none md:border-0 md:border-b md:border-neutral-200 md:bg-transparent md:p-0 md:mb-0 md:shadow-none',
        // Shared
        'transition-colors hover:bg-neutral-50 data-[state=selected]:bg-primary-50',
        className
      )}
      {...props}
    />
  )
);

// th: solo visible en md+ (thead está oculto en mobile)
export const TableHeadView = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn('h-10 px-4 text-left align-middle font-medium text-neutral-500', className)}
      {...props}
    />
  )
);

// td:
//   mobile  → flex column; muestra data-label como etiqueta pequeña arriba del valor
//   desktop → celda de tabla normal; el ::before queda vacío via content-none
//
// Uso: <TableCell data-label="Nombre">Jonathan</TableCell>
// Si no se pasa data-label, la celda se muestra sin etiqueta en mobile.
export const TableCellView = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        // Mobile: flex columna con etiqueta superior via ::before
        'flex flex-col gap-0.5 text-sm',
        'before:content-[attr(data-label)] before:text-[10px] before:font-semibold before:uppercase before:tracking-widest before:text-neutral-400',
        // Desktop: celda normal, se elimina el ::before
        'md:table-cell md:before:content-none md:px-4 md:py-3 md:align-middle',
        'text-neutral-900',
        className
      )}
      {...props}
    />
  )
);
