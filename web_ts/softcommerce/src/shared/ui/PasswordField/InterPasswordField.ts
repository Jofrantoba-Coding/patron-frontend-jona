// Layer: Interface. Public contract of the password field: shapes and defaults only, no logic.
export interface InterPasswordField {
  /** Control name. */
  name: string;
  label: string;
  value: string;
  /** An edit that would leave the value longer than this is ignored whole: no truncation, no error (S-CRUD-42). */
  maxLength?: number;
  /** Shown but not editable. */
  readOnly?: boolean;
  hasError?: boolean;
  /** Value-first: only accepted values are reported; no DOM event. */
  onChange: (value: string) => void;
  /** The companion input (R-CRUD-17): present only when the field confirms itself in the current mode. */
  confirmLabel?: string;
  confirmValue?: string;
  confirmHasError?: boolean;
  onConfirmChange?: (value: string) => void;
  /** The text of the show / hide control (the desktop `Mostrar caracteres`). */
  showLabel?: string;
  /** Receives the confirmation input, so the register can focus it. */
  confirmRef?: (element: HTMLInputElement | null) => void;
}

/** Presentation defaults only; the values are state and never defaulted. */
export const PASSWORDFIELD_DEFAULTS = {
  readOnly: false,
  hasError: false,
  confirmHasError: false,
  showLabel: 'Mostrar caracteres',
};
