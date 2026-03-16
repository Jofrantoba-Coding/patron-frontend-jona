// FormFieldMolecule.tsx — Level 2: Molecule
// Observer pattern: props extends InterEventsFormFieldMolecule (event contract).
// Composes InterEventsInputAtom via the molecule contract.
import React from 'react';
import { cn } from '../lib/cn';
import { LabelAtom } from '../atoms/LabelAtom';
import { InputAtom } from '../atoms/InputAtom';
import { ErrorMessageAtom } from '../atoms/ErrorMessageAtom';
import { InterEventsFormFieldMolecule } from './events/InterEventsFormFieldMolecule';

interface FormFieldMoleculeProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'onKeyDown' | 'onInvalid'>,
    InterEventsFormFieldMolecule {
  id: string;
  label: string;
  errorMessage?: string;
  description?: string;
  orientation?: 'vertical' | 'horizontal';
}

export const FormFieldMolecule = React.forwardRef<HTMLInputElement, FormFieldMoleculeProps>(
  (
    {
      id,
      label,
      errorMessage,
      description,
      orientation = 'vertical',
      required,
      className,
      // InterEventsFormFieldMolecule (includes InterEventsInputAtom)
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      onEnterPress,
      onClear,
      onValid,
      onInvalid,
      ...inputProps
    },
    ref
  ) => {
    const hasError = !!errorMessage;

    const handleBlur = (value: string, e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(value, e);
      // Run validation on blur
      if (hasError) {
        onInvalid?.(value, errorMessage ?? '');
      } else {
        onValid?.(value);
      }
    };

    return (
      <div
        className={cn(
          orientation === 'horizontal'
            ? 'flex items-center gap-4'
            : 'flex flex-col gap-1.5',
          className
        )}
      >
        <LabelAtom htmlFor={id} required={required}>
          {label}
        </LabelAtom>
        <div className={cn('flex flex-col gap-1', orientation === 'horizontal' && 'flex-1')}>
          <InputAtom
            ref={ref}
            id={id}
            hasError={hasError}
            required={required}
            aria-describedby={description ? `${id}-desc` : undefined}
            onChange={onChange}
            onBlur={handleBlur}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            onEnterPress={onEnterPress}
            onClear={onClear}
            {...inputProps}
          />
          {description && !hasError && (
            <ErrorMessageAtom id={`${id}-desc`} message={description} type="description" />
          )}
          {hasError && (
            <ErrorMessageAtom message={errorMessage} type="error" />
          )}
        </div>
      </div>
    );
  }
);

FormFieldMolecule.displayName = 'FormFieldMolecule';
