import React from 'react';
export type JLabelVariant = 'body' | 'heading' | 'label' | 'link' | 'link-muted' | 'link-button' | 'link-danger' | 'error' | 'description';
export type JLabelSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type JLabelColor = 'default' | 'muted' | 'primary' | 'danger' | 'success' | 'warning';
export type JLabelAs = 'p' | 'span' | 'div' | 'strong' | 'em' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'a';
export interface InterJLabel extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
    as?: JLabelAs;
    variant?: JLabelVariant;
    size?: JLabelSize;
    color?: JLabelColor;
    truncate?: boolean;
    htmlFor?: string;
    required?: boolean;
    href?: string;
    target?: string;
    rel?: string;
    message?: string;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare const JLABEL_DEFAULTS: {
    readonly variant: "body";
    readonly color: "default";
    readonly truncate: false;
    readonly required: false;
    readonly disabled: false;
};
export declare const JLABEL_VARIANTS: Record<JLabelVariant, string>;
export declare const JLABEL_SIZES: Record<JLabelSize, string>;
export declare const JLABEL_COLORS: Record<JLabelColor, string>;
