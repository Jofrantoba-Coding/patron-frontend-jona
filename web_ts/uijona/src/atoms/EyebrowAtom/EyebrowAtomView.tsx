// EyebrowAtomView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { InterEyebrowAtom, EyebrowVariant } from './InterEyebrowAtom';

const variantClasses: Record<EyebrowVariant, string> = {
  primary: 'text-primary-600',
  white:   'text-white/70',
  muted:   'text-neutral-500',
};

export const EyebrowAtomView: React.FC<InterEyebrowAtom> = ({
  variant = 'primary',
  className,
  children,
  ...props
}) => (
  <span
    className={cn(
      'block text-xs font-semibold uppercase tracking-widest',
      variantClasses[variant],
      className
    )}
    {...props}
  >
    {children}
  </span>
);
