import React from 'react';
import { cn } from '../../lib/cn';
import { InterJBadge, JBadgeVariant } from './InterJBadge';
import { CONTROL_BORDER, FG, FG_MUTED, LINE_BG, ON_PRIMARY, SURFACE_MUTED } from '../../theme/tokenClasses';

type JBadgeViewProps = InterJBadge &
  Omit<React.HTMLAttributes<HTMLSpanElement>, 'className' | 'style' | 'children'> & {
    forwardedRef?: React.Ref<HTMLSpanElement>;
  };

const variantClasses: Record<JBadgeVariant, string> = {
  default:     `bg-primary-600 ${ON_PRIMARY} border-transparent`,
  secondary:   `${LINE_BG} ${FG} border-transparent`,
  destructive: `bg-danger-500 ${ON_PRIMARY} border-transparent`,
  outline:     `bg-transparent ${FG} ${CONTROL_BORDER}`,
  ghost:       `${SURFACE_MUTED} ${FG_MUTED} border-transparent`,
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
