export interface JMultiSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface InterJMultiSelect {
    options: JMultiSelectOption[];
    value?: string[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    maxSelected?: number;
    disabled?: boolean;
    className?: string;
    onChange?: (values: string[], options: JMultiSelectOption[]) => void;
}
export declare const JMULTI_SELECT_DEFAULTS: Required<Pick<InterJMultiSelect, 'value' | 'placeholder' | 'searchPlaceholder' | 'emptyText' | 'disabled'>>;
