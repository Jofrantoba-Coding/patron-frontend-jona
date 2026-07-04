export type JSkeletonVariant = 'pulse' | 'wave' | 'none';

/** Contrato publico de JSkeleton. */
export interface InterJSkeleton {
  circle?: boolean;
  variant?: JSkeletonVariant;
}

export const JSKELETON_DEFAULTS = {
  circle: false,
  variant: 'pulse',
} as const satisfies Required<InterJSkeleton>;

export const JSKELETON_VARIANT_CLASSES: Record<JSkeletonVariant, string> = {
  pulse: 'animate-pulse bg-neutral-200',
  wave: 'jskeleton-wave',
  none: 'bg-neutral-200',
};
