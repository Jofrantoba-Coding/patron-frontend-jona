// Layer: Impl. Gating and handlers of the crud toolbar; renders nothing.
import { useCallback, useMemo } from 'react';
import type { CrudAction } from '../../../catalogs/CatalogConfig';
import { canTrigger, resolveToolbar } from '../../../domain/crud/toolbarGate';
import type { Permissions } from '../../../domain/permissions';
import type { InterCrudToolbar } from './InterCrudToolbar';

export interface CrudToolbarProps {
  /** Toolbar order; defaults to every action but `export`. */
  actions?: readonly CrudAction[];
  permissions: Permissions;
  /** Id of the selected row, if any. */
  selectedId?: string;
  onAction?: (action: CrudAction) => void;
}

export function useCrudToolbarImpl({ actions, permissions, selectedId, onAction }: CrudToolbarProps): InterCrudToolbar {
  const items = useMemo(() => resolveToolbar(actions, permissions, selectedId), [actions, permissions, selectedId]);

  // The same handler serves clicks and shortcuts, so a denied action can never get through.
  const gated = useCallback(
    (action: CrudAction) => {
      if (canTrigger(action, permissions, selectedId, actions)) onAction?.(action);
    },
    [actions, permissions, selectedId, onAction],
  );

  return { items, onAction: gated };
}
