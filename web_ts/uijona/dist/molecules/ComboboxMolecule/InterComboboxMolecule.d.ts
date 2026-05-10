export interface ComboboxOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface InterComboboxMolecule {
    options: ComboboxOption[];
    value?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    disabled?: boolean;
    className?: string;
    onChange?: (value: string, option: ComboboxOption) => void;
    onSearchChange?: (query: string) => void;
}
export declare const COMBOBOX_MOLECULE_DEFAULTS: Required<Pick<InterComboboxMolecule, 'placeholder' | 'searchPlaceholder' | 'emptyText' | 'disabled'>>;
