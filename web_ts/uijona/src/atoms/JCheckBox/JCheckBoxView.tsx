import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { InterJCheckBox, JCheckBoxSize, JCheckBoxLabelPosition } from './InterJCheckBox';

interface JCheckBoxViewProps extends InterJCheckBox {
  forwardedRef?: React.Ref<HTMLInputElement>;
}

const sizeClasses: Record<JCheckBoxSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

const wrapperClasses: Record<JCheckBoxLabelPosition, string> = {
  right:  'flex flex-row items-center gap-2',
  left:   'flex flex-row-reverse items-center gap-2',
  top:    'flex flex-col-reverse items-start gap-1',
  bottom: 'flex flex-col items-start gap-1',
};

export const JCheckBoxView: React.FC<JCheckBoxViewProps> = ({
  checked,
  defaultChecked,
  indeterminate  = false,
  hasError       = false,
  disabled       = false,
  size           = 'md',
  label,
  labelPosition  = 'right',
  labelClassName,
  className,
  style,
  onCheckedChange,
  onFocus,
  onBlur,
  forwardedRef,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
  const effectiveChecked = isControlled ? checked : internalChecked;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate && !effectiveChecked;
    }
  }, [indeterminate, effectiveChecked]);

  const assignRef = (el: HTMLInputElement | null) => {
    inputRef.current = el;
    if (el) el.indeterminate = indeterminate && !effectiveChecked;
    if (!forwardedRef) return;
    if (typeof forwardedRef === 'function') forwardedRef(el);
    else (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (!isControlled) setInternalChecked(e.target.checked);
    onCheckedChange?.(e.target.checked, e);
  };

  const input = (
    <input
      ref={assignRef}
      type="checkbox"
      checked={effectiveChecked}
      disabled={disabled}
      data-jcheckbox-size={size}
      data-jcheckbox-error={hasError ? 'true' : undefined}
      data-jcheckbox-indeterminate={indeterminate && !effectiveChecked ? 'true' : undefined}
      className={cn(
        'jcheckbox',
        sizeClasses[size],
        hasError ? 'border-danger-500 accent-danger-500' : 'border-neutral-300 accent-primary-600',
        className,
      )}
      style={style}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      {...rest}
    />
  );

  if (!label) return input;

  return (
    <label className={cn(
      'inline-flex',
      wrapperClasses[labelPosition],
      disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    )}>
      {input}
      <span className={cn(
        'text-sm text-neutral-700 select-none leading-none',
        disabled && 'opacity-50',
        labelClassName,
      )}>
        {label}
      </span>
    </label>
  );
};
