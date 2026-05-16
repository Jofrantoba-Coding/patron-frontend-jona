import React from 'react';
export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type TextColor = 'default' | 'muted' | 'primary' | 'danger' | 'success' | 'warning';
export type TextAs = 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'strong';
export interface InterTextAtom extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
    as?: TextAs;
    size?: TextSize;
    color?: TextColor;
    truncate?: boolean;
}
export declare const TEXT_ATOM_DEFAULTS: Required<Pick<InterTextAtom, 'as' | 'size' | 'color' | 'truncate'>>;
