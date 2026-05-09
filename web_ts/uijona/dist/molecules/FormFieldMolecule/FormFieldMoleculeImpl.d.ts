import { default as React } from '../../../node_modules/react';
import { InterFormFieldMolecule } from './InterFormFieldMolecule';

export declare const FormFieldMoleculeImpl: React.ForwardRefExoticComponent<Omit<InterFormFieldMolecule, "onInvalid"> & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onBlur" | "onKeyDown" | "onChange" | "onInvalid"> & {
    onInvalid?: (value: string, message: string) => void;
} & React.RefAttributes<HTMLInputElement>>;
