import React from 'react';
interface CheckboxFieldMoleculeProps {
    id: string;
    label: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    description?: string;
    errorMessage?: string;
    disabled?: boolean;
    className?: string;
}
export declare const CheckboxFieldMolecule: React.FC<CheckboxFieldMoleculeProps>;
export {};
