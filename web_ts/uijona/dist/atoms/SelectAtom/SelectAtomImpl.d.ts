import React from 'react';
import { InterSelectAtom } from './InterSelectAtom';
export declare const SelectAtomImpl: React.ForwardRefExoticComponent<Omit<InterSelectAtom, "onBlur" | "onChange"> & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onBlur" | "value" | "onChange"> & {
    value?: string;
    onChange?: (value: string, event: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur?: (value: string, event: React.FocusEvent<HTMLSelectElement>) => void;
} & React.RefAttributes<HTMLSelectElement>>;
