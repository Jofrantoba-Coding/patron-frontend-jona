// Layer: Interface. Public contract of the lookup dialog (R-LKP-1): shapes and defaults only, no logic.
import type { LookupItem } from '../../../services/InterLookupService';

/** A picker filter (`mock-server/registry/pickers.js`): `text` is contains, `select` an exact id over a catalog. */
export interface LookupFilter {
  field: string;
  label: string;
  type: 'text' | 'select';
  /** The catalog a `select` lists. */
  source?: string;
  /** The desktop input rules of a text filter. */
  upper?: boolean;
  digits?: boolean;
  max?: number;
  /** A select that is blocked until another filter has a value (SubFamilia by Familia). */
  dependsOn?: { field: string; filterKey: string };
}

export interface LookupExtra {
  name: string;
  label: string;
  default: string;
}

/** The dialog config of a named picker. */
export interface LookupDialogConfig {
  title: string;
  columns: { key: string; header: string }[];
  filters: LookupFilter[];
  pickLabel: string;
  refresh?: boolean;
  extras?: LookupExtra[];
}

type Row = Record<string, string>;

/** What the dialog asks the source for: only the non-blank filters, 1-based page. */
export interface LookupQuery {
  filters: Record<string, string>;
  page: number;
  pageSize: number;
}

export interface InterLookupDialog {
  config: LookupDialogConfig;
  /** Key of the source's id, the row identity. */
  idKey: string;
  list: (query: LookupQuery) => Promise<{ items: Row[]; pagination: { total: number } }>;
  /** Options of a `select` filter. */
  loadOptions: (catalog: string, filters: Record<string, string>) => Promise<LookupItem[]>;
  /** Filter values shown and applied to the first load (FormBuscarVehiculo RUC, R-LKP-5). */
  preset?: Record<string, string>;
  /** A message rejects the pick: the dialog stays open and shows it (R-LKP-4). */
  veto?: (row: Row) => string | undefined;
  /** Value-first: the full row and the extra inputs; the dialog then asks to close. */
  onPick: (row: Row, extras: Record<string, string>) => void;
  onClose: () => void;
}

/** Presentation defaults only; filters, rows and selection are state and never defaulted. */
export const LOOKUPDIALOG_DEFAULTS = {
  pageSize: 10,
  cancelLabel: 'Cancelar',
  refreshLabel: 'Refrescar',
  loadingLabel: 'Cargando...',
  emptyLabel: 'No se encontraron registros.',
  errorLabel: 'No se pudieron cargar los registros.',
  retryLabel: 'Reintentar',
  resultsLabel: 'Resultados',
};
