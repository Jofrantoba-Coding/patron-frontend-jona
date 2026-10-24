// Layer: Interface. Public contract of the master register: the generic register plus tabs and child grids. Shapes only, no logic.
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../services/InterCatalogService';
import type { InterLookupService } from '../../services/InterLookupService';
import type { InterChildGrid } from '../../shared/ui/ChildGrid';
import type { InterUiCrudRegister } from '../uicrudregister/InterUiCrudRegister';

export interface MasterTab {
  key: string;
  title: string;
  /** Parent fields shown on the tab; empty when the tab holds a child grid. */
  fields: string[];
  grid?: InterChildGrid;
}

/** The child register dialog that `Agregar` opens (R-MD-3): the unchanged crud register over a draft service. */
export interface MasterChildDialog {
  config: CatalogConfig<Record<string, string>>;
  service: InterCatalogService<Record<string, string>>;
  lookups?: () => Promise<unknown>;
  lookup?: InterLookupService;
  onClose: () => void;
}

export interface InterUiMasterRegister {
  /** The parent register: fields, errors, confirm and close, exactly as the generic one. */
  register: InterUiCrudRegister;
  tabs: MasterTab[];
  activeTab: string;
  /** Value-first: the tab key. */
  onTabChange: (key: string) => void;
  childDialog?: MasterChildDialog;
}
