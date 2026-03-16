// FormFieldMolecule.tsx — Level 2: Molecule
// Inspired by shadcn/ui Field — Label + Input + Description/Error.
// Supports vertical (default) and horizontal orientation.
import React from 'react';
import { cn } from '../lib/cn';
import { LabelAtom } from '../atoms/LabelAtom';
import { InputAtom } from '../atoms/InputAtom';
import { ErrorMessageAtom } from '../atoms/ErrorMessageAtom';

interface FormFieldMoleculeProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
      ...inputProps
    },
    ref
  ) => {
    const hasError = !!errorMessage;

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
