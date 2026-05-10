export interface InterDatePickerMolecule {
    value?: string;
    min?: string;
    max?: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    onChange?: (value: string) => void;
}
export declare const DATE_PICKER_MOLECULE_DEFAULTS: Required<Pick<InterDatePickerMolecule, 'placeholder' | 'disabled'>>;
