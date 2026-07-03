// JDotView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJDot, JDotSize, JDotTone } from './InterJDot';

const sizeClasses: Record<JDotSize, string> = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-2.5 w-2.5',
};

const toneClasses: Record<JDotTone, string> = {
  primary: 'bg-primary-500',
  accent:  'bg-accent-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger:  'bg-danger-500',
  neutral: 'bg-neutral-300',
};

export const JDotView: React.FC<InterJDot> = ({
  size = 'md',
  tone = 'primary',
  pulse = false,
  className,
  style,
  'aria-label': ariaLabel,
}) => {
  const a11y = ariaLabel ? { role: 'status', 'aria-label': ariaLabel } : { 'aria-hidden': true };

  if (pulse) {
    return (
      <span className={cn('jdot relative inline-flex', sizeClasses[size], className)} style={style} {...a11y}>
        <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', toneClasses[tone])} aria-hidden="true" />
        <span className={cn('relative inline-flex rounded-full', sizeClasses[size], toneClasses[tone])} aria-hidden="true" />
      </span>
    );
  }

  return (
    <span
      className={cn('jdot inline-block shrink-0 rounded-full', sizeClasses[size], toneClasses[tone], className)}
      style={style}
      {...a11y}
    />
  );
};
