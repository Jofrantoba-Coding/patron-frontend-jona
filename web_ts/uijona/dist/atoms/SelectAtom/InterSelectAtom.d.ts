import React from 'react';
export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface SelectGroup {
    label: string;
    options: SelectOption[];
}
export interface InterSelectAtom {
    options?: SelectOption[];
    groups?: SelectGroup[];
    placeholder?: string;
    hasError?: boolean;
    className?: string;
    onChange?: (value: string, event: React.ChangeEvent<HTMLSelectElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLSelectElement>) => void;
    onBlur?: (value: string, event: React.FocusEvent<HTMLSelectElement>) => void;
}
export declare const SELECT_ATOM_DEFAULTS: Required<Pick<InterSelectAtom, 'hasError'>>;
