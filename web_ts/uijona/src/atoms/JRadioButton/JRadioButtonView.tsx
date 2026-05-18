import React from 'react';
import { cn } from '../../lib/cn';
import { JRADIOBUTTON_DEFAULTS, InterJRadioButton } from './InterJRadioButton';

type JRadioButtonViewProps = InterJRadioButton &
  Omit<React.InputHTMLAttributes<HTMLInputElement>,
    'className' | 'style' | 'onChange' | 'checked' | 'type' | 'disabled' | 'onFocus' | 'onBlur'
  > & {
    forwardedRef?: React.Ref<HTMLInputElement>;
  };

export const JRadioButtonView: React.FC<JRadioButtonViewProps> = ({
  checked,
  hasError  = JRADIOBUTTON_DEFAULTS.hasError,
  disabled  = JRADIOBUTTON_DEFAULTS.disabled,
  id,
  name,
  value,
  className,
  style,
  onCheckedChange,
  onFocus,
  onBlur,
  forwardedRef,
  ...htmlProps
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onCheckedChange?.(event.target.checked, event.target.value, event);
  };

  return (
    <input
      ref={forwardedRef}
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={checked}
      disabled={disabled}
      data-jradiobutton-error={hasError || undefined}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      style={style}
      className={cn(
        'jradiobutton',
        'h-4 w-4 border cursor-pointer',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-500',
        'disabled:pointer-events-none disabled:opacity-50',
        hasError ? 'border-danger-500 text-danger-500' : 'border-neutral-300 text-primary-600',
        className
      )}
      {...htmlProps}
    />
  );
};

JRadioButtonView.displayName = 'JRadioButtonView';
