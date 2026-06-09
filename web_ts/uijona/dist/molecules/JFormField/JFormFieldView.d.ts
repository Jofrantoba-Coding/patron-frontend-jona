import React from 'react';
import { InterJFormField } from './InterJFormField';
export type JFormFieldViewProps = Omit<InterJFormField, 'onInvalid'> & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'onKeyDown' | 'onInvalid'> & {
    forwardedRef?: React.Ref<HTMLInputElement>;
    onInvalid?: (value: string, msg: string) => void;
};
export declare const JFormFieldView: React.FC<JFormFieldViewProps>;
