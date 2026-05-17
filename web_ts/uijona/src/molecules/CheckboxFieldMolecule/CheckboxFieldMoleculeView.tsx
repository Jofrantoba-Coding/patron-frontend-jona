// CheckboxFieldMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { CheckboxAtom } from '../../atoms/CheckboxAtom';
import { JLabel } from '../../atoms/JLabel';
import { InterCheckboxFieldMolecule } from './InterCheckboxFieldMolecule';
import { JPanel } from '../../atoms/JPanel/JPanel';

export const CheckboxFieldMoleculeView: React.FC<InterCheckboxFieldMolecule> = ({
  id, label, checked, onCheckedChange, description, errorMessage, disabled = false, className,
}) => {
  const hasError = !!errorMessage;
  return (
    <JPanel variant="ghost" padding="none" radius="none" className={cn('flex flex-col gap-1', className)}>
      <JPanel variant="ghost" padding="none" radius="none" className="flex items-start gap-2">
        <CheckboxAtom id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} hasError={hasError} aria-label={label} />
        <JPanel variant="ghost" padding="none" radius="none" className="flex flex-col gap-0.5">
          <JLabel variant="label" htmlFor={id} className="cursor-pointer leading-tight">{label}</JLabel>
          {description && !hasError && <JLabel message={description} variant="description" />}
        </JPanel>
      </JPanel>
      {hasError && <JLabel message={errorMessage} variant="error" />}
    </JPanel>
  );
};
