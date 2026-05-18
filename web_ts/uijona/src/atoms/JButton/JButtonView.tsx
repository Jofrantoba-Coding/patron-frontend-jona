import React from 'react';
import { cn } from '../../lib/cn';
import { JSpinner } from '../JSpinner';
import type { InterJButton, JButtonVariant, JButtonSize } from './InterJButton';

const variantClasses: Record<JButtonVariant, string> = {
  default:     'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
  outline:     'border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-400',
  ghost:       'bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-400',
  destructive: 'bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-500',
  secondary:   'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 focus-visible:ring-neutral-400',
  link:        'bg-transparent text-primary-600 underline-offset-4 hover:underline p-0 h-auto focus-visible:ring-primary-500',
};

const sizeClasses: Record<JButtonSize, string> = {
  xs:      'min-h-6 px-2 py-0.5 text-xs rounded',
  sm:      'min-h-7 px-3 py-1 text-xs rounded-md',
  md:      'min-h-9 px-4 py-2 text-sm rounded-md',
  default: 'min-h-9 px-4 py-2 text-sm rounded-md',
  lg:      'min-h-11 px-6 py-2 text-base rounded-md',
  xl:      'min-h-14 px-8 py-3 text-lg rounded-lg',
  icon:    'h-9 w-9 p-0 rounded-md',
};

interface JButtonViewProps extends InterJButton {
  forwardedRef?: React.Ref<HTMLButtonElement>;
  [key: string]: unknown;
}

export const JButtonView: React.FC<JButtonViewProps> = ({
  variant = 'default',
  size = 'md',
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  disabled,
  type = 'button',
  className,
  style,
  children,
  icon,
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
  forwardedRef,
  ...rest
}) => {
  const activeIcon = loading ? <JSpinner size="sm" /> : icon;
  const hasIcon = Boolean(activeIcon);
  const isIconOnly = hasIcon && !children;

  return (
    <button
      ref={forwardedRef}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      data-jbutton-icon-position={hasIcon ? iconPosition : undefined}
      data-jbutton-full-width={fullWidth ? 'true' : undefined}
      style={style}
      className={cn(
        'jbutton',
        'inline-flex items-center justify-center gap-2',
        'font-medium transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        isIconOnly && 'gap-0',
        className
      )}
      {...rest}
    >
      {hasIcon && (
        <span className="jbutton-icon" aria-hidden="true">
          {activeIcon}
        </span>
      )}
      {children && <span className="jbutton-text">{children}</span>}
    </button>
  );
};
