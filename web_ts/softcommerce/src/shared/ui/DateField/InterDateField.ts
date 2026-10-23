// Layer: Interface. Public contract of the date field: shapes and defaults only, no logic.
export interface InterDateField {
  /** Control name. */
  name: string;
  label: string;
  /** The masked text shown, `dd/MM/yyyy` (or the part typed so far); the codec turns it into ISO at the boundary. */
  value: string;
  /** Shown but not editable (the register is read-only or the field is `readOnlyOn` this mode). */
  readOnly?: boolean;
  hasError?: boolean;
  /** Value-first: the masked text after a keystroke or a calendar pick; no DOM event. */
  onChange: (value: string) => void;
}

/** Presentation defaults only; the value is state and never defaulted. */
export const DATEFIELD_DEFAULTS = {
  readOnly: false,
  hasError: false,
};

/** The screen format of a date (R-CRUD-11); the wire format is ISO `yyyy-MM-dd`. */
export const DATE_MASK = 'dd/MM/yyyy';
