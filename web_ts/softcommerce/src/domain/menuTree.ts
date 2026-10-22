/** Menu tree of the shell. The server sends a flat `MenuDinamico` list; the client nests it. */

export interface MenuItem {
  id_menu: number;
  id_menu_padre: number | null;
  /** `'S'` is a leaf that opens a form; `'N'` is a submenu. */
  menu_item: 'S' | 'N';
  descripcion: string;
  /** Form registry key of a leaf. */
  nombre: string;
}

export interface MenuNode extends MenuItem {
  children: MenuNode[];
}

/**
 * Nests items by `id_menu_padre`, keeping payload order among siblings. Depth is
 * unbounded and parents may follow their children. An item whose parent is not in
 * the payload becomes a root so no entry silently disappears.
 */
export function buildMenuTree(items: readonly MenuItem[]): MenuNode[] {
  const nodes = new Map<number, MenuNode>(items.map((item) => [item.id_menu, { ...item, children: [] }]));
  const roots: MenuNode[] = [];
  for (const item of items) {
    const node = nodes.get(item.id_menu)!;
    const parent = item.id_menu_padre === null ? undefined : nodes.get(item.id_menu_padre);
    (parent ? parent.children : roots).push(node);
  }
  return roots;
}
