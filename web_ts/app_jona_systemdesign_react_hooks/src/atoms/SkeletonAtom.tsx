// SkeletonAtom.tsx — Level 1: Atom
// Animated placeholder shown while content is loading.
// Inspired by shadcn/ui Skeleton.
import React from 'react';
import { cn } from '../lib/cn';

interface SkeletonAtomProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shorthand for rounded-full (circle/pill shapes) */
  circle?: boolean;
}

export const SkeletonAtom: React.FC<SkeletonAtomProps> = ({
  circle = false,
  className,
  ...props
}) => (
  <div
    aria-hidden="true"
    className={cn(
      'animate-pulse bg-neutral-200',
      circle ? 'rounded-full' : 'rounded-token-sm',
      className
    )}
    {...props}
  />
);
