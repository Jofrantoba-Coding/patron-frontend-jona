// BadgeAtomView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { InterBadgeAtom, BadgeVariant } from './InterBadgeAtom';

const variantClasses: Record<BadgeVariant, string> = {
  default:     'bg-primary-600 text-white border-transparent',
  secondary:   'bg-neutral-200 text-neutral-700 border-transparent',
  destructive: 'bg-danger-500 text-white border-transparent',
  outline:     'bg-transparent text-neutral-700 border-neutral-300',
  ghost:       'bg-neutral-100 text-neutral-600 border-transparent',
};

export const BadgeAtomView: React.FC<InterBadgeAtom> = ({ variant = 'default', className, children, ...props }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors duration-200',
      variantClasses[variant],
      className
    )}
    {...props}
  >
    {children}
  </span>
);
