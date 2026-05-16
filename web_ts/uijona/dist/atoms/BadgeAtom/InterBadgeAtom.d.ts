import { default as React } from '../../../node_modules/react';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
export interface InterBadgeAtom extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}
export declare const BADGE_ATOM_DEFAULTS: Required<Pick<InterBadgeAtom, 'variant'>>;
