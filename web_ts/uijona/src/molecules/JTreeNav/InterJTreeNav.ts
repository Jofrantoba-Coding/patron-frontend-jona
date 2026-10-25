// InterJTreeNav.ts — JONA Interface

export type JTreeNavVariant = 'nav' | 'checkbox';

/** One node, declared as data. A node with children is a branch; one without is a leaf. */
export interface JTreeNavNode {
  id: string;
  label: string;
  children?: JTreeNavNode[];
  /** aria-disabled: the node stays focusable and still reports onSelect, so the host can explain why. */
  disabled?: boolean;
  /** Shown next to the label and exposed as the node's accessible description, never in its name. */
  badge?: string;
}

export interface InterJTreeNav {
  ariaLabel: string;
  nodes: JTreeNavNode[];
  /** Controlled expansion: the tree reports onToggle and shows the ids it receives. */
  expandedIds: string[];
  /** The node marked `aria-current="page"`. */
  activeId?: string | null;
  variant?: JTreeNavVariant;
  /** Checkbox variant: the checked node ids (no propagation). */
  checkedIds?: string[];
  /** Controlled filter text. Without it, the filter box keeps its own text. */
  filter?: string;
  showFilter?: boolean;
  filterLabel?: string;
  noResultsLabel?: string;
  /** Caps the scroll area through a CSS variable (D4), for example `24rem`. */
  maxHeight?: string;
  /** Observer events — value-first: the node id. */
  onToggle: (id: string, expanded: boolean) => void;
  onSelect: (id: string) => void;
  onCheckedChange?: (id: string, checked: boolean) => void;
  onFilterChange?: (text: string) => void;
}

export const JTREENAV_DEFAULTS = {
  variant: 'nav',
  showFilter: false,
  filterLabel: 'Buscar en el menú',
  noResultsLabel: 'Sin resultados',
} as const satisfies Required<Pick<InterJTreeNav, 'variant' | 'showFilter' | 'filterLabel' | 'noResultsLabel'>>;
