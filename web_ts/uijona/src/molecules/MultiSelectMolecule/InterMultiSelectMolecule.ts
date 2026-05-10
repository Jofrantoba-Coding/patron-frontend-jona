// InterMultiSelectMolecule.ts — JONA Interface + defaults

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface InterMultiSelectMolecule {
  options: MultiSelectOption[];
  value?: string[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  maxSelected?: number;
  disabled?: boolean;
  className?: string;
  onChange?: (values: string[], options: MultiSelectOption[]) => void;
}

export const MULTI_SELECT_MOLECULE_DEFAULTS: Required<Pick<InterMultiSelectMolecule,
  'value' | 'placeholder' | 'searchPlaceholder' | 'emptyText' | 'disabled'
>> = {
  value: [],
  placeholder: 'Seleccionar...',
  searchPlaceholder: 'Buscar...',
  emptyText: 'Sin resultados',
  disabled: false,
};
