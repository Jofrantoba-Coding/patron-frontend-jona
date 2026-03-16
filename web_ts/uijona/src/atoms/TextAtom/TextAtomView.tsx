// TextAtomView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterTextAtom, TextSize, TextColor } from './InterTextAtom';

const sizeClasses: Record<TextSize, string> = {
  xs:    'text-xs',
  sm:    'text-sm',
  base:  'text-base',
  lg:    'text-lg',
  xl:    'text-xl',
  '2xl': 'text-2xl',
};

const colorClasses: Record<TextColor, string> = {
  default: 'text-neutral-900',
  muted:   'text-neutral-500',
  primary: 'text-primary-600',
  danger:  'text-danger-500',
  success: 'text-success-600',
  warning: 'text-warning-600',
};

export const TextAtomView: React.FC<InterTextAtom> = ({
  as: Tag = 'p', size = 'base', color = 'default', truncate, className, children,
}) => {
  const Comp = Tag as React.ElementType;
  return (
    <Comp className={cn(sizeClasses[size], colorClasses[color], truncate && 'truncate', className)}>
      {children}
    </Comp>
  );
};
