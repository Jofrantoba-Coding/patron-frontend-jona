import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/cn';
import { InterJTextArea, JTextAreaResize, JTextAreaSize, JTextAreaVariant } from './InterJTextArea';

interface JTextAreaViewProps extends InterJTextArea {
  forwardedRef?: React.Ref<HTMLTextAreaElement>;
}

const resizeClasses: Record<JTextAreaResize, string> = {
  none:       'resize-none',
  vertical:   'resize-y',
  horizontal: 'resize-x',
  both:       'resize',
};

const sizeClasses: Record<JTextAreaSize, string> = {
  sm: 'min-h-[60px] text-xs px-2 py-1.5',
  md: 'min-h-[80px] text-sm px-3 py-2',
  lg: 'min-h-[100px] text-base px-4 py-2.5',
};

const variantClasses: Record<JTextAreaVariant, string> = {
  default: 'bg-white border-neutral-300',
  filled:  'bg-neutral-50 border-neutral-200',
};

export const JTextAreaView: React.FC<JTextAreaViewProps> = ({
  hasError   = false,
  autoResize = false,
  resize     = 'both',
  disabled   = false,
  size       = 'md',
  variant    = 'default',
  className,
  style,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  forwardedRef,
  ...rest
}) => {
  const localRef = useRef<HTMLTextAreaElement | null>(null);

  const updateHeight = (el: HTMLTextAreaElement) => {
    if (!autoResize) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    if (localRef.current) updateHeight(localRef.current);
  });

  const assignRef = (el: HTMLTextAreaElement | null) => {
    localRef.current = el;
    if (el) updateHeight(el);
    if (!forwardedRef) return;
    if (typeof forwardedRef === 'function') forwardedRef(el);
    else (forwardedRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateHeight(e.target);
    onChange?.(e.target.value, e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) =>
    onBlur?.(e.target.value, e);

  return (
    <textarea
      ref={assignRef}
      disabled={disabled}
      aria-invalid={hasError || undefined}
      data-jtextarea-size={size}
      data-jtextarea-variant={variant}
      data-jtextarea-resize={resize}
      data-jtextarea-error={hasError ? 'true' : undefined}
      data-jtextarea-autoresize={autoResize ? 'true' : undefined}
      className={cn(
        'jtextarea',
        'w-full rounded-md border text-neutral-900',
        'placeholder:text-neutral-400 transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-50',
        sizeClasses[size],
        variantClasses[variant],
        resizeClasses[resize],
        hasError
          ? 'border-danger-500 focus-visible:ring-danger-500'
          : 'focus-visible:ring-primary-500',
        className,
      )}
      style={style}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={handleBlur}
      onKeyDown={onKeyDown}
      {...rest}
    />
  );
};
