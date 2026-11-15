import { JTABLE_DEFAULTS, type InterJTable } from './InterJTable.js';
import { JTableView } from './JTableView.js';

/** Implementación: aplica los DEFAULTS y dibuja la Vista. Sin estado: la tabla muestra lo que recibe. */
export function JTableImpl<Row>(props: InterJTable<Row>) {
  return <JTableView {...JTABLE_DEFAULTS} {...props} />;
}
