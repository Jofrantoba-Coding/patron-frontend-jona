import React from 'react';
import { cn } from '../../lib/cn';
import { InterJComboBox, JComboBoxSize, JComboBoxVariant } from './InterJComboBox';

interface JComboBoxViewProps extends InterJComboBox {
  forwardedRef?: React.Ref<HTMLSelectElement>;
}

const sizeClasses: Record<JComboBoxSize, string> = {
  sm: 'h-7 text-xs px-2 py-0.5',
  md: 'h-9 text-sm px-3 py-1',
  lg: 'h-11 text-base px-4 py-2',
};

const variantClasses: Record<JComboBoxVariant, string> = {
  default: 'bg-white border-neutral-300',
  filled:  'bg-neutral-50 border-neutral-200',
};

export const JComboBoxView: React.FC<JComboBoxViewProps> = ({
  options,
  groups,
  placeholder,
  value,
  hasError  = false,
  disabled  = false,
  size      = 'md',
  variant   = 'default',
  className,
  style,
  onChange,
  onFocus,
  onBlur,
  forwardedRef,
  ...rest
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    onChange?.(e.target.value, e);

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) =>
    onBlur?.(e.target.value, e);

  return (
    <select
      ref={forwardedRef}
      value={value}
      disabled={disabled}
      aria-invalid={hasError || undefined}
      data-jcombobox-size={size}
      data-jcombobox-variant={variant}
      data-jcombobox-error={hasError ? 'true' : undefined}
      className={cn(
        'jcombobox',
        'w-full rounded-md border cursor-pointer',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'disabled:pointer-events-none disabled:opacity-50',
        sizeClasses[size],
        variantClasses[variant],
        hasError
          ? 'border-danger-500 focus-visible:ring-danger-500'
          : 'focus-visible:ring-primary-500',
        className,
      )}
      style={style}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={handleBlur}
      {...rest}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {groups
        ? groups.map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.options.map((o) => (
                <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
              ))}
            </optgroup>
          ))
        : options?.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
          ))}
    </select>
  );
};
