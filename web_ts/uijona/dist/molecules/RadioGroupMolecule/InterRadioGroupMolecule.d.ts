import { default as React } from '../../../node_modules/react';

export interface RadioGroupOption {
    value: string;
    label: React.ReactNode;
    description?: React.ReactNode;
    disabled?: boolean;
}
export interface InterRadioGroupMolecule {
    name: string;
    options: RadioGroupOption[];
    value?: string;
    defaultValue?: string;
    label?: React.ReactNode;
    errorMessage?: React.ReactNode;
    description?: React.ReactNode;
    orientation?: 'vertical' | 'horizontal';
    disabled?: boolean;
    className?: string;
    onValueChange?: (value: string, option: RadioGroupOption) => void;
}
export declare const RADIO_GROUP_MOLECULE_DEFAULTS: Required<Pick<InterRadioGroupMolecule, 'orientation' | 'disabled'>>;
