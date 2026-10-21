// Layer: public entry. Wires the Impl hook to the pure View.
import { CRUDTOOLBAR_DEFAULTS } from './InterCrudToolbar';
import { useCrudToolbarImpl, type CrudToolbarProps } from './CrudToolbarImpl';
import { CrudToolbarView } from './CrudToolbarView';

export function CrudToolbar(props: CrudToolbarProps) {
  const impl = useCrudToolbarImpl(props);
  return <CrudToolbarView {...CRUDTOOLBAR_DEFAULTS} {...impl} />;
}
