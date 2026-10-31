// JTreeNavView.tsx — JONA View (pure render)
import React from 'react';
import { cn } from '../../lib/cn';
import { JBadge } from '../../atoms/JBadge/JBadge';
import {
  CONTROL_H, FG, FG_MUTED, FOCUS_RING, HOVER_OVERLAY, SELECTION, TEXT_BODY,
} from '../../theme/tokenClasses';
import { JTreeNavNode } from './InterJTreeNav';

export interface JTreeNavViewProps {
  ariaLabel: string;
  nodes: JTreeNavNode[];
  isExpanded: (id: string) => boolean;
  activeId: string | null;
  /** The node that holds the single tab stop. */
  tabStop: string | null;
  badgeId: (id: string) => string;
  setItemRef: (id: string) => (element: HTMLDivElement | null) => void;
  onItemKeyDown: (node: JTreeNavNode, event: React.KeyboardEvent<HTMLDivElement>) => void;
  onItemClick: (node: JTreeNavNode) => void;
  onItemFocus: (id: string) => void;
}

export const isTreeBranch = (node: JTreeNavNode): boolean => (node.children?.length ?? 0) > 0;

const Chevron: React.FC<{ expanded: boolean }> = ({ expanded }) => (
  <svg
    className={cn('h-4 w-4 shrink-0 transition-transform', FG_MUTED, expanded && 'rotate-90')}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const JTreeNavView: React.FC<JTreeNavViewProps> = ({
  ariaLabel, nodes, isExpanded, activeId, tabStop, badgeId, setItemRef, onItemKeyDown, onItemClick, onItemFocus,
}) => {
  const renderNodes = (list: JTreeNavNode[], level: number): React.ReactNode =>
    list.map((node) => {
      const branch = isTreeBranch(node);
      const expanded = branch && isExpanded(node.id);
      const active = node.id === activeId;
      return (
        <li key={node.id} role="none" className="flex min-w-0 flex-col">
          <div
            ref={setItemRef(node.id)}
            role="treeitem"
            aria-level={level}
            aria-expanded={branch ? expanded : undefined}
            aria-current={active ? 'page' : undefined}
            aria-disabled={node.disabled || undefined}
            aria-describedby={node.badge ? badgeId(node.id) : undefined}
            tabIndex={tabStop === node.id ? 0 : -1}
            style={{ '--jona-tree-level': level - 1 } as React.CSSProperties}
            onKeyDown={(event) => onItemKeyDown(node, event)}
            onClick={() => onItemClick(node)}
            onFocus={() => onItemFocus(node.id)}
            className={cn(
              'flex w-full min-w-0 cursor-pointer select-none items-center gap-1.5 rounded-md pe-2',
              'ps-[calc(0.5rem+var(--jona-tree-level)*1.25rem)]',
              'focus-visible:outline-none focus-visible:ring-2',
              CONTROL_H,
              TEXT_BODY,
              FOCUS_RING,
              HOVER_OVERLAY,
              active ? cn(SELECTION, 'font-medium') : '',
              node.disabled ? FG_MUTED : FG,
            )}
          >
            {branch ? <Chevron expanded={expanded} /> : <span className="h-4 w-4 shrink-0" aria-hidden="true" />}
            <span className="min-w-0 flex-1 truncate">{node.label}</span>
            {node.badge && (
              <span id={badgeId(node.id)} aria-hidden="true" className="shrink-0">
                <JBadge variant="secondary">{node.badge}</JBadge>
              </span>
            )}
          </div>
          {expanded && (
            <ul role="group" className="flex min-w-0 flex-col">
              {renderNodes(node.children as JTreeNavNode[], level + 1)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <ul role="tree" aria-label={ariaLabel} className="flex w-full min-w-0 flex-col gap-0.5">
      {renderNodes(nodes, 1)}
    </ul>
  );
};
