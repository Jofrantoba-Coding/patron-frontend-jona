import React from 'react';
export type JSwitchSize = 'sm' | 'md' | 'lg';
export interface InterJSwitch {
    checked?: boolean;
    hasError?: boolean;
    disabled?: boolean;
    size?: JSwitchSize;
    id?: string;
    'aria-labelledby'?: string;
    'aria-label'?: string;
    className?: string;
    style?: React.CSSProperties;
    onCheckedChange?: (checked: boolean, event: React.MouseEvent<HTMLButtonElement>) => void;
}
export declare const JSWITCH_DEFAULTS: {
    readonly hasError: false;
    readonly disabled: false;
    readonly size: "md";
};
