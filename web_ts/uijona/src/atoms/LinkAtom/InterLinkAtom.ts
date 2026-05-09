// InterLinkAtom.ts — JONA Interface
import React from 'react';

export type LinkVariant = 'default' | 'muted' | 'button' | 'danger';

export interface InterLinkAtom extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant;
  disabled?: boolean;
}

export const LINK_ATOM_DEFAULTS: Required<Pick<InterLinkAtom, 'variant' | 'disabled'>> = {
  variant: 'default',
  disabled: false,
};
