import React from 'react';
import { InterSelectFieldMolecule } from './InterSelectFieldMolecule';
export declare const SelectFieldMoleculeImpl: React.ForwardRefExoticComponent<InterSelectFieldMolecule & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onBlur" | "value" | "onChange"> & {
    value?: string;
} & React.RefAttributes<HTMLSelectElement>>;
