// JSwitchFieldView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { JSwitch } from '../../atoms/JSwitch';
import { JLabel } from '../../atoms/JLabel';
import { InterJSwitchField } from './InterJSwitchField';

export const JSwitchFieldView: React.FC<InterJSwitchField> = ({
  id, label, checked, onCheckedChange, description, errorMessage,
  disabled = false, size = 'md', card = false, className,
}) => {
  const hasError = !!errorMessage;

  const inner = (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-0.5">
        <JLabel
          variant="label"
          htmlFor={id}
          className={cn('cursor-pointer', disabled && 'opacity-50')}
        >
          {label}
        </JLabel>
        {description && !hasError && <JLabel message={description} variant="description" />}
        {hasError && <JLabel message={errorMessage} variant="error" />}
      </div>
      <JSwitch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        hasError={hasError}
        size={size}
        aria-labelledby={`${id}-label`}
      />
    </div>
  );

  if (card) {
    return (
      <div
        className={cn(
          'cursor-pointer rounded-md border border-neutral-200 p-4 transition-colors duration-150 hover:bg-neutral-50',
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        onClick={() => !disabled && onCheckedChange?.(!checked)}
      >
        {inner}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {inner}
    </div>
  );
};
