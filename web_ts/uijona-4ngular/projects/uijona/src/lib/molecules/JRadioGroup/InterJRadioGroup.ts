export interface JRadioGroupOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

/** Contrato publico de JRadioGroup. */
export interface InterJRadioGroup {
  name: string;
  options: JRadioGroupOption[];
  value?: string;
  label?: string;
  errorMessage?: string;
  description?: string;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
}
