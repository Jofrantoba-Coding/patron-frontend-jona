import React from 'react';
import { cn } from '../../lib/cn';
import { JSPINNER_DEFAULTS, InterJSpinner, JSpinnerSize, JSpinnerColor } from './InterJSpinner';

const sizeClasses: Record<JSpinnerSize, string> = {
  sm: 'w-3.5 h-3.5 border-2',
  md: 'w-5   h-5   border-2',
  lg: 'w-7   h-7   border-[3px]',
  xl: 'w-10  h-10  border-4',
};

const colorClasses: Record<JSpinnerColor, string> = {
  current: 'border-current border-t-transparent',
  primary: 'border-primary-600 border-t-transparent',
  white:   'border-white border-t-transparent',
  neutral: 'border-neutral-400 border-t-transparent',
};

type JSpinnerViewProps = InterJSpinner & {
  forwardedRef?: React.Ref<HTMLSpanElement>;
};

export const JSpinnerView: React.FC<JSpinnerViewProps> = ({
  size      = JSPINNER_DEFAULTS.size,
  color     = JSPINNER_DEFAULTS.color,
  label     = JSPINNER_DEFAULTS.label,
  className,
  style,
  forwardedRef,
}) => (
  <span
    ref={forwardedRef}
    role="status"
    aria-label={label}
    data-jspinner-size={size}
    data-jspinner-color={color}
    style={style}
    className={cn(
      'jspinner',
      'inline-block rounded-full animate-spin',
      sizeClasses[size],
      colorClasses[color],
      className
    )}
  />
);

JSpinnerView.displayName = 'JSpinnerView';
