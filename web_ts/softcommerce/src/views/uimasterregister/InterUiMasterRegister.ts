// Layer: Interface. Public contract of the master register: the generic register plus tabs and child grids. Shapes only, no logic.
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../services/InterCatalogService';
import type { InterLookupService } from '../../services/InterLookupService';
import type { InterChildGrid } from '../../shared/ui/ChildGrid';
import type { InterLookupDialog } from '../../shared/ui/LookupDialog/InterLookupDialog';
import type { InterUiCrudRegister } from '../uicrudregister/InterUiCrudRegister';

/** The inline entry of a child (R-MD-3): the same register parts as the dialog, without the way to close it. */
export type MasterInlineEntry = Omit<MasterChildDialog, 'onClose'>;

export interface MasterTab {
  key: string;
  title: string;
  /** Parent fields shown on the tab; empty when the tab holds a child grid. */
  fields: string[];
  grid?: InterChildGrid;
  /** Present while the child enters its rows above the grid and the register is editable. */
  inline?: MasterInlineEntry;
}

/** The child register dialog that `Agregar` opens (R-MD-3): the unchanged crud register over a draft service. */
export interface MasterChildDialog {
  config: CatalogConfig<Record<string, string>>;
  service: InterCatalogService<Record<string, string>>;
  lookups?: () => Promise<unknown>;
  lookup?: InterLookupService;
  onClose: () => void;
}

/** The desktop question Quitar asks before it removes a row (R-MD-4). */
export interface MasterQuitarConfirm {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface InterUiMasterRegister {
  /** The parent register: fields, errors, confirm and close, exactly as the generic one. */
  register: InterUiCrudRegister;
  tabs: MasterTab[];
  activeTab: string;
  /** Value-first: the tab key. */
  onTabChange: (key: string) => void;
  childDialog?: MasterChildDialog;
  /** The picker a `picker` child opened (R-MST-12): the lookup dialog with the host veto. */
  pickerDialog?: InterLookupDialog;
  quitarConfirm?: MasterQuitarConfirm;
}
