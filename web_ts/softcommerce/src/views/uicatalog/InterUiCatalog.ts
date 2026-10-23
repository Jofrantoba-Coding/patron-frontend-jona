// Layer: Interface. Public contract of the generic registry-driven catalog unit: shapes and defaults only.
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { Permissions } from '../../domain/permissions';
import type { InterCatalogService } from '../../services/InterCatalogService';
import type { InterLookupService } from '../../services/InterLookupService';

export interface InterUiCatalog {
  /** Config derived from a registry entry (`toCatalogConfig`). */
  config: CatalogConfig<any>;
  permissions: Permissions;
  /** Resolved by the Impl from the composed services. */
  service: InterCatalogService<any>;
  lookup: InterLookupService;
  className?: string;
}

/** Presentation defaults only; the config, services and permissions are never defaulted. */
export const UICATALOG_DEFAULTS = {
  // Mobile-first: never wider than the tab it sits in.
  className: 'w-full min-w-0 max-w-full',
};
