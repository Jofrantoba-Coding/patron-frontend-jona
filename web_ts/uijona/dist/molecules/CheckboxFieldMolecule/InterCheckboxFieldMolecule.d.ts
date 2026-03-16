export interface InterCheckboxFieldMolecule {
    id: string;
    label: string;
    checked?: boolean;
    description?: string;
    errorMessage?: string;
    disabled?: boolean;
    className?: string;
    onCheckedChange?: (checked: boolean) => void;
}
export declare const CHECKBOX_FIELD_MOLECULE_DEFAULTS: Required<Pick<InterCheckboxFieldMolecule, 'checked' | 'disabled'>>;
