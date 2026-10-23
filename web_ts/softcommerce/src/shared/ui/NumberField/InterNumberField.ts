// Layer: Interface. Public contract of the integer field: shapes and defaults only, no logic.
export interface InterNumberField {
  /** Control name. */
  name: string;
  label: string;
  /** The text shown. It stays a string so a padded value such as `05` keeps its zeros. */
  value: string;
  /** Most digits accepted (scale 0). An edit that would pass it is ignored whole. */
  max?: number;
  /** Shown but not editable (the register is read-only or the field is `readOnlyOn` this mode). */
  readOnly?: boolean;
  hasError?: boolean;
  /** Value-first: only accepted, digits-only values are reported; no DOM event. */
  onChange: (value: string) => void;
  /** Value-first: the value when focus leaves (the register applies `padLeft` here). */
  onBlur?: (value: string) => void;
}

/** Presentation defaults only; the value is state and never defaulted. */
export const NUMBERFIELD_DEFAULTS = {
  readOnly: false,
  hasError: false,
};
