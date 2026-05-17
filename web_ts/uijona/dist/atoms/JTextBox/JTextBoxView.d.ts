import React from 'react';
import type { InterJTextBox, JTextBoxSize } from './InterJTextBox';
interface JTextBoxViewProps extends Omit<InterJTextBox, 'onChange' | 'onBlur' | 'onKeyDown'> {
    forwardedRef?: React.Ref<HTMLInputElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    size?: JTextBoxSize | number;
    [key: string]: unknown;
}
export declare const JTextBoxView: React.FC<JTextBoxViewProps>;
export {};
