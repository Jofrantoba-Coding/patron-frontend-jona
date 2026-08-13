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

