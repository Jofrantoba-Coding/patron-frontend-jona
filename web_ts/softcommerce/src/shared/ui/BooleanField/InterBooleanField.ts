// Layer: Interface. Public contract of the boolean field: shapes and defaults only, no logic.
export interface InterBooleanField {
  label: string;
  checked: boolean;
  /** Shown but not editable (the register is read-only or the field is `readOnlyOn` this mode). */
  readOnly?: boolean;
  hasError?: boolean;
  /** Value-first: the new boolean, no DOM event. */
  onChange: (checked: boolean) => void;
}

/** Presentation defaults only; the checked state is state and never defaulted. */
export const BOOLEANFIELD_DEFAULTS = {
  readOnly: false,
  hasError: false,
};
