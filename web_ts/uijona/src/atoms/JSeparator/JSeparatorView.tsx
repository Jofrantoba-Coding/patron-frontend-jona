import React from 'react';
import { cn } from '../../lib/cn';
import { JSEPARATOR_DEFAULTS, InterJSeparator } from './InterJSeparator';

type JSeparatorViewProps = InterJSeparator & {
  forwardedRef?: React.Ref<HTMLDivElement>;
};

export const JSeparatorView: React.FC<JSeparatorViewProps> = ({
  orientation = JSEPARATOR_DEFAULTS.orientation,
  className,
  style,
  forwardedRef,
}) => (
  <div
    ref={forwardedRef}
    role="separator"
    aria-orientation={orientation}
    data-jseparator-orientation={orientation}
    style={style}
    className={cn(
      'jseparator',
      'bg-neutral-200 shrink-0',
      orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
      className
    )}
  />
);

JSeparatorView.displayName = 'JSeparatorView';
