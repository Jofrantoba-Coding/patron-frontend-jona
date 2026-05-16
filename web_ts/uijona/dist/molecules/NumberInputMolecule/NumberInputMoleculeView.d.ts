import React from 'react';
import { InterNumberInputMolecule } from './InterNumberInputMolecule';
type NumberInputMoleculeViewProps = Omit<InterNumberInputMolecule, 'value' | 'defaultValue' | 'onValueChange' | 'onIncrement' | 'onDecrement' | 'onBlur'> & {
    displayValue: string;
    canDecrement: boolean;
    canIncrement: boolean;
    forwardedRef?: React.Ref<HTMLInputElement>;
    onInputChange: React.ChangeEventHandler<HTMLInputElement>;
    onInputBlur: React.FocusEventHandler<HTMLInputElement>;
    onDecrementClick: React.MouseEventHandler<HTMLButtonElement>;
    onIncrementClick: React.MouseEventHandler<HTMLButtonElement>;
};
export declare const NumberInputMoleculeView: React.FC<NumberInputMoleculeViewProps>;
export {};
