// JFormFieldView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { JLabel } from '../../atoms/JLabel';
import { JTextBox } from '../../atoms/JTextBox';
import { InterJFormField } from './InterJFormField';

export type JFormFieldViewProps = Omit<InterJFormField, 'onInvalid'> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'onKeyDown' | 'onInvalid'> & {
    forwardedRef?: React.Ref<HTMLInputElement>;
    onInvalid?:   (value: string, msg: string) => void;
  };

export const JFormFieldView: React.FC<JFormFieldViewProps> = ({
  id, label, errorMessage, description, orientation = 'vertical', required, className,
  onChange, onBlur, onFocus, onKeyDown, onEnterPress, onClear, onValid, onInvalid,
  forwardedRef, ...inputProps
}) => {
  const hasError = !!errorMessage;

  // aria-describedby apunta a la descripción y/o al mensaje de error según el estado
  const describedBy = [
    description && !hasError && `${id}-desc`,
    hasError && `${id}-error`,
  ].filter(Boolean).join(' ') || undefined;

  return (
    // div nativo: evita --jpanel-direction:column que bloquea sm:flex-row en JPanel
    <div
      className={cn(
        'flex flex-col gap-1.5',
        orientation === 'horizontal' && 'sm:flex-row sm:items-center sm:gap-4',
        className,
      )}
    >
      <JLabel
        variant="label"
        htmlFor={id}
        required={required}
        className={cn(orientation === 'horizontal' && 'sm:shrink-0')}
      >
        {label}
      </JLabel>

      <div className={cn('flex min-w-0 flex-col gap-1', orientation === 'horizontal' && 'sm:flex-1')}>
        <JTextBox
          ref={forwardedRef}
          id={id}
          hasError={hasError}
          required={required}
          aria-describedby={describedBy}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          onEnterPress={onEnterPress}
          onClear={onClear}
          {...inputProps}
        />
        {description && !hasError && (
          <JLabel id={`${id}-desc`} message={description} variant="description" />
        )}
        {hasError && (
          <JLabel id={`${id}-error`} message={errorMessage} variant="error" />
        )}
      </div>
    </div>
  );
};
