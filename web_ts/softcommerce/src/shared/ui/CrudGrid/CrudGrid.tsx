// Layer: View + public entry. Stateless: the list Impl owns selection, sort and page.
import { JPagination, JTable, JTableBody, JTableCell, JTableHead, JTableHeader, JTableRow } from 'jona-ui';
import { CRUDGRID_DEFAULTS, type InterCrudGrid } from './InterCrudGrid';

export function CrudGrid<T>(props: InterCrudGrid<T>) {
  const { ariaLabel, columns, rows, idKey, selectedId, sort, page, pageCount } = { ...CRUDGRID_DEFAULTS, ...props };
  const { onRowSelect, onRowOpen, onSortChange, onPageChange, renderCell, hidePagination } = props;
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <JTable aria-label={ariaLabel}>
        <JTableHeader>
          <JTableRow>
            {columns.map(({ key, header, sortable }) => (
              <JTableHead
                key={key}
                sortable={sortable}
                sortDirection={sort?.key === key ? sort.direction : null}
                onSortChange={() => onSortChange?.(key)}
              >
                {header}
              </JTableHead>
            ))}
          </JTableRow>
        </JTableHeader>
        <JTableBody>
          {rows.map((row) => {
            const id = String(row[idKey]);
            return (
              <JTableRow
                key={id}
                aria-selected={id === selectedId ? true : undefined}
                className="cursor-pointer"
                onClick={() => onRowSelect?.(id)}
                onDoubleClick={() => onRowOpen?.(id)}
              >
                {columns.map(({ key }) => (
                  <JTableCell key={key}>{renderCell?.(row, key) ?? String(row[key] ?? '')}</JTableCell>
                ))}
              </JTableRow>
            );
          })}
        </JTableBody>
      </JTable>
      {!hidePagination && <JPagination currentPage={page} totalPages={pageCount} onPageChange={onPageChange} />}
    </div>
  );
}
