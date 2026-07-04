/** Contrato publico de JNumberInput. */
export interface InterJNumberInput {
  value?: number | null;
  min?: number;
  max?: number;
  step?: number;
  hasError?: boolean;
  disabled?: boolean;
}
