import React from 'react';
import { cn } from '../lib/cn';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerAtomProps {
  size?: SpinnerSize;
  className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-3.5 h-3.5 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-7 h-7 border-[3px]',
};

export const SpinnerAtom: React.FC<SpinnerAtomProps> = ({ size = 'md', className }) => (
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
