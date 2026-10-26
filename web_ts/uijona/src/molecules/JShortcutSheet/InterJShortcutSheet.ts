// InterJShortcutSheet.ts — JONA Interface

export interface JShortcutItem {
  /** Each key renders as its own `kbd` element, for example `['Alt', 'W']`. */
  keys: string[];
  label: string;
}

export interface JShortcutGroup {
  title: string;
  items: JShortcutItem[];
}

export interface InterJShortcutSheet {
  open: boolean;
  title?: string;
  groups: JShortcutGroup[];
  /** Esc, the backdrop and the `Cerrar` button call it; focus returns to the invoker. */
  onClose: () => void;
}

export const JSHORTCUTSHEET_DEFAULTS = {
  title: 'Atajos de teclado',
} as const satisfies Required<Pick<InterJShortcutSheet, 'title'>>;

/** The footer button label (D17: Spanish lib labels; the locked API has no prop for it). */
export const JSHORTCUTSHEET_CLOSE_LABEL = 'Cerrar';
