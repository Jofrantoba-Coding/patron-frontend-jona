export type JBadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';

export const JBADGE_VARIANTS: readonly JBadgeVariant[] = [
  'default',
  'secondary',
  'destructive',
  'outline',
  'ghost',
];

/** Contrato publico de JBadge. */
export interface InterJBadge {
  variant?: JBadgeVariant;
}

export const JBADGE_DEFAULTS = {
  variant: 'default',
} as const satisfies Required<InterJBadge>;

