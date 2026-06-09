import React from 'react';
export interface JComboBoxOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface JComboBoxGroup {
    label: string;
    options: JComboBoxOption[];
}
export type JComboBoxSize = 'sm' | 'md' | 'lg';
export type JComboBoxVariant = 'default' | 'filled';
export interface InterJComboBox {
    options?: JComboBoxOption[];
    groups?: JComboBoxGroup[];
    placeholder?: string;
    value?: string;
    hasError?: boolean;
    disabled?: boolean;
    size?: JComboBoxSize;
    variant?: JComboBoxVariant;
    id?: string;
    name?: string;
    required?: boolean;
    'aria-describedby'?: string;
    className?: string;
    style?: React.CSSProperties;
    onChange?: (value: string, event: React.ChangeEvent<HTMLSelectElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLSelectElement>) => void;
    onBlur?: (value: string, event: React.FocusEvent<HTMLSelectElement>) => void;
}
export declare const JCOMBOBOX_DEFAULTS: {
    readonly hasError: false;
    readonly disabled: false;
    readonly size: "md";
    readonly variant: "default";
};
export declare const JCOMBOBOX_SIZES: Record<JComboBoxSize, string>;
export declare const JCOMBOBOX_VARIANTS: Record<JComboBoxVariant, string>;
