import React from 'react';
import { cn } from '../../lib/cn';
import { InterJBadge, JBadgeVariant } from './InterJBadge';

type JBadgeViewProps = InterJBadge &
  Omit<React.HTMLAttributes<HTMLSpanElement>, 'className' | 'style' | 'children'> & {
    forwardedRef?: React.Ref<HTMLSpanElement>;
  };

const variantClasses: Record<JBadgeVariant, string> = {
  default:     'bg-primary-600 text-white border-transparent',
  secondary:   'bg-neutral-200 text-neutral-700 border-transparent',
  destructive: 'bg-danger-500 text-white border-transparent',
  outline:     'bg-transparent text-neutral-700 border-neutral-300',
  ghost:       'bg-neutral-100 text-neutral-600 border-transparent',
};

export const JBadgeView: React.FC<JBadgeViewProps> = ({
  variant = 'default',
  className,
  style,
  children,
  forwardedRef,
  ...htmlProps
}) => (
  <span
    ref={forwardedRef}
    data-jbadge-variant={variant}
    className={cn(
      'jbadge',
      'inline-flex items-center gap-1 rounded-full border',
      'px-2.5 py-0.5 text-xs font-semibold transition-colors duration-200',
      variantClasses[variant],
      className
    )}
    style={style}
    {...htmlProps}
  >
    {children}
  </span>
);
