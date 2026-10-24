// Layer: public entry. Wires the Impl hook to the pure View.
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { Permissions } from '../../domain/permissions';
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
  /** The form's permissions, for a register whose row actions are gated by a flag (R-ACT-2); the generic register ignores them. */
  permissions?: Permissions;
}

/** Generic register dialog for any catalog config. Mount it to open, unmount on `onClose`. */
export function UiCrudRegister<T>({ config, service, mode, id, permissions: _permissions, ...handlers }: UiCrudRegisterProps<T>) {
  const impl = useUiCrudRegisterImpl(config, service, mode, id, handlers);
  return <UiCrudRegisterView {...UICRUDREGISTER_DEFAULTS} {...impl} />;
}
