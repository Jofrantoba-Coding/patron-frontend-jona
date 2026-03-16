import React from 'react';
import { SelectOption, SelectGroup } from '../../atoms/SelectAtom';
export interface InterSelectFieldMolecule {
    id: string;
    label: string;
    options?: SelectOption[];
    groups?: SelectGroup[];
    placeholder?: string;
    errorMessage?: string;
    description?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    onChange?: (value: string, event: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur?: (value: string, event: React.FocusEvent<HTMLSelectElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLSelectElement>) => void;
}
