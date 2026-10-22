// Layer: Impl. State and handlers of the menu tree; renders nothing.
import { useCallback, useMemo, useState } from 'react';
import { buildMenuTree, type MenuItem } from '../../../domain/menuTree';
import type { InterMenuTree } from './InterMenuTree';

export interface MenuTreeProps {
  /** Flat `/menu` payload; the Impl nests it. */
  items: readonly MenuItem[];
  onLeafSelect?: (item: MenuItem) => void;
}

export function useMenuTreeImpl({ items, onLeafSelect }: MenuTreeProps): InterMenuTree {
  const nodes = useMemo(() => buildMenuTree(items), [items]);
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<number>>(() => new Set());

  const onToggle = useCallback((idMenu: number) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (!next.delete(idMenu)) next.add(idMenu);
      return next;
    });
  }, []);

  return { nodes, expandedIds, onToggle, onLeafSelect };
}
