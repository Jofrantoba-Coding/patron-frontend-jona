// CheckboxFieldMolecule.tsx — Level 2: Molecule
// Inspired by shadcn/ui Checkbox + Field — checkbox with label and description.
import React from 'react';
import { cn } from '../lib/cn';
import { CheckboxAtom } from '../atoms/CheckboxAtom';
import { LabelAtom } from '../atoms/LabelAtom';
import { ErrorMessageAtom } from '../atoms/ErrorMessageAtom';

interface CheckboxFieldMoleculeProps {
  id: string;
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  description?: string;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
}

export const CheckboxFieldMolecule: React.FC<CheckboxFieldMoleculeProps> = ({
  id,
  label,
  checked = false,
  onCheckedChange,
  description,
  errorMessage,
  disabled = false,
  className,
}) => {
  const hasError = !!errorMessage;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-start gap-2">
        <CheckboxAtom
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          hasError={hasError}
          aria-label={label}
        />
        <div className="flex flex-col gap-0.5">
          <LabelAtom htmlFor={id} className="cursor-pointer leading-tight">
            {label}
          </LabelAtom>
          {description && !hasError && (
            <ErrorMessageAtom message={description} type="description" />
          )}
        </div>
      </div>
      {hasError && <ErrorMessageAtom message={errorMessage} type="error" />}
    </div>
  );
};
