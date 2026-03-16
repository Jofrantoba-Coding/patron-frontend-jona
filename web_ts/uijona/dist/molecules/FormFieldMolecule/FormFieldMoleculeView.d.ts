import React from 'react';
import { InterFormFieldMolecule } from './InterFormFieldMolecule';
type FormFieldMoleculeViewProps = Omit<InterFormFieldMolecule, 'onInvalid'> & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'onKeyDown' | 'onInvalid'> & {
    forwardedRef?: React.Ref<HTMLInputElement>;
    onInvalid?: (value: string, msg: string) => void;
    onInvalidInternal?: (value: string, msg: string) => void;
};
export declare const FormFieldMoleculeView: React.FC<FormFieldMoleculeViewProps>;
export {};
