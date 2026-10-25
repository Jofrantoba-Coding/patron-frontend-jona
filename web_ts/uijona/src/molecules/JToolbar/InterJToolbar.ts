// InterJToolbar.ts — JONA Interface
import React from 'react';

export type JToolbarTone = 'primary' | 'default' | 'danger';

/** One action, declared as data. Groups are declared per item (no JToolbarGroup). */
export interface JToolbarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  tone?: JToolbarTone;
  /** Natively disabled: activating it does nothing. */
  disabled?: boolean;
  /** Accessible description and tooltip of a disabled item. */
  disabledReason?: string;
  /** Exposed as `aria-keyshortcuts` and in the tooltip; the host listens to the key. */
  shortcut?: string;
  /** Consecutive items with a different group are split by a separator. */
  group?: string;
  /** Listed in the overflow menu instead of the toolbar row. */
  overflow?: boolean;
}

export interface InterJToolbar {
  ariaLabel: string;
  items: JToolbarItem[];
  overflowLabel?: string;
  /** Observer event — value-first: the id of the activated item. */
  onAction: (id: string) => void;
}

export const JTOOLBAR_DEFAULTS = {
  overflowLabel: 'Más acciones',
} as const satisfies Required<Pick<InterJToolbar, 'overflowLabel'>>;
