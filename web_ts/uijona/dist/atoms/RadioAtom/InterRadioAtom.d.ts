import React from 'react';
export interface InterRadioAtom {
    checked?: boolean;
    hasError?: boolean;
    disabled?: boolean;
    className?: string;
    onCheckedChange?: (checked: boolean, value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}
export declare const RADIO_ATOM_DEFAULTS: Required<Pick<InterRadioAtom, 'checked' | 'hasError' | 'disabled'>>;
