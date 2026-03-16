import React from 'react';
export interface InterFormFieldMolecule {
    id: string;
    label: string;
    errorMessage?: string;
    description?: string;
    orientation?: 'vertical' | 'horizontal';
    required?: boolean;
    className?: string;
    onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (value: string, event: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onEnterPress?: (value: string, event: React.KeyboardEvent<HTMLInputElement>) => void;
    onClear?: () => void;
    onValid?: (value: string) => void;
    onInvalid?: (value: string, message: string) => void;
}
export declare const FORM_FIELD_MOLECULE_DEFAULTS: Required<Pick<InterFormFieldMolecule, 'orientation'>>;
