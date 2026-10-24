// Layer: Interface. Public contract of the lookup field: shapes and defaults only, no logic.
import type { InterLookupDialog } from '../LookupDialog';

type Row = Record<string, string>;

export interface InterLookupField {
  /** Control name; the id it holds is `value`. */
  name: string;
  label: string;
  /** The picked id ('' when none). */
  value: string;
  /** The text shown beside the code; blank while there is no `value`. */
  description: string;
  /** The target's code width: a shorter typed code is left-padded to it (R-LKP-6); 0 means never. */
  codeWidth?: number;
  /** Shown but not editable (DETAIL, DELETE): no search, no clear. */
  readOnly?: boolean;
  hasError?: boolean;
  /** What the dialog needs; `onPick` and `onClose` are the field's. */
  dialog: Pick<InterLookupDialog, 'config' | 'idKey' | 'list' | 'loadOptions' | 'preset' | 'veto'>;
  /** The description of a row (the target's option label). */
  describe: (row: Row) => string;
  /** Value-first: the id and its description; `('', '')` when the code is cleared or edited. */
  onChange: (value: string, description: string) => void;
}

/** Presentation defaults only; the value and its description are state and never defaulted. */
export const LOOKUPFIELD_DEFAULTS = {
  codeWidth: 0,
  readOnly: false,
  hasError: false,
  searchLabel: 'Buscar',
  clearLabel: 'Limpiar',
};
