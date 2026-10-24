// Layer: View + public entry. Stateless: the master register owns the rows, the selection and the pending changes.
import { JAlert, JButton } from 'jona-ui';
import { CrudGrid } from '../CrudGrid';
import { CHILDGRID_DEFAULTS, type InterChildGrid } from './InterChildGrid';

const STATE = '_estado';

export function ChildGrid(props: InterChildGrid) {
  const { title, columns, rows, selectedId, readOnly, onSelect, onAdd, onRemove, onAction, actions = [], notice, rowErrors = {}, stateHeader, activeLabel, deactivatedLabel, addLabel, removeLabel } = { ...CHILDGRID_DEFAULTS, ...props };
  return (
    <section aria-label={title} className="grid min-w-0 gap-2">
      <div role="toolbar" aria-label={title} className="flex flex-wrap gap-2">
        {onAdd && (
          <JButton variant="outline" className="min-h-11 sm:min-h-9" disabled={readOnly} onClick={onAdd}>
            {addLabel}
          </JButton>
        )}
        {onRemove && (
          <JButton variant="outline" className="min-h-11 sm:min-h-9" disabled={readOnly} onClick={onRemove}>
            {removeLabel}
          </JButton>
        )}
        {actions.map((action) => (
          <JButton key={action.id} variant="outline" className="min-h-11 sm:min-h-9" disabled={readOnly || action.disabled} onClick={() => onAction?.(action.id)}>
            {action.label}
          </JButton>
        ))}
      </div>
      {rows.filter((row) => rowErrors[row._key]).map((row) => (
        <JAlert key={row._key} variant="danger" role="alert">{`${row[columns[0].key]}: ${rowErrors[row._key]}`}</JAlert>
      ))}
      {notice && <JAlert variant="warning" role="status">{notice}</JAlert>}
      <div className="max-w-full overflow-auto">
        <CrudGrid
          ariaLabel={title}
          columns={[{ key: STATE, header: stateHeader }, ...columns]}
          // A logically deleted row never shows; a deactivated one stays as history (R-MD-2).
          rows={rows.filter((row) => row.activo !== false)}
          idKey="_key"
          selectedId={selectedId}
          page={1}
          pageCount={1}
          hidePagination
          onRowSelect={onSelect}
          renderCell={(row, key) =>
            key === STATE ? (
              <span role="img" aria-label={row.estado === 'D' ? deactivatedLabel : activeLabel}>
                {row.estado === 'D' ? '○' : '●'}
              </span>
            ) : undefined
          }
        />
      </div>
    </section>
  );
}
