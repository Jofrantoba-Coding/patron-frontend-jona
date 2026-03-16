// FormFieldMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { LabelAtom } from '../../atoms/LabelAtom';
import { InputAtom } from '../../atoms/InputAtom';
import { ErrorMessageAtom } from '../../atoms/ErrorMessageAtom';
import { InterFormFieldMolecule } from './InterFormFieldMolecule';

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
    <div className={cn(orientation === 'horizontal' ? 'flex items-center gap-4' : 'flex flex-col gap-1.5', className)}>
      <LabelAtom htmlFor={id} required={required}>{label}</LabelAtom>
      <div className={cn('flex flex-col gap-1', orientation === 'horizontal' && 'flex-1')}>
        <InputAtom
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
        {description && !hasError && <ErrorMessageAtom id={`${id}-desc`} message={description} type="description" />}
        {hasError && <ErrorMessageAtom message={errorMessage} type="error" />}
      </div>
    </div>
  );
};
