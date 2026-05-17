import React from 'react';
import { cn } from '../../lib/cn';
import type { InterJTextBox, JTextBoxVariant, JTextBoxSize } from './InterJTextBox';

const variantClasses: Record<JTextBoxVariant, string> = {
  default: 'border border-neutral-300 bg-neutral-50 text-neutral-900',
  filled:  'border-0 bg-neutral-100 text-neutral-900',
  ghost:   'border-0 bg-transparent text-neutral-900',
};

const sizeClasses: Record<JTextBoxSize, string> = {
  sm: 'h-7 px-3 text-xs rounded',
  md: 'h-9 px-3 text-sm rounded-md',
  lg: 'h-11 px-4 text-base rounded-md',
};

const VALID_SIZES = new Set<string>(['sm', 'md', 'lg']);

interface JTextBoxViewProps extends Omit<InterJTextBox, 'onChange' | 'onBlur' | 'onKeyDown'> {
  forwardedRef?: React.Ref<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  // Acepta HTML size (número) para que {...props} de los molecules no rompa el tipo
  size?: JTextBoxSize | number;
  [key: string]: unknown;
}

export const JTextBoxView: React.FC<JTextBoxViewProps> = ({
  variant = 'default',
  size: sizeProp = 'md',
  type = 'text',
  hasError = false,
  iconLeft,
  iconRight,
  className,
  style,
  forwardedRef,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  onEnterPress: _onEnterPress,
  onClear: _onClear,
  ...htmlProps
}) => {
  // Si llega un número (HTML size legacy), normaliza a 'md'
  const size: JTextBoxSize =
    typeof sizeProp === 'string' && VALID_SIZES.has(sizeProp)
      ? (sizeProp as JTextBoxSize)
      : 'md';

  const hasIconLeft = Boolean(iconLeft);
  const hasIconRight = Boolean(iconRight);

  return (
    <div
      className="jtextbox-root"
      data-jtextbox-variant={variant}
      data-jtextbox-size={size}
      data-jtextbox-error={hasError ? 'true' : undefined}
      data-jtextbox-has-icon-left={hasIconLeft ? 'true' : undefined}
      data-jtextbox-has-icon-right={hasIconRight ? 'true' : undefined}
      style={style}
    >
      {iconLeft && (
        <span className="jtextbox-icon jtextbox-icon--left" aria-hidden="true">
          {iconLeft}
        </span>
      )}

      <input
        ref={forwardedRef}
        type={type}
        aria-invalid={hasError || undefined}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        className={cn(
          'jtextbox',
          'w-full transition-colors duration-200',
          'placeholder:text-neutral-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          hasError
            ? 'border-danger-500 focus-visible:ring-danger-500'
            : 'focus-visible:ring-primary-500',
          className
        )}
        {...htmlProps}
      />

      {iconRight && (
        <span className="jtextbox-icon jtextbox-icon--right" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </div>
  );
};
