import { type JSwitchSize } from '../../atoms/JSwitch';

/** Contrato publico de JSwitchField. */
export interface InterJSwitchField {
  id: string;
  label: string;
  checked?: boolean;
  description?: string;
  errorMessage?: string;
  disabled?: boolean;
  size?: JSwitchSize;
  card?: boolean;
}
