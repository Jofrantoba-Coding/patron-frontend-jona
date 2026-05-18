import React from 'react';

export type JSkeletonVariant = 'pulse' | 'wave' | 'none';

export interface InterJSkeleton {
  circle?:    boolean;
  variant?:   JSkeletonVariant;
  className?: string;
  style?:     React.CSSProperties;
}

export const JSKELETON_DEFAULTS = {
  circle:  false,
  variant: 'pulse',
} as const satisfies Partial<InterJSkeleton>;
