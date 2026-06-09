export interface InterJCheckBoxField {
    id: string;
    label: string;
    checked?: boolean;
    description?: string;
    errorMessage?: string;
    disabled?: boolean;
    className?: string;
    onCheckedChange?: (checked: boolean) => void;
}
export declare const JCHECKBOX_FIELD_DEFAULTS: Required<Pick<InterJCheckBoxField, 'checked' | 'disabled'>>;
