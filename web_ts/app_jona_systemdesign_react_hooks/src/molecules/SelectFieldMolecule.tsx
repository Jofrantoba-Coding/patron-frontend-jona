// SelectFieldMolecule.tsx — Level 2: Molecule
// Inspired by shadcn/ui Select + Field — select with label, description, error.
import React from 'react';
import { cn } from '../lib/cn';
import { LabelAtom } from '../atoms/LabelAtom';
import { SelectAtom, SelectOption, SelectGroup } from '../atoms/SelectAtom';
import { ErrorMessageAtom } from '../atoms/ErrorMessageAtom';

interface SelectFieldMoleculeProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options?: SelectOption[];
  groups?: SelectGroup[];
  placeholder?: string;
  errorMessage?: string;
  description?: string;
}

export const SelectFieldMolecule = React.forwardRef<HTMLSelectElement, SelectFieldMoleculeProps>(
  (
    { id, label, options, groups, placeholder, errorMessage, description, required, className, ...selectProps },
    ref
  ) => {
    const hasError = !!errorMessage;

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        <LabelAtom htmlFor={id} required={required}>
          {label}
        </LabelAtom>
        <SelectAtom
          ref={ref}
          id={id}
          options={options}
          groups={groups}
          placeholder={placeholder}
          hasError={hasError}
          required={required}
          aria-describedby={description ? `${id}-desc` : undefined}
          {...selectProps}
        />
        {description && !hasError && (
          <ErrorMessageAtom id={`${id}-desc`} message={description} type="description" />
        )}
        {hasError && <ErrorMessageAtom message={errorMessage} type="error" />}
      </div>
    );
  }
);

SelectFieldMolecule.displayName = 'SelectFieldMolecule';
