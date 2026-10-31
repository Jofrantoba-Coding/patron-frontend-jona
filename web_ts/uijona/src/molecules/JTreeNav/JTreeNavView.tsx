// JTreeNavView.tsx — JONA View (pure render)
import React from 'react';
import { cn } from '../../lib/cn';
import { JBadge } from '../../atoms/JBadge/JBadge';
import { JTextBox } from '../../atoms/JTextBox/JTextBox';
import {
  CONTROL_BORDER, CONTROL_H, FG, FG_MUTED, FOCUS_RING, HOVER_OVERLAY, ON_PRIMARY, SELECTION, SURFACE, TEXT_BODY,
  TEXT_SMALL,
} from '../../theme/tokenClasses';
import { JTreeNavNode, JTreeNavVariant } from './InterJTreeNav';

export interface JTreeNavViewProps {
  ariaLabel: string;
  nodes: JTreeNavNode[];
  variant: JTreeNavVariant;
  isExpanded: (id: string) => boolean;
  isChecked: (id: string) => boolean;
  activeId: string | null;
  /** The node that holds the single tab stop. */
  tabStop: string | null;
  showFilter: boolean;
  filterText: string;
  filterLabel: string;
  /** Shown instead of the tree when a filter matches nothing. */
  noResults: string | null;
  maxHeight?: string;
  badgeId: (id: string) => string;
  setItemRef: (id: string) => (element: HTMLDivElement | null) => void;
  onFilterChange: (text: string) => void;
  onItemKeyDown: (node: JTreeNavNode, event: React.KeyboardEvent<HTMLDivElement>) => void;
  onItemClick: (node: JTreeNavNode) => void;
  onToggleClick: (node: JTreeNavNode, event: React.MouseEvent) => void;
  onCheckClick: (node: JTreeNavNode, event: React.MouseEvent) => void;
  onItemFocus: (id: string) => void;
}

export const isTreeBranch = (node: JTreeNavNode): boolean => (node.children?.length ?? 0) > 0;

const Chevron: React.FC<{ expanded: boolean; onClick: (event: React.MouseEvent) => void }> = ({ expanded, onClick }) => (
  <span data-jtreenav-toggle="" aria-hidden="true" onClick={onClick} className="flex h-4 w-4 shrink-0 items-center justify-center">
    <svg
      className={cn('h-4 w-4 transition-transform', FG_MUTED, expanded && 'rotate-90')}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  </span>
);

const CheckBox: React.FC<{ checked: boolean; disabled?: boolean; onClick: (event: React.MouseEvent) => void }> = ({
  checked, disabled, onClick,
}) => (
  <span
    data-jtreenav-check=""
    aria-hidden="true"
    onClick={onClick}
    className={cn(
      'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
      checked ? cn('border-primary-600 bg-primary-600', ON_PRIMARY) : cn(CONTROL_BORDER, SURFACE),
      disabled && 'opacity-50',
    )}
  >
    {checked && (
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    )}
  </span>
);

export const JTreeNavView: React.FC<JTreeNavViewProps> = ({
  ariaLabel, nodes, variant, isExpanded, isChecked, activeId, tabStop, showFilter, filterText, filterLabel, noResults,
  maxHeight, badgeId, setItemRef, onFilterChange, onItemKeyDown, onItemClick, onToggleClick, onCheckClick, onItemFocus,
}) => {
  const checkbox = variant === 'checkbox';
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
            aria-checked={checkbox ? isChecked(node.id) : undefined}
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
            {branch
              ? <Chevron expanded={expanded} onClick={(event) => onToggleClick(node, event)} />
              : <span className="h-4 w-4 shrink-0" aria-hidden="true" />}
            {checkbox && (
              <CheckBox checked={isChecked(node.id)} disabled={node.disabled} onClick={(event) => onCheckClick(node, event)} />
            )}
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
    <div className="flex w-full min-w-0 flex-col gap-2">
      {showFilter && (
        <JTextBox
          type="search"
          aria-label={filterLabel}
          placeholder={filterLabel}
          value={filterText}
          onChange={(text) => onFilterChange(text)}
        />
      )}
      <div
        style={maxHeight ? ({ '--jona-tree-max-h': maxHeight } as React.CSSProperties) : undefined}
        className="min-w-0 max-h-[var(--jona-tree-max-h)] overflow-y-auto"
      >
        {noResults !== null ? (
          <p className={cn('px-2 py-2', TEXT_SMALL, FG_MUTED)}>{noResults}</p>
        ) : (
          <ul role="tree" aria-label={ariaLabel} className="flex w-full min-w-0 flex-col gap-0.5">
            {renderNodes(nodes, 1)}
          </ul>
        )}
      </div>
    </div>
  );
};
