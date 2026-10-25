// InterJTreeNav.ts — JONA Interface

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
  /** Observer events — value-first: the node id. */
  onToggle: (id: string, expanded: boolean) => void;
  onSelect: (id: string) => void;
}

/** The nav tree has no optional prop with a default yet. */
export const JTREENAV_DEFAULTS = {} as const;
