// Layer: Interface. Public contract of the multi-line text field: shapes and defaults only, no logic.
export interface InterTextAreaField {
  /** Control name. */
  name: string;
  label: string;
  /** The text shown, line breaks included. */
  value: string;
  /** Visible lines (default 4). */
  rows?: number;
  /** An edit that would leave the value longer than this is ignored whole: no truncation, no error (S-CRUD-14). */
  maxLength?: number;
  uppercase?: boolean;
  /** Applied to every edit before the length check. */
  transform?: (next: string) => string;
  /** Shown but not editable (the register is read-only). */
  readOnly?: boolean;
  hasError?: boolean;
  /** Value-first: only accepted values are reported; no DOM event. */
  onChange: (value: string) => void;
  /** Value-first: the value when focus leaves. */
  onBlur?: (value: string) => void;
}

/** Presentation defaults only; the value is state and never defaulted. */
export const TEXTAREAFIELD_DEFAULTS = {
  rows: 4,
  uppercase: false,
  readOnly: false,
  hasError: false,
};
