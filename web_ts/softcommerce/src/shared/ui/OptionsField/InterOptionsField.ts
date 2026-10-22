// Layer: Interface. Public contract of the options field: shapes and defaults only, no logic.
export interface OptionItem {
  value: string;
  label: string;
}

export interface InterOptionsField {
  /** Groups the radios of this field; also the control name. */
  name: string;
  label: string;
  options: readonly OptionItem[];
  /** `select` for a drop-down, `radio` for a radio group (the desktop's Entrada / Salida). */
  display?: 'select' | 'radio';
  /** The chosen option code; '' while none is chosen. */
  value: string;
  /** Shown but not editable (the register is read-only or the field is `readOnlyOn` this mode). */
  readOnly?: boolean;
  hasError?: boolean;
  /** First entry of the select while nothing is chosen. */
  placeholder?: string;
  /** Value-first: the option code, no DOM event. */
  onChange: (value: string) => void;
}

/** Presentation defaults only; the chosen value is state and never defaulted. */
export const OPTIONSFIELD_DEFAULTS = {
  display: 'select' as const,
  readOnly: false,
  hasError: false,
  placeholder: 'Seleccione',
};
