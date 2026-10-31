// Solo contratos (capítulo 3, regla 5): controlado o no controlado es una decisión del contrato.

// Controlado: el dueño del valor es quien usa la unidad.
export interface InterJSearchBox {
  value: string;
  onValueChange?: (value: string) => void;
}

// No controlado: la unidad guarda su estado; el contrato lo declara.
export interface InterJSearchBoxUncontrolled {
  initialValue?: string;
  onValueChange?: (value: string) => void;
}
