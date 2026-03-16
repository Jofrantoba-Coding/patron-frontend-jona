import React from 'react';
type TextAs = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4';
type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
type TextColor = 'default' | 'muted' | 'danger' | 'success' | 'primary';
interface TextAtomProps extends React.HTMLAttributes<HTMLElement> {
    as?: TextAs;
    size?: TextSize;
    color?: TextColor;
}
export declare const TextAtom: React.FC<TextAtomProps>;
export {};
