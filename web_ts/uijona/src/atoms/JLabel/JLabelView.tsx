import React from 'react';
import { cn } from '../../lib/cn';
import { InterJLabel, JLabelAs, JLabelColor, JLabelSize, JLabelVariant } from './InterJLabel';

interface JLabelViewProps extends InterJLabel {
  forwardedRef?: React.Ref<HTMLElement>;
}

const variantClasses: Record<JLabelVariant, string> = {
  'body':        'text-neutral-900',
  'heading':     'font-semibold text-neutral-900',
  'label':       'text-sm font-medium text-neutral-700',
  'link':        'text-primary-600 underline-offset-4 hover:underline cursor-pointer',
  'link-muted':  'text-neutral-500 underline-offset-4 hover:underline cursor-pointer',
  'link-button': 'inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 cursor-pointer',
  'link-danger': 'text-danger-500 underline-offset-4 hover:underline cursor-pointer',
  'error':       'text-xs text-danger-500',
  'description': 'text-xs text-neutral-500',
};

const variantDefaultAs: Record<JLabelVariant, JLabelAs> = {
  'body':        'p',
  'heading':     'p',
  'label':       'label',
  'link':        'a',
  'link-muted':  'a',
  'link-button': 'a',
  'link-danger': 'a',
  'error':       'p',
  'description': 'p',
};

const variantDefaultSize: Partial<Record<JLabelVariant, JLabelSize>> = {
  'body':        'base',
  'heading':     '2xl',
  'label':       'sm',
  'error':       'xs',
  'description': 'xs',
};

const sizeClasses: Record<JLabelSize, string> = {
  'xs':   'text-xs',
  'sm':   'text-sm',
  'base': 'text-base',
  'lg':   'text-lg',
  'xl':   'text-xl',
  '2xl':  'text-2xl',
};

const colorClasses: Record<JLabelColor, string> = {
  'default': '',
  'muted':   'text-neutral-500',
  'primary': 'text-primary-600',
  'danger':  'text-danger-500',
  'success': 'text-success-600',
  'warning': 'text-warning-600',
};

export const JLabelView: React.FC<JLabelViewProps> = ({
  as,
  variant = 'body',
  size,
  color = 'default',
  truncate = false,
  htmlFor,
  required = false,
  href,
  target,
  rel,
  message,
  disabled = false,
  className,
  style,
  children,
  forwardedRef,
  ...rest
}) => {
  const content = children ?? (message != null ? message : undefined);

  // error and description render null when empty
  if ((variant === 'error' || variant === 'description') && !content) {
    return null;
  }

  const resolvedAs: JLabelAs = as ?? variantDefaultAs[variant];
  const resolvedSize: JLabelSize | undefined = size ?? variantDefaultSize[variant];
  const isLink = resolvedAs === 'a';
  const isLabel = resolvedAs === 'label';

  const classes = cn(
    variantClasses[variant],
    resolvedSize && sizeClasses[resolvedSize],
    color !== 'default' && colorClasses[color],
    truncate && 'jlabel-truncate',
    disabled && 'opacity-50',
    isLink && disabled && 'pointer-events-none',
    className,
  );

  const linkProps = isLink
    ? {
        href: disabled ? undefined : href,
        target,
        rel: target === '_blank' ? (rel ?? 'noopener noreferrer') : rel,
        'aria-disabled': disabled || undefined,
        tabIndex: disabled ? -1 : undefined,
        onClick: disabled
          ? (e: React.MouseEvent) => e.preventDefault()
          : undefined,
      }
    : {};

  const labelProps = isLabel ? { htmlFor } : {};

  const alertProps = variant === 'error' ? { role: 'alert' as const } : {};

  const Tag = resolvedAs as React.ElementType;

  return (
    <Tag
      ref={forwardedRef}
      className={classes}
      style={style}
      data-jlabel-variant={variant}
      {...alertProps}
      {...labelProps}
      {...linkProps}
      {...rest}
    >
      {content}
      {(isLabel || variant === 'label') && required && (
        <span className="ml-0.5 text-danger-500" aria-hidden="true">*</span>
      )}
    </Tag>
  );
};
