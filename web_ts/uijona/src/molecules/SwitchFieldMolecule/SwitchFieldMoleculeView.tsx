// SwitchFieldMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { SwitchAtom } from '../../atoms/SwitchAtom';
import { LabelAtom } from '../../atoms/LabelAtom';
import { ErrorMessageAtom } from '../../atoms/ErrorMessageAtom';
import { InterSwitchFieldMolecule } from './InterSwitchFieldMolecule';

export const SwitchFieldMoleculeView: React.FC<InterSwitchFieldMolecule> = ({
  id, label, checked = false, onCheckedChange, description, errorMessage, disabled = false, size = 'md', card = false, className,
}) => {
  const hasError = !!errorMessage;
  const inner = (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5 min-w-0">
        <LabelAtom htmlFor={id} className={cn('cursor-pointer', disabled && 'opacity-50')}>{label}</LabelAtom>
        {description && !hasError && <ErrorMessageAtom message={description} type="description" />}
        {hasError && <ErrorMessageAtom message={errorMessage} type="error" />}
      </div>
      <SwitchAtom id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} hasError={hasError} size={size} aria-labelledby={`${id}-label`} />
    </div>
  );

  if (card) {
    return (
      <div
        className={cn('rounded-md border border-neutral-200 p-4 cursor-pointer hover:bg-neutral-50 transition-colors duration-150', disabled && 'pointer-events-none opacity-50', className)}
        onClick={() => !disabled && onCheckedChange?.(!checked)}
      >
        {inner}
      </div>
    );
  }
  return <div className={cn('flex flex-col gap-1', className)}>{inner}</div>;
};
