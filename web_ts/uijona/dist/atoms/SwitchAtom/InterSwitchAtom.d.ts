export type SwitchSize = 'sm' | 'md' | 'lg';
export interface InterSwitchAtom {
    checked?: boolean;
    hasError?: boolean;
    disabled?: boolean;
    size?: SwitchSize;
    className?: string;
    onCheckedChange?: (checked: boolean) => void;
}
export declare const SWITCH_ATOM_DEFAULTS: Required<Pick<InterSwitchAtom, 'checked' | 'hasError' | 'disabled' | 'size'>>;
