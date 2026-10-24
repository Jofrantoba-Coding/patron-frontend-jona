// Layer: Interface. Public contract of the child grid of a master register: shapes and defaults only, no logic.
import type { GridColumn } from '../CrudGrid/InterCrudGrid';

/** A child row as the grid shows it: the columns, a state (`A` active, `D` deactivated) and a key unique within the grid. */
export type ChildGridRow = Record<string, any> & { _key: string; estado: string };

export interface InterChildGrid {
  /** The tab title; it names the grid and its toolbar. */
  title: string;
  columns: GridColumn<ChildGridRow>[];
  rows: ChildGridRow[];
  selectedId?: string;
  /** DETAIL and DELETE: the toolbar is disabled (R-MD-2). */
  readOnly: boolean;
  /** Callbacks are value-first: the row key, no DOM event. */
  onSelect: (id: string) => void;
  /** Absent when the child enters its row inline above the grid (R-MD-3): the grid then has no Agregar of its own. */
  onAdd?: () => void;
  /** Absent for a child that cannot be removed (removal `none`). Quitar acts on the selected row. */
  onRemove?: () => void;
  /** What the last Quitar said (no selection, already deactivated); shown under the toolbar. */
  notice?: string;
}

export const CHILDGRID_DEFAULTS = {
  stateHeader: 'Estado',
  activeLabel: 'Activo',
  deactivatedLabel: 'Desactivado',
  addLabel: 'Agregar',
  removeLabel: 'Quitar',
};
