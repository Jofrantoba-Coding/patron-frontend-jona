import React from 'react';
interface InputAtomViewProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'onKeyDown'> {
    hasError?: boolean;
    forwardedRef?: React.Ref<HTMLInputElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}
export declare const InputAtomView: React.FC<InputAtomViewProps>;
export {};
