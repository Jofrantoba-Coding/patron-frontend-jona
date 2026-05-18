import React from 'react';
import { cn } from '../../lib/cn';
import { JRADIOBUTTON_DEFAULTS, InterJRadioButton, JRadioButtonLabelPosition } from './InterJRadioButton';

type JRadioButtonViewProps = InterJRadioButton &
  Omit<React.InputHTMLAttributes<HTMLInputElement>,
    'className' | 'style' | 'onChange' | 'checked' | 'type' | 'disabled' | 'onFocus' | 'onBlur'
  > & {
    forwardedRef?: React.Ref<HTMLInputElement>;
  };

const wrapperClasses: Record<JRadioButtonLabelPosition, string> = {
  right:  'flex flex-row items-center gap-2',
  left:   'flex flex-row-reverse items-center gap-2',
  top:    'flex flex-col-reverse items-start gap-1',
  bottom: 'flex flex-col items-start gap-1',
};

export const JRadioButtonView: React.FC<JRadioButtonViewProps> = ({
  checked,
  hasError       = JRADIOBUTTON_DEFAULTS.hasError,
  disabled       = JRADIOBUTTON_DEFAULTS.disabled,
  id,
  name,
  value,
  label,
  labelPosition  = JRADIOBUTTON_DEFAULTS.labelPosition,
  labelClassName,
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

  const input = (
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

JRadioButtonView.displayName = 'JRadioButtonView';
