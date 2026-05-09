// LinkAtomView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterLinkAtom, LinkVariant } from './InterLinkAtom';

const variantClasses: Record<LinkVariant, string> = {
  default: 'text-primary-600 underline-offset-4 hover:underline focus-visible:ring-primary-500',
  muted: 'text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline focus-visible:ring-neutral-400',
  button: 'inline-flex h-9 items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus-visible:ring-primary-500',
  danger: 'text-danger-500 underline-offset-4 hover:underline focus-visible:ring-danger-500',
};

export const LinkAtomView = React.forwardRef<HTMLAnchorElement, InterLinkAtom>(
  ({ variant = 'default', disabled, className, onClick, children, tabIndex, ...props }, ref) => (
    <a
      ref={ref}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : tabIndex}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      className={cn(
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        disabled && 'pointer-events-none opacity-50',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
);

LinkAtomView.displayName = 'LinkAtomView';
