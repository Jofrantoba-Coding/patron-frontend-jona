// InterEyebrowAtom.ts — JONA Interface
import React from 'react';

export type EyebrowVariant = 'primary' | 'white' | 'muted';

export interface InterEyebrowAtom extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: EyebrowVariant;
}

export const EYEBROW_ATOM_DEFAULTS: Required<Pick<InterEyebrowAtom, 'variant'>> = {
  variant: 'primary',
};
