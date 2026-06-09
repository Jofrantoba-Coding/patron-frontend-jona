import React from 'react';
export type JTextAreaResize = 'none' | 'vertical' | 'horizontal' | 'both';
export type JTextAreaSize = 'sm' | 'md' | 'lg';
export type JTextAreaVariant = 'default' | 'filled';
export interface InterJTextArea {
    hasError?: boolean;
    autoResize?: boolean;
    resize?: JTextAreaResize;
    disabled?: boolean;
    size?: JTextAreaSize;
    variant?: JTextAreaVariant;
    id?: string;
    name?: string;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    maxLength?: number;
    value?: string;
    defaultValue?: string;
    className?: string;
    style?: React.CSSProperties;
    onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    onBlur?: (value: string, event: React.FocusEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}
export declare const JTEXTAREA_DEFAULTS: {
    readonly hasError: false;
    readonly autoResize: false;
    readonly resize: "both";
    readonly disabled: false;
    readonly size: "md";
    readonly variant: "default";
};
export declare const JTEXTAREA_RESIZES: Record<JTextAreaResize, string>;
export declare const JTEXTAREA_SIZES: Record<JTextAreaSize, string>;
export declare const JTEXTAREA_VARIANTS: Record<JTextAreaVariant, string>;
