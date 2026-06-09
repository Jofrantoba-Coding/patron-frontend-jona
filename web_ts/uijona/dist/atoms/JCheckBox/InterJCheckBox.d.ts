import React from 'react';
export type JCheckBoxSize = 'sm' | 'md' | 'lg';
export type JCheckBoxLabelPosition = 'right' | 'left' | 'top' | 'bottom';
export interface InterJCheckBox {
    checked?: boolean;
    defaultChecked?: boolean;
    indeterminate?: boolean;
    hasError?: boolean;
    disabled?: boolean;
    size?: JCheckBoxSize;
    label?: string;
    labelPosition?: JCheckBoxLabelPosition;
    labelClassName?: string;
    id?: string;
    name?: string;
    value?: string;
    className?: string;
    style?: React.CSSProperties;
    onCheckedChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}
export declare const JCHECKBOX_DEFAULTS: {
    readonly hasError: false;
    readonly disabled: false;
    readonly indeterminate: false;
    readonly size: "md";
    readonly labelPosition: "right";
};
