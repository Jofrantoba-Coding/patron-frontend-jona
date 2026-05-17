import React from 'react';
export type JButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
export type JButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'default';
export type JButtonIconPosition = 'left' | 'right' | 'top' | 'bottom';
export interface InterJButton {
    children?: React.ReactNode;
    icon?: React.ReactNode;
    iconPosition?: JButtonIconPosition;
    variant?: JButtonVariant;
    size?: JButtonSize;
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    style?: React.CSSProperties;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}
export declare const JBUTTON_DEFAULTS: {
    readonly variant: "default";
    readonly size: "md";
    readonly iconPosition: "left";
    readonly loading: false;
    readonly fullWidth: false;
    readonly type: "button";
};
export declare const JBUTTON_VARIANTS: Record<JButtonVariant, string>;
export declare const JBUTTON_SIZES: Record<JButtonSize, string>;
export declare const JBUTTON_ICON_POSITIONS: Record<JButtonIconPosition, string>;
