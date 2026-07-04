export interface JComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Contrato publico de JCombobox (select con búsqueda). */
export interface InterJCombobox {
  options: JComboboxOption[];
  value?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
}
