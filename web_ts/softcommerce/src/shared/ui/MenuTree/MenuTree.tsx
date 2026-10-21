// Layer: public entry. Wires the Impl hook to the pure View.
import { MENUTREE_DEFAULTS } from './InterMenuTree';
import { useMenuTreeImpl, type MenuTreeProps } from './MenuTreeImpl';
import { MenuTreeView } from './MenuTreeView';

export function MenuTree(props: MenuTreeProps) {
  const impl = useMenuTreeImpl(props);
  return <MenuTreeView {...MENUTREE_DEFAULTS} {...impl} />;
}
