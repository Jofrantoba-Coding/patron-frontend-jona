import React, { useState } from 'react';
import { cn } from '../../lib/cn';
import { JSWITCH_DEFAULTS, InterJSwitch, JSwitchSize } from './InterJSwitch';

const trackSize: Record<JSwitchSize, string> = {
  sm: 'w-8 h-4',
  md: 'w-11 h-6',
  lg: 'w-14 h-7',
};

const thumbSize: Record<JSwitchSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const thumbTranslate: Record<JSwitchSize, { on: string; off: string }> = {
  sm: { on: 'translate-x-4',  off: 'translate-x-0.5' },
  md: { on: 'translate-x-5',  off: 'translate-x-0.5' },
  lg: { on: 'translate-x-7',  off: 'translate-x-0.5' },
};

type JSwitchViewProps = InterJSwitch & {
  forwardedRef?: React.Ref<HTMLButtonElement>;
};

export const JSwitchView: React.FC<JSwitchViewProps> = ({
  checked,
  hasError  = JSWITCH_DEFAULTS.hasError,
  disabled  = JSWITCH_DEFAULTS.disabled,
  size      = JSWITCH_DEFAULTS.size,
  id,
  'aria-labelledby': ariaLabelledby,
  'aria-label': ariaLabel,
  className,
  style,
  onCheckedChange,
  forwardedRef,
}) => {
  const [internalChecked, setInternalChecked] = useState(false);
  const isControlled = checked !== undefined;
  const effectiveChecked = isControlled ? checked : internalChecked;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const next = !effectiveChecked;
    if (!isControlled) setInternalChecked(next);
    onCheckedChange?.(next, e);
  };

  return (
    <button
      ref={forwardedRef}
      id={id}
      type="button"
      role="switch"
      aria-checked={effectiveChecked}
      aria-labelledby={ariaLabelledby}
      aria-label={ariaLabel}
      disabled={disabled}
      data-jswitch-size={size}
      data-jswitch-error={hasError || undefined}
      onClick={handleClick}
      style={style}
      className={cn(
        'jswitch',
        'relative inline-flex items-center rounded-full transition-colors duration-200 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500',
        'disabled:pointer-events-none disabled:opacity-50',
        trackSize[size],
        effectiveChecked
          ? hasError ? 'bg-danger-500'  : 'bg-primary-600'
          : hasError ? 'bg-danger-200'  : 'bg-neutral-300',
        className
      )}
    >
      <span
        className={cn(
          'inline-block rounded-full bg-white shadow transition-transform duration-200',
          thumbSize[size],
          effectiveChecked ? thumbTranslate[size].on : thumbTranslate[size].off
        )}
      />
    </button>
  );
};

JSwitchView.displayName = 'JSwitchView';
