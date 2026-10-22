import type { CrudAction } from '../../catalogs/CatalogConfig';
import type { PermissionFlag } from '../permissions';

/**
 * Alt+letter per action, as the desktop list frames bind them (PanelControlView).
 * `nullify` and `report` have none: on the desktop they collide with clone (N) and refresh (R).
 */
export const TOOLBAR_SHORTCUTS: Readonly<Partial<Record<PermissionFlag, string>>> = {
  add: 'A',
  modify: 'M',
  eliminate: 'E',
  clone: 'N',
  details: 'Z',
  search: 'B',
  refresh: 'R',
  export: 'X',
  print: 'I',
  printFast: 'F',
  close: 'S',
};

/** The `aria-keyshortcuts` form of an action's shortcut, e.g. "Alt+A". */
export function shortcutOf(action: PermissionFlag): string | undefined {
  const letter = TOOLBAR_SHORTCUTS[action];
  return letter ? `Alt+${letter}` : undefined;
}

type ShortcutKey = Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey' | 'code'>;

/** The toolbar action a key press triggers, if any. Physical keys (`code`), so the layout does not matter. */
export function actionOfShortcut(key: ShortcutKey, actions: readonly CrudAction[]): CrudAction | undefined {
  // Ctrl+Alt is also how Windows reports AltGr, so it never counts as a shortcut.
  if (!key.altKey || key.ctrlKey || key.metaKey || key.shiftKey) return undefined;
  return actions.find((action) => key.code === `Key${TOOLBAR_SHORTCUTS[action] ?? ''}`);
}
