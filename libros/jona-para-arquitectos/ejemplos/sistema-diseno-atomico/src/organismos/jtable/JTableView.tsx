import { JButton } from '../../atomos/jbutton/index.js';
import { JText } from '../../atomos/jtext/index.js';
import { FG, INLINE, TABLE, clases } from '../../tema/clasesToken.js';
import { JTABLE_DEFAULTS, type InterJTable } from './InterJTable.js';

/** Vista: una tabla accesible compuesta con los átomos JButton y JText; render puro. */
export function JTableView<Row>({
  caption, columns, rows, rowKey, actions = [], busy,
  emptyMessage = JTABLE_DEFAULTS.emptyMessage,
  busyMessage = JTABLE_DEFAULTS.busyMessage,
}: InterJTable<Row>) {
  const vacia = !busy && rows.length === 0;
  const conAcciones = actions.length > 0;
  return (
    <table className={clases(TABLE, FG)} aria-busy={busy || undefined}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((columna) => (
            <th key={columna.id} scope="col" align={columna.align === 'end' ? 'right' : 'left'}>{columna.header}</th>
          ))}
          {conAcciones && <th scope="col">Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {(busy || vacia) && (
          <tr>
            <td colSpan={columns.length + (conAcciones ? 1 : 0)}>
              <JText tone="muted" as="span" role="status">{busy ? busyMessage : emptyMessage}</JText>
            </td>
          </tr>
        )}
        {!busy && rows.map((fila) => (
          <tr key={rowKey(fila)}>
            {columns.map((columna) => (
              <td key={columna.id} align={columna.align === 'end' ? 'right' : 'left'}>{columna.cell(fila)}</td>
            ))}
            {conAcciones && (
              <td>
                <div className={INLINE}>
                  {actions.map((accion) => (
                    <JButton
                      key={accion.id}
                      variant="secondary"
                      aria-label={accion.accessibleLabel(fila)}
                      onClick={() => accion.onAction(fila)}
                    >
                      {accion.label}
                    </JButton>
                  ))}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
