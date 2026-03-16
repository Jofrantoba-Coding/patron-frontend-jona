// BadgeAtom.tsx — Level 1: Atom
// Inspired by shadcn/ui Badge — variants: default, secondary, destructive, outline, ghost.
import React from 'react';
import { cn } from '../lib/cn';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';

interface BadgeAtomProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:     'bg-primary-600 text-white border-transparent',
  secondary:   'bg-neutral-200 text-neutral-700 border-transparent',
  destructive: 'bg-danger-500 text-white border-transparent',
  outline:     'bg-transparent text-neutral-700 border-neutral-300',
  ghost:       'bg-neutral-100 text-neutral-600 border-transparent',
};

export const BadgeAtom: React.FC<BadgeAtomProps> = ({
  variant = 'default',
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        'transition-colors duration-200',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
