// JTreeNavImpl.tsx — JONA Implementation
import React, { useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { nextRovingIndex } from '../../lib/roving';
import { InterJTreeNav, JTREENAV_DEFAULTS, JTreeNavHandle, JTreeNavNode } from './InterJTreeNav';
import { filterTree, foldText } from './filterTree';
import { isTreeBranch, JTreeNavView } from './JTreeNavView';

/** Characters typed within this window extend the type-ahead text. */
const TYPE_AHEAD_MS = 500;

interface VisibleNode {
  node: JTreeNavNode;
  parentId: string | null;
}

const flattenVisible = (
  nodes: JTreeNavNode[],
  isExpanded: (id: string) => boolean,
  parentId: string | null = null,
): VisibleNode[] =>
  nodes.flatMap((node) => [
    { node, parentId },
    ...(isTreeBranch(node) && isExpanded(node.id)
      ? flattenVisible(node.children as JTreeNavNode[], isExpanded, node.id)
      : []),
  ]);

const isPrintable = (event: React.KeyboardEvent): boolean =>
  event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey;

export const JTreeNavImpl = React.forwardRef<JTreeNavHandle, InterJTreeNav>(({
  ariaLabel, nodes, expandedIds, activeId = null, variant, checkedIds, filter, showFilter, filterLabel, noResultsLabel,
  maxHeight, onToggle, onSelect, onCheckedChange, onFilterChange,
}, ref) => {
  const resolvedVariant = variant ?? JTREENAV_DEFAULTS.variant;
  const checkbox = resolvedVariant === 'checkbox';
  const [focused, setFocused] = useState<string | null>(null);
  const [innerFilter, setInnerFilter] = useState('');
  /** Expansion while a filter is active: local, so clearing the filter restores the host's. */
  const [filterExpansion, setFilterExpansion] = useState<{ text: string; ids: string[] } | null>(null);
  const baseId = useId();
  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const typeAhead = useRef({ text: '', at: 0 });
  const filterRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focusFilter: () => {
      filterRef.current?.focus();
      filterRef.current?.select();
    },
  }), []);

  const filterText = filter ?? innerFilter;
  const filterKey = foldText(filterText.trim());
  const filtering = filterKey !== '';
  const filtered = useMemo(() => filterTree(nodes, filterText), [nodes, filterText]);
  const shownNodes = filtering ? filtered.nodes : nodes;
  const shownExpanded = !filtering
    ? expandedIds
    : filterExpansion?.text === filterKey ? filterExpansion.ids : filtered.expandedIds;

  const expandedSet = new Set(shownExpanded);
  const checkedSet = new Set(checkedIds ?? []);
  const isExpanded = (id: string) => expandedSet.has(id);
  const visible = flattenVisible(shownNodes, isExpanded);
  const isVisible = (id: string | null) => id !== null && visible.some((entry) => entry.node.id === id);
  const tabStop = isVisible(focused) ? focused : isVisible(activeId) ? activeId : visible[0]?.node.id ?? null;

  const toggle = (id: string, expanded: boolean) => {
    if (!filtering) {
      onToggle(id, expanded);
      return;
    }
    const ids = expanded ? [...shownExpanded, id] : shownExpanded.filter((other) => other !== id);
    setFilterExpansion({ text: filterKey, ids });
  };

  const focusNode = (id: string) => {
    setFocused(id);
    itemRefs.current.get(id)?.focus();
  };

  /** A keyboard move. In the checkbox variant the selection follows it. */
  const moveTo = (id: string) => {
    focusNode(id);
    if (checkbox) onSelect(id);
  };

  const activate = (node: JTreeNavNode) => {
    if (isTreeBranch(node)) toggle(node.id, !isExpanded(node.id));
    else onSelect(node.id);
  };

  const check = (node: JTreeNavNode) => {
    if (!node.disabled) onCheckedChange?.(node.id, !checkedSet.has(node.id));
  };

  const findByTypeAhead = (current: number, key: string): VisibleNode | undefined => {
    const now = Date.now();
    const previous = typeAhead.current;
    const text = now - previous.at < TYPE_AHEAD_MS ? previous.text + key : key;
    typeAhead.current = { text, at: now };
    const repeated = [...text].every((char) => char === text[0]);
    const needle = foldText(repeated ? text[0] : text);
    const start = repeated ? current + 1 : current;
    const ordered = [...visible.slice(start), ...visible.slice(0, start)];
    return ordered.find((entry) => foldText(entry.node.label).startsWith(needle));
  };

  const onItemKeyDown = (node: JTreeNavNode, event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    const index = visible.findIndex((entry) => entry.node.id === node.id);
    const branch = isTreeBranch(node);
    const expanded = branch && isExpanded(node.id);

    if (event.key === ' ' && checkbox) {
      event.preventDefault();
      check(node);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate(node);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (branch && !expanded) toggle(node.id, true);
      else if (expanded) moveTo((node.children as JTreeNavNode[])[0].id);
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const parentId = visible[index]?.parentId ?? null;
      if (expanded) toggle(node.id, false);
      else if (parentId) moveTo(parentId);
      return;
    }
    if (isPrintable(event)) {
      const match = findByTypeAhead(index, event.key);
      if (match) {
        event.preventDefault();
        moveTo(match.node.id);
      }
      return;
    }
    const next = nextRovingIndex(index, visible.length, event.key, { orientation: 'vertical' });
    if (next === null) return;
    event.preventDefault();
    moveTo(visible[next].node.id);
  };

  const noResults = filtering && visible.length === 0 ? noResultsLabel ?? JTREENAV_DEFAULTS.noResultsLabel : null;

  return (
    <JTreeNavView
      ariaLabel={ariaLabel}
      nodes={shownNodes}
      variant={resolvedVariant}
      isExpanded={isExpanded}
      isChecked={(id) => checkedSet.has(id)}
      activeId={activeId}
      tabStop={tabStop}
      showFilter={showFilter ?? JTREENAV_DEFAULTS.showFilter}
      filterText={filterText}
      filterLabel={filterLabel ?? JTREENAV_DEFAULTS.filterLabel}
      noResults={noResults}
      maxHeight={maxHeight}
      badgeId={(id) => `${baseId}-badge-${id}`}
      filterRef={filterRef}
      setItemRef={(id) => (element) => {
        if (element) itemRefs.current.set(id, element);
        else itemRefs.current.delete(id);
      }}
      onFilterChange={(text) => {
        if (filter === undefined) setInnerFilter(text);
        onFilterChange?.(text);
      }}
      onItemKeyDown={onItemKeyDown}
      onItemClick={(node) => {
        setFocused(node.id);
        if (checkbox) onSelect(node.id);
        else activate(node);
      }}
      onToggleClick={(node, event) => {
        event.stopPropagation();
        setFocused(node.id);
        toggle(node.id, !isExpanded(node.id));
      }}
      onCheckClick={(node, event) => {
        event.stopPropagation();
        setFocused(node.id);
        check(node);
      }}
      onItemFocus={setFocused}
    />
  );
});

JTreeNavImpl.displayName = 'JTreeNav';
