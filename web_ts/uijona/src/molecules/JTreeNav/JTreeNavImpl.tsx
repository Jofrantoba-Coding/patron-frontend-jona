// JTreeNavImpl.tsx — JONA Implementation
import React, { useId, useRef, useState } from 'react';
import { nextRovingIndex } from '../../lib/roving';
import { InterJTreeNav, JTreeNavNode } from './InterJTreeNav';
import { foldText } from './filterTree';
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

export const JTreeNavImpl: React.FC<InterJTreeNav> = ({
  ariaLabel, nodes, expandedIds, activeId = null, onToggle, onSelect,
}) => {
  const [focused, setFocused] = useState<string | null>(null);
  const baseId = useId();
  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const typeAhead = useRef({ text: '', at: 0 });

  const expandedSet = new Set(expandedIds);
  const isExpanded = (id: string) => expandedSet.has(id);
  const visible = flattenVisible(nodes, isExpanded);
  const isVisible = (id: string | null) => id !== null && visible.some((entry) => entry.node.id === id);
  const tabStop = isVisible(focused) ? focused : isVisible(activeId) ? activeId : visible[0]?.node.id ?? null;

  const focusNode = (id: string) => {
    setFocused(id);
    itemRefs.current.get(id)?.focus();
  };

  const activate = (node: JTreeNavNode) => {
    if (isTreeBranch(node)) onToggle(node.id, !isExpanded(node.id));
    else onSelect(node.id);
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

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate(node);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (branch && !expanded) onToggle(node.id, true);
      else if (expanded) focusNode((node.children as JTreeNavNode[])[0].id);
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const parentId = visible[index]?.parentId ?? null;
      if (expanded) onToggle(node.id, false);
      else if (parentId) focusNode(parentId);
      return;
    }
    if (isPrintable(event)) {
      const match = findByTypeAhead(index, event.key);
      if (match) {
        event.preventDefault();
        focusNode(match.node.id);
      }
      return;
    }
    const next = nextRovingIndex(index, visible.length, event.key, { orientation: 'vertical' });
    if (next === null) return;
    event.preventDefault();
    focusNode(visible[next].node.id);
  };

  return (
    <JTreeNavView
      ariaLabel={ariaLabel}
      nodes={nodes}
      isExpanded={isExpanded}
      activeId={activeId}
      tabStop={tabStop}
      badgeId={(id) => `${baseId}-badge-${id}`}
      setItemRef={(id) => (element) => {
        if (element) itemRefs.current.set(id, element);
        else itemRefs.current.delete(id);
      }}
      onItemKeyDown={onItemKeyDown}
      onItemClick={(node) => {
        setFocused(node.id);
        activate(node);
      }}
      onItemFocus={setFocused}
    />
  );
};

JTreeNavImpl.displayName = 'JTreeNav';
