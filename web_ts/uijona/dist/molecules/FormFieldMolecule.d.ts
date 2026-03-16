import React from 'react';
import { InterEventsFormFieldMolecule } from './events/InterEventsFormFieldMolecule';
interface FormFieldMoleculeProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'onKeyDown' | 'onInvalid'>, InterEventsFormFieldMolecule {
    id: string;
    label: string;
    errorMessage?: string;
    description?: string;
    orientation?: 'vertical' | 'horizontal';
}
export declare const FormFieldMolecule: React.ForwardRefExoticComponent<FormFieldMoleculeProps & React.RefAttributes<HTMLInputElement>>;
export {};
