import { actionHolds } from '../../../mock-server/core/predicates.js';
import type { ActionConfig, CrudAction, CrudMode } from '../../catalogs/CatalogConfig';
import type { PermissionFlag, Permissions } from '../permissions';
import { shortcutOf } from './toolbarShortcuts';

/** Toolbar order when a catalog configures none; `export` is opt-in. */
export const DEFAULT_ACTIONS: readonly CrudAction[] = ['add', 'modify', 'eliminate', 'clone', 'details', 'search', 'refresh'];

/** Actions that act on the selected row. */
const ROW_DEPENDENT: ReadonlySet<CrudAction> = new Set(['modify', 'eliminate', 'clone', 'details']);

/** Out of scope for W1: shown disabled, never triggered. */
const UNIMPLEMENTED: ReadonlySet<CrudAction> = new Set(['export']);

/** The register mode each row action opens; search, refresh and export have none. */
const MODE_OF: Partial<Record<CrudAction, CrudMode>> = { add: 'INSERT', modify: 'UPDATE', eliminate: 'DELETE', clone: 'CLONE', details: 'DETAIL' };

/**
 * Drops the actions of unsupported modes (R-CRUD-16). It runs BEFORE permission gating, so an
 * unsupported action is neither rendered nor triggerable. Without `modes` the list is untouched.
 */
export function actionsForModes(actions: readonly CrudAction[] | undefined, modes: readonly CrudMode[] | undefined) {
  if (!modes) return actions;
  return (actions ?? DEFAULT_ACTIONS).filter((action) => {
    const mode = MODE_OF[action];
    return mode === undefined || modes.includes(mode);
  });
}

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

export interface RowActionContext {
  /** The form's permissions; absent fails closed. */
  permissions?: Permissions;
  mode: CrudMode;
  /** The selected row of the grid and whether it is still pending (not saved yet). */
  selected?: Record<string, unknown>;
  selectedPending?: boolean;
  /** The rows of the grid, without the logically deleted ones. */
  rows: Record<string, unknown>[];
  /** The parent is saved (UPDATE, DETAIL, DELETE): an immediate action calls the server on it. */
  hasParent: boolean;
}

/**
 * Whether a row action can fire (R-ACT-2): its flag is granted, the register is editable, its `enabledWhen` holds and, for an `immediate` one, the parent
 * (and the row an `enabledWhen.selection` names) is saved. The one gate for click and keyboard: a disabled action sends nothing and opens nothing.
 */
export function resolveRowAction(action: ActionConfig, { permissions, mode, selected, selectedPending, rows, hasParent }: RowActionContext): boolean {
  if (permissions?.[action.flag] !== true || mode === 'DETAIL' || mode === 'DELETE') return false;
  if (action.kind === 'immediate' && (!hasParent || (action.enabledWhen?.selection === true && selectedPending === true))) return false;
  return actionHolds(action.enabledWhen, { mode, selected, rows });
}
