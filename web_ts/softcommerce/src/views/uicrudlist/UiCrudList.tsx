// Layer: public entry. Wires the Impl hook to the pure View.
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { Permissions } from '../../domain/permissions';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { UICRUDLIST_DEFAULTS } from './InterUiCrudList';
import { useUiCrudListImpl, type CrudListHandlers } from './UiCrudListImpl';
import { UiCrudListView } from './UiCrudListView';

export interface UiCrudListProps<T> extends CrudListHandlers {
  config: CatalogConfig<T>;
  service: InterCatalogService<T>;
  permissions: Permissions;
}

/** Generic list for any catalog config: toolbar, filter, sortable paged grid and load states. */
export function UiCrudList<T>({ config, service, permissions, ...handlers }: UiCrudListProps<T>) {
  const impl = useUiCrudListImpl(config, service, permissions, handlers);
  return <UiCrudListView {...UICRUDLIST_DEFAULTS} {...impl} />;
}
