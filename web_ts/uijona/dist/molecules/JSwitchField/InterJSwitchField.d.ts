import { JSwitchSize } from '../../atoms/JSwitch';
export interface InterJSwitchField {
    id: string;
    label: string;
    checked?: boolean;
    description?: string;
    errorMessage?: string;
    disabled?: boolean;
    size?: JSwitchSize;
    card?: boolean;
    className?: string;
    onCheckedChange?: (checked: boolean) => void;
}
export declare const JSWITCHFIELD_DEFAULTS: Required<Pick<InterJSwitchField, 'size' | 'card'>>;
