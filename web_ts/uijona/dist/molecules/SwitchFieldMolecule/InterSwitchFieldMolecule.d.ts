import { SwitchSize } from '../../atoms/SwitchAtom';
export interface InterSwitchFieldMolecule {
    id: string;
    label: string;
    checked?: boolean;
    description?: string;
    errorMessage?: string;
    disabled?: boolean;
    size?: SwitchSize;
    card?: boolean;
    className?: string;
    onCheckedChange?: (checked: boolean) => void;
}
export declare const SWITCH_FIELD_MOLECULE_DEFAULTS: Required<Pick<InterSwitchFieldMolecule, 'checked' | 'disabled' | 'size' | 'card'>>;
