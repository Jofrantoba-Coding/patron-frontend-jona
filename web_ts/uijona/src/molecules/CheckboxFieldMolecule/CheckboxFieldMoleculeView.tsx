// CheckboxFieldMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { CheckboxAtom } from '../../atoms/CheckboxAtom';
import { LabelAtom } from '../../atoms/LabelAtom';
import { ErrorMessageAtom } from '../../atoms/ErrorMessageAtom';
import { InterCheckboxFieldMolecule } from './InterCheckboxFieldMolecule';

export const CheckboxFieldMoleculeView: React.FC<InterCheckboxFieldMolecule> = ({
  id, label, checked = false, onCheckedChange, description, errorMessage, disabled = false, className,
}) => {
  const hasError = !!errorMessage;
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-start gap-2">
        <CheckboxAtom id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} hasError={hasError} aria-label={label} />
        <div className="flex flex-col gap-0.5">
          <LabelAtom htmlFor={id} className="cursor-pointer leading-tight">{label}</LabelAtom>
          {description && !hasError && <ErrorMessageAtom message={description} type="description" />}
        </div>
      </div>
      {hasError && <ErrorMessageAtom message={errorMessage} type="error" />}
    </div>
  );
};
