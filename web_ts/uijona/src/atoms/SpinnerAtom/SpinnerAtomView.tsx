// SpinnerAtomView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterSpinnerAtom, SpinnerSize } from './InterSpinnerAtom';

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-3.5 h-3.5 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-7 h-7 border-[3px]',
};

export const SpinnerAtomView: React.FC<InterSpinnerAtom> = ({ size = 'md', className }) => (
  <span
    role="status"
    aria-label="Loading"
    className={cn(
      'inline-block rounded-full border-current border-t-transparent animate-spin',
      sizeClasses[size],
      className
    )}
  />
);
