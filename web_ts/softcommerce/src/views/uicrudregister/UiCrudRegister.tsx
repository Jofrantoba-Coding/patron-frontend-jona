// Layer: public entry. Wires the Impl hook to the pure View.
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { UICRUDREGISTER_DEFAULTS, type RegisterMode } from './InterUiCrudRegister';
import { useUiCrudRegisterImpl, type CrudRegisterHandlers } from './UiCrudRegisterImpl';
import { UiCrudRegisterView } from './UiCrudRegisterView';

export interface UiCrudRegisterProps<T> extends CrudRegisterHandlers {
  config: CatalogConfig<T>;
  service: InterCatalogService<T>;
  mode: RegisterMode;
  /** Required for every mode but INSERT. */
  id?: string;
}

/** Generic register dialog for any catalog config. Mount it to open, unmount on `onClose`. */
export function UiCrudRegister<T>({ config, service, mode, id, ...handlers }: UiCrudRegisterProps<T>) {
  const impl = useUiCrudRegisterImpl(config, service, mode, id, handlers);
  return <UiCrudRegisterView {...UICRUDREGISTER_DEFAULTS} {...impl} />;
}
