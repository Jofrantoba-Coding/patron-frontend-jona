import React from 'react';
type SwitchSize = 'sm' | 'md' | 'lg';
interface SwitchFieldMoleculeProps {
    id: string;
    label: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    description?: string;
    errorMessage?: string;
    disabled?: boolean;
    size?: SwitchSize;
    card?: boolean;
    className?: string;
}
export declare const SwitchFieldMolecule: React.FC<SwitchFieldMoleculeProps>;
export {};
