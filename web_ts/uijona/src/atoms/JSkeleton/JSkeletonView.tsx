import React from 'react';
import { cn } from '../../lib/cn';
import { JSKELETON_DEFAULTS, InterJSkeleton, JSkeletonVariant } from './InterJSkeleton';
import { LINE_BG } from '../../theme/tokenClasses';

const variantClasses: Record<JSkeletonVariant, string> = {
  pulse: `animate-pulse ${LINE_BG}`,
  wave:  'jskeleton-wave',
  none:  `${LINE_BG}`,
};

type JSkeletonViewProps = InterJSkeleton & {
  forwardedRef?: React.Ref<HTMLDivElement>;
};

export const JSkeletonView: React.FC<JSkeletonViewProps> = ({
  circle  = JSKELETON_DEFAULTS.circle,
  variant = JSKELETON_DEFAULTS.variant,
  className,
  style,
  forwardedRef,
}) => (
  <div
    ref={forwardedRef}
    aria-hidden="true"
    data-jskeleton-variant={variant}
    data-jskeleton-circle={circle || undefined}
    style={style}
    className={cn(
      'jskeleton',
      variantClasses[variant],
      circle ? 'rounded-full' : 'rounded',
      className
    )}
  />
);

JSkeletonView.displayName = 'JSkeletonView';
