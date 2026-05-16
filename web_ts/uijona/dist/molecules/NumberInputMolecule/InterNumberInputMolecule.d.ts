import React from 'react';
export interface InterNumberInputMolecule extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'onBlur'> {
    value?: number | null;
    defaultValue?: number | null;
    min?: number;
    max?: number;
    step?: number;
    hasError?: boolean;
    onValueChange?: (value: number | null, event?: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => void;
    onIncrement?: (value: number) => void;
    onDecrement?: (value: number) => void;
    onBlur?: (value: number | null, event: React.FocusEvent<HTMLInputElement>) => void;
}
export declare const NUMBER_INPUT_MOLECULE_DEFAULTS: Required<Pick<InterNumberInputMolecule, 'step' | 'hasError'>>;
