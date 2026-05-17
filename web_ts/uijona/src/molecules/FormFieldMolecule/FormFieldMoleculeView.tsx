// FormFieldMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { JLabel } from '../../atoms/JLabel';
import { JTextBox } from '../../atoms/JTextBox';
import { InterFormFieldMolecule } from './InterFormFieldMolecule';
import { JPanel } from '../../atoms/JPanel/JPanel';

type FormFieldMoleculeViewProps = Omit<InterFormFieldMolecule, 'onInvalid'> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'onKeyDown' | 'onInvalid'> & {
    forwardedRef?: React.Ref<HTMLInputElement>;
    onInvalid?: (value: string, msg: string) => void;
    onInvalidInternal?: (value: string, msg: string) => void;
  };

export const FormFieldMoleculeView: React.FC<FormFieldMoleculeViewProps> = ({
  id, label, errorMessage, description, orientation = 'vertical', required, className,
  onChange, onBlur, onFocus, onKeyDown, onEnterPress, onClear, onValid, onInvalid,
  onInvalidInternal, forwardedRef, ...inputProps
}) => {
  const hasError = !!errorMessage;
  return (
    <JPanel variant="ghost" padding="none" radius="none" className={cn(orientation === 'horizontal' ? 'flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4' : 'flex flex-col gap-1.5', className)}>
      <JLabel variant="label" htmlFor={id} required={required} className={cn(orientation === 'horizontal' && 'sm:shrink-0')}>{label}</JLabel>
      <JPanel variant="ghost" padding="none" radius="none" className={cn('flex min-w-0 flex-col gap-1', orientation === 'horizontal' && 'sm:flex-1')}>
        <JTextBox
          ref={forwardedRef}
          id={id}
          hasError={hasError}
          required={required}
          aria-describedby={description ? `${id}-desc` : undefined}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          onEnterPress={onEnterPress}
          onClear={onClear}
          {...inputProps}
        />
        {description && !hasError && <JLabel id={`${id}-desc`} message={description} variant="description" />}
        {hasError && <JLabel message={errorMessage} variant="error" />}
      </JPanel>
    </JPanel>
  );
};
