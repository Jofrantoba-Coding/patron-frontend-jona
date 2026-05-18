import React from 'react';

export type JBadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';

export const JBADGE_VARIANTS: readonly JBadgeVariant[] = [
  'default', 'secondary', 'destructive', 'outline', 'ghost',
];

export interface InterJBadge {
  variant?:   JBadgeVariant;
  className?: string;
  style?:     React.CSSProperties;
  children?:  React.ReactNode;
}

export const JBADGE_DEFAULTS = {
  variant: 'default',
} as const satisfies Required<Pick<InterJBadge, 'variant'>>;
