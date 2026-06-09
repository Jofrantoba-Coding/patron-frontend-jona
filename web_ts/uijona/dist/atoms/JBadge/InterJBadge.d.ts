import React from 'react';
export type JBadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
export declare const JBADGE_VARIANTS: readonly JBadgeVariant[];
export interface InterJBadge {
    variant?: JBadgeVariant;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare const JBADGE_DEFAULTS: {
    readonly variant: "default";
};
