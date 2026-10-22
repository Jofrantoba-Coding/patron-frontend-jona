// Layer: Interface. Public contract of the crud toolbar: shapes and defaults only, no logic.
import type { CrudAction } from '../../../catalogs/CatalogConfig';
import type { ToolbarItem } from '../../../domain/crud/toolbarGate';

export interface InterCrudToolbar {
  ariaLabel?: string;
  labels?: Record<CrudAction, string>;
  /** Tooltip of an action that exists in the toolbar but is not implemented. */
  unavailableLabel?: string;
  /** Resolved state per visible action, in toolbar order. */
  items: ToolbarItem[];
  /** Value-first and already gated: only an enabled action reaches it. */
  onAction?: (action: CrudAction) => void;
}

/** Presentation defaults only; the items are state and never defaulted. */
export const CRUDTOOLBAR_DEFAULTS: Required<Pick<InterCrudToolbar, 'ariaLabel' | 'labels' | 'unavailableLabel'>> = {
  ariaLabel: 'Acciones',
  labels: {
    add: 'Agregar',
    modify: 'Modificar',
    eliminate: 'Eliminar',
    clone: 'Clonar',
    details: 'Detalle',
    search: 'Buscar',
    refresh: 'Actualizar',
    export: 'Exportar',
  },
  unavailableLabel: 'No disponible',
};
