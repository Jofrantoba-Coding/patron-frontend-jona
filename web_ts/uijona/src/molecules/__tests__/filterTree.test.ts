import { filterTree } from '../JTreeNav/filterTree';
import type { JTreeNavNode } from '../JTreeNav';

const NODES: JTreeNavNode[] = [
  {
    id: 'maestros',
    label: 'Maestros',
    children: [
      {
        id: 'generales',
        label: 'Generales',
        children: [
          { id: 'cliente', label: 'Cliente' },
          { id: 'clinica', label: 'Clínica', disabled: true, badge: 'Próximamente' },
          { id: 'color', label: 'Color' },
        ],
      },
      { id: 'marca', label: 'Marca' },
    ],
  },
  {
    id: 'ventas',
    label: 'Ventas',
    children: [{ id: 'registro', label: 'Registro de Ventas' }],
  },
];

const labels = (nodes: JTreeNavNode[]): string[] =>
  nodes.flatMap((node) => [node.label, ...labels(node.children ?? [])]);

describe('filterTree (R-CHR-3)', () => {
  it('keeps only the matching leaves and their ancestors, ignoring case and accents', () => {
    const result = filterTree(NODES, 'CLI');

    expect(labels(result.nodes)).toEqual(['Maestros', 'Generales', 'Cliente', 'Clínica']);
    expect(result.expandedIds).toEqual(['maestros', 'generales']);
  });

  it('matches an accented filter against a plain label and keeps the node data', () => {
    const result = filterTree(NODES, 'clí');

    expect(labels(result.nodes)).toEqual(['Maestros', 'Generales', 'Cliente', 'Clínica']);
    const clinica = result.nodes[0].children?.[0].children?.[1];
    expect(clinica).toEqual({ id: 'clinica', label: 'Clínica', disabled: true, badge: 'Próximamente' });
  });

  it('matches inside the label, across several branches', () => {
    const result = filterTree(NODES, 'r');

    expect(labels(result.nodes)).toEqual([
      'Maestros', 'Generales', 'Color', 'Marca', 'Ventas', 'Registro de Ventas',
    ]);
    expect(result.expandedIds).toEqual(['maestros', 'generales', 'ventas']);
  });

  it('never keeps a branch for its own label: only leaves match', () => {
    const result = filterTree(NODES, 'generales');

    expect(result.nodes).toEqual([]);
    expect(result.expandedIds).toEqual([]);
  });

  it('returns no nodes for a text with no match', () => {
    expect(filterTree(NODES, 'zzz')).toEqual({ nodes: [], expandedIds: [] });
  });

  it('returns the tree unchanged for a blank text', () => {
    const result = filterTree(NODES, '   ');

    expect(result.nodes).toBe(NODES);
    expect(result.expandedIds).toEqual([]);
  });

  it('does not mutate the input tree', () => {
    const before = JSON.stringify(NODES);
    filterTree(NODES, 'cli');

    expect(JSON.stringify(NODES)).toBe(before);
  });
});
