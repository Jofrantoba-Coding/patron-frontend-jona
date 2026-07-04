export interface JMultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Contrato publico de JMultiSelect. */
export interface InterJMultiSelect {
  options: JMultiSelectOption[];
  value?: string[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  maxSelected?: number;
  disabled?: boolean;
}
