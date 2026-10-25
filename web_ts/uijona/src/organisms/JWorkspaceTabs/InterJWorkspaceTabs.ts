// InterJWorkspaceTabs.ts — JONA Interface
import type React from 'react';

export interface JWorkspaceTab {
  id: string;
  title: string;
  /** Unsaved changes: a dot and the `dirtyLabel` description; the name is unchanged. */
  dirty?: boolean;
}

export interface InterJWorkspaceTabs {
  ariaLabel?: string;
  tabs: JWorkspaceTab[];
  activeId: string | null;
  /** The name of each close button, which sits next to its tab, outside `role="tab"`. */
  closeLabel?: (title: string) => string;
  dirtyLabel?: string;
  /** Tabs beyond this count are listed in the `overflowLabel` menu button. */
  maxVisible?: number;
  overflowLabel?: string;
  /** Called for every tab: inactive panels stay mounted and `hidden`. */
  renderPanel: (id: string) => React.ReactNode;
  /** Observer events — value-first. */
  onSelect: (id: string) => void;
  /** The close button and a middle-click request a close; the host removes the tab. */
  onCloseRequest: (id: string) => void;
}

export interface JWorkspaceTabsHandle {
  /** Moves focus to the panel of `id` (the panel is focusable with `tabIndex=-1`). */
  focusPanel: (id: string) => void;
}

export const JWORKSPACETABS_DEFAULTS = {
  ariaLabel: 'Pestañas de trabajo',
  closeLabel: (title: string) => `Cerrar pestaña ${title}`,
  dirtyLabel: 'Cambios sin guardar',
  overflowLabel: 'Más pestañas',
} as const satisfies Required<Pick<InterJWorkspaceTabs, 'ariaLabel' | 'closeLabel' | 'dirtyLabel' | 'overflowLabel'>>;
