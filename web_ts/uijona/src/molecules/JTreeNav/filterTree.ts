// filterTree.ts — pure filter of a JTreeNav node tree (R-CHR-3)
import type { JTreeNavNode } from './InterJTreeNav';

export interface FilteredTree {
  nodes: JTreeNavNode[];
  /** The ancestors of every match: a filtered tree shows them expanded. */
  expandedIds: string[];
}

/** Lower-case text without diacritics, so `Clí` and `cli` compare equal. */
export function foldText(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

const isBranch = (node: JTreeNavNode): boolean => (node.children?.length ?? 0) > 0;

/**
 * Keeps the leaves whose label contains `text` (ignoring case and accents)
 * together with their ancestors. A branch never matches by its own label.
 * Checked state is not touched (no propagation). A blank text returns the
 * input tree itself.
 */
export function filterTree(nodes: JTreeNavNode[], text: string): FilteredTree {
  const needle = foldText(text.trim());
  if (needle === '') return { nodes, expandedIds: [] };

  const expandedIds: string[] = [];
  const visit = (list: JTreeNavNode[]): JTreeNavNode[] =>
    list.flatMap((node) => {
      if (!isBranch(node)) return foldText(node.label).includes(needle) ? [node] : [];
      const ancestorIndex = expandedIds.length;
      expandedIds.push(node.id);
      const children = visit(node.children as JTreeNavNode[]);
      if (children.length === 0) {
        expandedIds.splice(ancestorIndex, 1);
        return [];
      }
      return [{ ...node, children }];
    });

  return { nodes: visit(nodes), expandedIds };
}
