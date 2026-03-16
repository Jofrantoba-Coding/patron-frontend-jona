import React from 'react';
import { cn } from '../lib/cn';
import { SpinnerAtom } from './SpinnerAtom';
import { InterEventsButtonAtom } from './events/InterEventsButtonAtom';

export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonAtomProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof InterEventsButtonAtom>,
    InterEventsButtonAtom {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:     'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
  outline:     'border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-400',
  ghost:       'bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-400',
  destructive: 'bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-500',
  secondary:   'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 focus-visible:ring-neutral-400',
  link:        'bg-transparent text-primary-600 underline-offset-4 hover:underline p-0 h-auto focus-visible:ring-primary-500',
};

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-9 px-4 py-2 text-sm',
  sm:      'h-7 px-3 text-xs',
  lg:      'h-11 px-6 text-base',
  icon:    'h-9 w-9 p-0',
};

export const ButtonAtom = React.forwardRef<HTMLButtonElement, ButtonAtomProps>(
  ({ variant = 'default', size = 'default', loading = false, fullWidth = false, disabled, className, children, onClick, onFocus, onBlur, onKeyDown, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium',
        'transition-colors duration-200 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && <SpinnerAtom size="sm" />}
      {children}
    </button>
  )
);

ButtonAtom.displayName = 'ButtonAtom';
