import React from 'react';
import { InterEventsSelectAtom } from './events/InterEventsSelectAtom';
export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface SelectGroup {
    label: string;
    options: SelectOption[];
}
interface SelectAtomProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'onBlur'>, InterEventsSelectAtom {
    options?: SelectOption[];
    groups?: SelectGroup[];
    placeholder?: string;
    hasError?: boolean;
}
export declare const SelectAtom: React.ForwardRefExoticComponent<SelectAtomProps & React.RefAttributes<HTMLSelectElement>>;
export {};
