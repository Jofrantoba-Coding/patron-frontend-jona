import React from 'react';
import { InterJSearchInput } from './InterJSearchInput';
type JSearchInputViewProps = Omit<InterJSearchInput, 'onChange' | 'onSearch' | 'onClear' | 'onBlur' | 'onEnterPress'> & {
    inputValue: string;
    forwardedRef?: React.Ref<HTMLInputElement>;
    onInputChange: React.ChangeEventHandler<HTMLInputElement>;
    onInputBlur: React.FocusEventHandler<HTMLInputElement>;
    onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
    onClearClick: React.MouseEventHandler<HTMLButtonElement>;
    onSearchClick: React.MouseEventHandler<HTMLButtonElement>;
};
export declare const JSearchInputView: React.FC<JSearchInputViewProps>;
export {};
