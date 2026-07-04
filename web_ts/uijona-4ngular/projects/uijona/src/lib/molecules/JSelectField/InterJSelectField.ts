import { type JComboBoxGroup, type JComboBoxOption } from '../../atoms/JComboBox';

/** Contrato publico de JSelectField. */
export interface InterJSelectField {
  id: string;
  label: string;
  options?: JComboBoxOption[];
  groups?: JComboBoxGroup[];
  placeholder?: string;
  errorMessage?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
}
