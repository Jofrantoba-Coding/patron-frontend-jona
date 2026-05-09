import React from 'react';
export type LinkVariant = 'default' | 'muted' | 'button' | 'danger';
export interface InterLinkAtom extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    variant?: LinkVariant;
    disabled?: boolean;
}
export declare const LINK_ATOM_DEFAULTS: Required<Pick<InterLinkAtom, 'variant' | 'disabled'>>;
