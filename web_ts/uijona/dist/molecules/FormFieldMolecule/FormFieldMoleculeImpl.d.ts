import React from 'react';
import { InterFormFieldMolecule } from './InterFormFieldMolecule';
export declare const FormFieldMoleculeImpl: React.ForwardRefExoticComponent<Omit<InterFormFieldMolecule, "onInvalid"> & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onBlur" | "onChange" | "onInvalid" | "onKeyDown"> & {
    onInvalid?: (value: string, message: string) => void;
} & React.RefAttributes<HTMLInputElement>>;
