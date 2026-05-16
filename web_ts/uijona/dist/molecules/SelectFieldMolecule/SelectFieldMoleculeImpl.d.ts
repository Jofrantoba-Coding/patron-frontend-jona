import React from 'react';
import { InterSelectFieldMolecule } from './InterSelectFieldMolecule';
export declare const SelectFieldMoleculeImpl: React.ForwardRefExoticComponent<InterSelectFieldMolecule & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onBlur" | "onChange" | "value"> & {
    value?: string;
} & React.RefAttributes<HTMLSelectElement>>;
