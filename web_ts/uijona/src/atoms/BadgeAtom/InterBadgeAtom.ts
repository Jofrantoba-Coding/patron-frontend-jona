// InterBadgeAtom.ts — JONA Interface
import React from 'react';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';

export interface InterBadgeAtom extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const BADGE_ATOM_DEFAULTS: Required<Pick<InterBadgeAtom, 'variant'>> = {
  variant: 'default',
};
