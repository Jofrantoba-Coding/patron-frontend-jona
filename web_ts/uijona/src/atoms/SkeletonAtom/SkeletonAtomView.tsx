// SkeletonAtomView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterSkeletonAtom } from './InterSkeletonAtom';

export const SkeletonAtomView: React.FC<InterSkeletonAtom> = ({ circle = false, className }) => (
  <div
    aria-hidden="true"
    className={cn(
      'animate-pulse bg-neutral-200',
      circle ? 'rounded-full' : 'rounded',
      className
    )}
  />
);
