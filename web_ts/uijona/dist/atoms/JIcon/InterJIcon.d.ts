import React from 'react';
import type { JButtonVariant } from '../JButton';
export type { JButtonVariant };
export interface InterJIcon {
    icon: React.ReactNode;
    label: string;
    variant?: JButtonVariant;
    loading?: boolean;
    disabled?: boolean;
    id?: string;
    name?: string;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    onFocus?: React.FocusEventHandler<HTMLButtonElement>;
    onBlur?: React.FocusEventHandler<HTMLButtonElement>;
}
export declare const JICON_DEFAULTS: {
    readonly variant: "ghost";
    readonly loading: false;
    readonly disabled: false;
    readonly type: "button";
};
