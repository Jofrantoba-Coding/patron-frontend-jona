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
  onAdd: () => void;
}

export const CHILDGRID_DEFAULTS = {
  stateHeader: 'Estado',
  activeLabel: 'Activo',
  deactivatedLabel: 'Desactivado',
  addLabel: 'Agregar',
};
