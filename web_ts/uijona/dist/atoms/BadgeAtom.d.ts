import React from 'react';
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
interface BadgeAtomProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}
export declare const BadgeAtom: React.FC<BadgeAtomProps>;
export {};
