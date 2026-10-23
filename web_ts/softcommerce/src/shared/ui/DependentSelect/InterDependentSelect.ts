// Layer: Interface. Public contract of the dependent select: shapes and defaults only, no logic.
import type { ChainParent } from '../../dependentChain';
import type { LookupItem } from '../../../services/InterLookupService';

export interface InterDependentSelect {
  /** Control name; its own value is `values[name]`. */
  name: string;
  label: string;
  /** The fields whose values decide the options (R-CRUD-12); each travels under its `filterKey`. */
  parents: ChainParent[];
  /** The form values: the parents' and the select's own. */
  values: Record<string, string>;
  /** Options for the given parent values; asked again whenever a parent changes. */
  load: (filters: Record<string, string>) => Promise<LookupItem[]>;
  /** Shown but not editable (DETAIL, DELETE); the options still load so the saved value reads as its name. */
  readOnly?: boolean;
  hasError?: boolean;
  /** Value-first: the chosen id, no DOM event. */
  onChange: (value: string) => void;
  /** `first` selects the first option after each load (S-CRUD-41); it never touches a read-only select. */
  defaultOption?: 'first';
  /** Value-first: the id the select picked by itself (the first option, or '' when the load returned none); `onChange` when absent. */
  onDefault?: (value: string) => void;
}

/** Presentation defaults only; values and options are state and never defaulted. */
export const DEPENDENTSELECT_DEFAULTS = {
  readOnly: false,
  hasError: false,
  placeholder: '--- Seleccione ---',
  loadErrorMessage: 'No se pudieron cargar las opciones.',
  retryLabel: 'Reintentar',
};
