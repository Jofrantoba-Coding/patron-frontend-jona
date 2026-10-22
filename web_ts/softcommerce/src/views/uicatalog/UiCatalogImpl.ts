// Layer: Implementation. Picks the catalog service and the lookups of the composed services for one config.
import { useMemo } from 'react';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { Permissions } from '../../domain/permissions';
import { useServices } from '../../services/ServicesContext';
import type { InterUiCatalog } from './InterUiCatalog';

export function useUiCatalogImpl(config: CatalogConfig<any>, permissions: Permissions): InterUiCatalog {
  const { catalog, lookup } = useServices();
  // The list refetches when its service changes, so the catalog service is built once per catalog.
  const service = useMemo(() => catalog<any>(config.catalog), [catalog, config.catalog]);
  return { config, permissions, service, lookup };
}
