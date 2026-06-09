import React from 'react';
import { InterJNumberInput } from './InterJNumberInput';
type JNumberInputViewProps = Omit<InterJNumberInput, 'value' | 'defaultValue' | 'onValueChange' | 'onIncrement' | 'onDecrement' | 'onBlur'> & {
    displayValue: string;
    canDecrement: boolean;
    canIncrement: boolean;
    forwardedRef?: React.Ref<HTMLInputElement>;
    onInputChange: React.ChangeEventHandler<HTMLInputElement>;
    onInputBlur: React.FocusEventHandler<HTMLInputElement>;
    onDecrementClick: React.MouseEventHandler<HTMLButtonElement>;
    onIncrementClick: React.MouseEventHandler<HTMLButtonElement>;
};
export declare const JNumberInputView: React.FC<JNumberInputViewProps>;
export {};
