import React from 'react';
import { InterJSelectField } from './InterJSelectField';
export declare const JSelectFieldImpl: React.ForwardRefExoticComponent<InterJSelectField & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onBlur" | "onChange" | "value"> & {
    value?: string;
} & React.RefAttributes<HTMLSelectElement>>;
