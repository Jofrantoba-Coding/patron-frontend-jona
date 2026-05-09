// RadioGroupMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { RadioAtom } from '../../atoms/RadioAtom';
import { InterRadioGroupMolecule, RadioGroupOption } from './InterRadioGroupMolecule';

interface RadioGroupMoleculeViewProps extends InterRadioGroupMolecule {
  selectedValue?: string;
  onOptionChange: (option: RadioGroupOption) => void;
}

export const RadioGroupMoleculeView: React.FC<RadioGroupMoleculeViewProps> = ({
  name, options, selectedValue, label, errorMessage, description, orientation = 'vertical',
  disabled, className, onOptionChange,
}) => (
  <fieldset className={cn('flex flex-col gap-2', className)} disabled={disabled}>
    {label && <legend className="text-sm font-medium text-neutral-900">{label}</legend>}
    {description && <p className="text-sm text-neutral-500">{description}</p>}
    <div
      role="radiogroup"
      aria-invalid={!!errorMessage || undefined}
      className={cn(
        'flex gap-3',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
      )}
    >
      {options.map((option) => {
        const optionId = `${name}-${option.value}`;
        const isDisabled = disabled || option.disabled;
        return (
          <label
            key={option.value}
            htmlFor={optionId}
            className={cn(
              'flex items-start gap-2 rounded-md',
              isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
            )}
          >
            <RadioAtom
              id={optionId}
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              disabled={isDisabled}
              hasError={!!errorMessage}
              onCheckedChange={(checked) => { if (checked) onOptionChange(option); }}
              className="mt-0.5"
            />
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-neutral-900">{option.label}</span>
              {option.description && <span className="text-sm text-neutral-500">{option.description}</span>}
            </span>
          </label>
        );
      })}
    </div>
    {errorMessage && <p className="text-sm text-danger-500">{errorMessage}</p>}
  </fieldset>
);
