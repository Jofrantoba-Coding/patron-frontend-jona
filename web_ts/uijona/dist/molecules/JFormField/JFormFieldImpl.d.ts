import React from 'react';
import { InterJFormField } from './InterJFormField';
export declare const JFormFieldImpl: React.ForwardRefExoticComponent<Omit<InterJFormField, "onInvalid"> & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onBlur" | "onKeyDown" | "onChange" | "onInvalid"> & {
    onInvalid?: (value: string, message: string) => void;
} & React.RefAttributes<HTMLInputElement>>;
