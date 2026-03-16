import React from 'react';
import { cn } from '../lib/cn';

interface SkeletonAtomProps extends React.HTMLAttributes<HTMLDivElement> {
  circle?: boolean;
}

export const SkeletonAtom: React.FC<SkeletonAtomProps> = ({ circle = false, className, ...props }) => (
  <div aria-hidden="true" className={cn('animate-pulse bg-neutral-200', circle ? 'rounded-full' : 'rounded', className)} {...props} />
);
