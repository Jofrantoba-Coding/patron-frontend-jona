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

export const JBADGE_VARIANT_CLASSES: Record<JBadgeVariant, string> = {
  default: 'bg-primary-600 text-white border-transparent',
  secondary: 'bg-neutral-200 text-neutral-700 border-transparent',
  destructive: 'bg-danger-500 text-white border-transparent',
  outline: 'bg-transparent text-neutral-700 border-neutral-300',
  ghost: 'bg-neutral-100 text-neutral-600 border-transparent',
};
