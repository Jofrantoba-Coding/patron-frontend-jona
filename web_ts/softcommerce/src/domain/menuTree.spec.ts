import { describe, expect, it } from 'vitest';
import menuSeed from '../../mock-server/data/menu.json';
import { buildMenuTree, type MenuItem, type MenuNode } from './menuTree';

const item = (id_menu: number, id_menu_padre: number | null, menu_item: 'S' | 'N', descripcion: string): MenuItem => ({
  id_menu,
  id_menu_padre,
  menu_item,
  descripcion,
  nombre: `n${id_menu}`,
});

/** Structure only: description and children, to compare trees without the other columns. */
const shape = (nodes: MenuNode[]): unknown[] =>
  nodes.map((n) => (n.children.length ? { [n.descripcion]: shape(n.children) } : n.descripcion));

describe('buildMenuTree', () => {
  it('S-SHELL-1 nests a flat 2-level payload by id_menu_padre, keeping payload order', () => {
    const tree = buildMenuTree([
      item(1, null, 'N', 'Maestros'),
      item(2, 1, 'S', 'Localidad'),
      item(3, 1, 'S', 'Tipo de Cambio'),
      item(4, null, 'N', 'Ventas'),
      item(5, 4, 'S', 'Registro de Ventas'),
    ]);

    expect(shape(tree)).toEqual([{ Maestros: ['Localidad', 'Tipo de Cambio'] }, { Ventas: ['Registro de Ventas'] }]);
    expect(tree[0].id_menu).toBe(1);
    expect(tree[0].children[1].nombre).toBe('n3');
  });

  it('nests deeper than two levels and accepts children listed before their parent', () => {
    const tree = buildMenuTree([item(3, 2, 'S', 'Leaf'), item(2, 1, 'N', 'Mid'), item(1, null, 'N', 'Root')]);

    expect(shape(tree)).toEqual([{ Root: [{ Mid: ['Leaf'] }] }]);
  });

  it('S-SHELL-2 a different payload yields exactly that tree, nothing hardcoded', () => {
    const other = buildMenuTree([item(900, null, 'S', 'Only Item')]);

    expect(shape(other)).toEqual(['Only Item']);
    expect(shape(buildMenuTree([]))).toEqual([]);
  });

  it('builds the seeded menu served by the mock server', () => {
    const tree = buildMenuTree(menuSeed as MenuItem[]);

    expect(shape(tree)).toEqual([
      // Each Wave 2 catalog adds its leaf under Generales (id 2, R-REG-9); the W1 nodes keep their place.
      { Maestros: [{ Generales: ['Localidad', 'Tipo de Cambio', ...menuSeed.filter((m) => m.id_menu > 7 && m.id_menu_padre === 2).map((m) => m.descripcion)] }, 'Formulario de Demostracion'] },
      { Ventas: ['Registro de Ventas'] },
    ]);
  });

  it('surfaces an item whose parent is missing as a root instead of dropping it', () => {
    const tree = buildMenuTree([item(1, null, 'S', 'A'), item(2, 99, 'S', 'Orphan')]);

    expect(shape(tree)).toEqual(['A', 'Orphan']);
  });
});
