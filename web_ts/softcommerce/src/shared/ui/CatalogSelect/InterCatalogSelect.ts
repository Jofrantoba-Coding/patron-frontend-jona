// Layer: Interface. Public contract of the catalog select: shapes and defaults only, no logic.
import type { LookupItem } from '../../../services/InterLookupService';

export interface InterCatalogSelect {
  /** Control name. */
  name: string;
  label: string;
  /** Active options of the catalog lookup, already loaded: the id travels, the name is shown. */
  options: readonly LookupItem[];
  /** The chosen id; '' while none is chosen. */
  value: string;
  /** Shown but not editable (the register is read-only). */
  readOnly?: boolean;
  hasError?: boolean;
  /** First entry of the select while nothing is chosen. */
  placeholder?: string;
  /** Value-first: the chosen id, no DOM event. */
  onChange: (value: string) => void;
}

/** Presentation defaults only; the chosen value and the options are state and never defaulted. */
export const CATALOGSELECT_DEFAULTS = {
  readOnly: false,
  hasError: false,
  placeholder: '--- Seleccione ---',
};
