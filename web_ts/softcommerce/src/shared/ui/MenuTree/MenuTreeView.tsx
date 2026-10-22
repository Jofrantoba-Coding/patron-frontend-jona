// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JButton } from 'jona-ui';
import type { MenuNode } from '../../../domain/menuTree';
import type { InterMenuTree } from './InterMenuTree';

const INDENT_PX = 16;

export function MenuTreeView({ ariaLabel, nodes, expandedIds, onToggle, onLeafSelect }: InterMenuTree) {
  const renderLevel = (level: MenuNode[], depth: number) => (
    <ul role={depth === 0 ? 'tree' : 'group'} aria-label={depth === 0 ? ariaLabel : undefined} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {level.map((node) => {
        const isSubmenu = node.menu_item === 'N';
        const isExpanded = expandedIds.has(node.id_menu);
        return (
          <li key={node.id_menu} role="treeitem" aria-expanded={isSubmenu ? isExpanded : undefined}>
            {/* Floors, not fixed heights: 44px touch target on mobile, compact from `sm`. */}
            <JButton
              variant="ghost"
              fullWidth
              className="justify-start min-h-11 sm:min-h-9"
              style={{ paddingLeft: INDENT_PX * (depth + 1) }}
              onClick={() => (isSubmenu ? onToggle?.(node.id_menu) : onLeafSelect?.(node))}
            >
              {node.descripcion}
            </JButton>
            {isSubmenu && isExpanded ? renderLevel(node.children, depth + 1) : null}
          </li>
        );
      })}
    </ul>
  );

  return <nav>{renderLevel(nodes, 0)}</nav>;
}
