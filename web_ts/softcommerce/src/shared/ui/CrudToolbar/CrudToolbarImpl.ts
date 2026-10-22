// Layer: Impl. Gating and handlers of the crud toolbar; renders nothing.
import { useCallback, useEffect, useMemo, type RefObject } from 'react';
import type { CrudAction } from '../../../catalogs/CatalogConfig';
import { canTrigger, DEFAULT_ACTIONS, resolveToolbar } from '../../../domain/crud/toolbarGate';
import { actionOfShortcut } from '../../../domain/crud/toolbarShortcuts';
import type { Permissions } from '../../../domain/permissions';
import type { InterCrudToolbar } from './InterCrudToolbar';

export interface CrudToolbarProps {
  /** Toolbar order; defaults to every action but `export`. */
  actions?: readonly CrudAction[];
  permissions: Permissions;
  /** Id of the selected row, if any. */
  selectedId?: string;
  onAction?: (action: CrudAction) => void;
  /** Element whose key presses trigger the Alt+letter shortcuts; none means no shortcuts. */
  shortcutScope?: RefObject<HTMLElement>;
  /** True while shortcuts must not fire, e.g. a dialog is open. */
  shortcutsBlocked?: () => boolean;
}

export function useCrudToolbarImpl({
  actions,
  permissions,
  selectedId,
  onAction,
  shortcutScope,
  shortcutsBlocked,
}: CrudToolbarProps): InterCrudToolbar {
  const items = useMemo(() => resolveToolbar(actions, permissions, selectedId), [actions, permissions, selectedId]);

  // The same handler serves clicks and shortcuts, so a denied action can never get through.
  const gated = useCallback(
    (action: CrudAction) => {
      if (canTrigger(action, permissions, selectedId, actions)) onAction?.(action);
    },
    [actions, permissions, selectedId, onAction],
  );

  // Listening on the scope, not `window`: a hidden tab holds no focus, so it never receives the keys.
  useEffect(() => {
    const scope = shortcutScope?.current;
    if (!scope) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      const action = actionOfShortcut(event, actions ?? DEFAULT_ACTIONS);
      if (!action || shortcutsBlocked?.()) return;
      event.preventDefault();
      gated(action);
    };
    scope.addEventListener('keydown', onKeyDown);
    return () => scope.removeEventListener('keydown', onKeyDown);
  }, [shortcutScope, shortcutsBlocked, actions, gated]);

  return { items, onAction: gated };
}
