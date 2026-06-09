// InterJCombobox.ts — JONA Interface + defaults

export interface JComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface InterJCombobox {
  options: JComboboxOption[];
  value?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (value: string, option: JComboboxOption) => void;
  onSearchChange?: (query: string) => void;
}

export const JCOMBOBOX_MOLECULE_DEFAULTS: Required<Pick<InterJCombobox,
  'placeholder' | 'searchPlaceholder' | 'emptyText' | 'disabled'
>> = {
  placeholder: 'Seleccionar...',
  searchPlaceholder: 'Buscar...',
  emptyText: 'Sin resultados',
  disabled: false,
};
