import React from 'react';
export interface JRadioGroupOption {
    value: string;
    label: React.ReactNode;
    description?: React.ReactNode;
    disabled?: boolean;
}
export interface InterJRadioGroup {
    name: string;
    options: JRadioGroupOption[];
    value?: string;
    defaultValue?: string;
    label?: React.ReactNode;
    errorMessage?: React.ReactNode;
    description?: React.ReactNode;
    orientation?: 'vertical' | 'horizontal';
    disabled?: boolean;
    className?: string;
    onValueChange?: (value: string, option: JRadioGroupOption) => void;
}
export declare const JRADIO_GROUP_DEFAULTS: Required<Pick<InterJRadioGroup, 'orientation' | 'disabled'>>;
