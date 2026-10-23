// Layer: public entry. Wires the Impl hook to the pure View; one unit serves every registry catalog.
import type { ComponentType } from 'react';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { Permissions } from '../../domain/permissions';
import { UICATALOG_DEFAULTS } from './InterUiCatalog';
import { useUiCatalogImpl } from './UiCatalogImpl';
import { UiCatalogView } from './UiCatalogView';

export interface UiCatalogProps {
  config: CatalogConfig<any>;
  permissions: Permissions;
}

/** List and register of any registry catalog, from its derived config. */
export function UiCatalog({ config, permissions }: UiCatalogProps) {
  const impl = useUiCatalogImpl(config, permissions);
  return <UiCatalogView {...UICATALOG_DEFAULTS} {...impl} />;
}

/** The form component a registry `formId` opens: the generic unit bound to one config. */
export function createCatalogForm(config: CatalogConfig<any>): ComponentType<{ permissions: Permissions }> {
  const CatalogForm = ({ permissions }: { permissions: Permissions }) => <UiCatalog config={config} permissions={permissions} />;
  CatalogForm.displayName = `UiCatalog(${config.catalog})`;
  return CatalogForm;
}
