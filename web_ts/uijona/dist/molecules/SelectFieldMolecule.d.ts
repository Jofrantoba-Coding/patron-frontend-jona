import React from 'react';
import { SelectOption, SelectGroup } from '../atoms/SelectAtom';
import { InterEventsSelectAtom } from '../atoms/events/InterEventsSelectAtom';
interface SelectFieldMoleculeProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'onBlur'>, InterEventsSelectAtom {
    id: string;
    label: string;
    options?: SelectOption[];
    groups?: SelectGroup[];
    placeholder?: string;
    errorMessage?: string;
    description?: string;
}
export declare const SelectFieldMolecule: React.ForwardRefExoticComponent<SelectFieldMoleculeProps & React.RefAttributes<HTMLSelectElement>>;
export {};
