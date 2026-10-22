// Layer: Interface. Public contract of the menu tree: shapes and defaults only, no logic.
import type { MenuItem, MenuNode } from '../../../domain/menuTree';

export interface InterMenuTree {
  ariaLabel?: string;
  nodes: MenuNode[];
  /** `id_menu` of every expanded submenu. */
  expandedIds: ReadonlySet<number>;
  /** Callbacks are value-first: the business value, no DOM event. */
  onToggle?: (idMenu: number) => void;
  onLeafSelect?: (item: MenuItem) => void;
}

/** Presentation defaults only; the nodes and the expanded set are state and never defaulted. */
export const MENUTREE_DEFAULTS: Required<Pick<InterMenuTree, 'ariaLabel'>> = {
  ariaLabel: 'Menú',
};
