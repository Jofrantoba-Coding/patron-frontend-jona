/** Contrato publico de JCheckBoxField. */
export interface InterJCheckBoxField {
  id: string;
  label: string;
  checked?: boolean;
  description?: string;
  errorMessage?: string;
  disabled?: boolean;
}
