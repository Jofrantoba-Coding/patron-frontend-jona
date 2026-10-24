// Layer: View. Pure composition of the generic crud list over props already resolved by the Impl.
import { UiCrudList } from '../uicrudlist';
import { UiMasterRegister } from '../uimasterregister';
import { LIST_PANELS } from './listPanels';
import { UICATALOG_DEFAULTS, type InterUiCatalog } from './InterUiCatalog';

type UiCatalogViewProps = InterUiCatalog & typeof UICATALOG_DEFAULTS;

export function UiCatalogView({ config, service, lookup, permissions, className }: UiCatalogViewProps) {
  return (
    <div className={className}>
      <UiCrudList config={config} service={service} lookup={lookup} permissions={permissions} register={config.children?.length || config.entry?.generalTab ? UiMasterRegister : undefined}
        listActions={config.rowActions?.filter((action) => action.placement === 'list-toolbar')}
        panels={LIST_PANELS}
      />
    </div>
  );
}
