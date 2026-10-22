import type { CrudAction } from '../../catalogs/CatalogConfig';
import type { PermissionFlag, Permissions } from '../permissions';
import { shortcutOf } from './toolbarShortcuts';

/** Toolbar order when a catalog configures none; `export` is opt-in. */
export const DEFAULT_ACTIONS: readonly CrudAction[] = ['add', 'modify', 'eliminate', 'clone', 'details', 'search', 'refresh'];

/** Actions that act on the selected row. */
const ROW_DEPENDENT: ReadonlySet<CrudAction> = new Set(['modify', 'eliminate', 'clone', 'details']);

/** Out of scope for W1: shown disabled, never triggered. */
const UNIMPLEMENTED: ReadonlySet<CrudAction> = new Set(['export']);

/** Each action is granted by the permission flag of the same name. */
const flagOf = (action: CrudAction): PermissionFlag => action;

export interface ToolbarItem {
  action: CrudAction;
  enabled: boolean;
  implemented: boolean;
  /** `aria-keyshortcuts` form, e.g. "Alt+A"; absent when the action has none. */
  shortcut?: string;
}

function isEnabled(action: CrudAction, permissions: Permissions, selectedId: string | undefined): boolean {
  const hasRow = selectedId !== undefined && selectedId !== '';
  return permissions[flagOf(action)] === true && (!ROW_DEPENDENT.has(action) || hasRow) && !UNIMPLEMENTED.has(action);
}

/** One state per configured action, in order. */
export function resolveToolbar(
  actions: readonly CrudAction[] = DEFAULT_ACTIONS,
  permissions: Permissions,
  selectedId?: string,
): ToolbarItem[] {
  return actions.map((action) => ({
    action,
    enabled: isEnabled(action, permissions, selectedId),
    implemented: !UNIMPLEMENTED.has(action),
    shortcut: shortcutOf(action),
  }));
}

/** The single gate for click and shortcut: only a visible, enabled action may fire. */
export function canTrigger(
  action: CrudAction,
  permissions: Permissions,
  selectedId?: string,
  actions: readonly CrudAction[] = DEFAULT_ACTIONS,
): boolean {
  return actions.includes(action) && isEnabled(action, permissions, selectedId);
}
