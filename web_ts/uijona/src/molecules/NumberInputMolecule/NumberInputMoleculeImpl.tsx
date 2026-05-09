import React, { useState } from 'react';
import { InterNumberInputMolecule, NUMBER_INPUT_MOLECULE_DEFAULTS } from './InterNumberInputMolecule';
import { NumberInputMoleculeView } from './NumberInputMoleculeView';

const clamp = (value: number, min?: number, max?: number) => {
  let nextValue = value;
  if (min !== undefined) nextValue = Math.max(min, nextValue);
  if (max !== undefined) nextValue = Math.min(max, nextValue);
  return nextValue;
};

const parseValue = (value: string): number | null => {
  if (value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const NumberInputMoleculeImpl = React.forwardRef<HTMLInputElement, InterNumberInputMolecule>(
  ({ value, defaultValue = null, min, max, step, onValueChange, onIncrement, onDecrement, onBlur, ...props }, ref) => {
    const resolved = { ...NUMBER_INPUT_MOLECULE_DEFAULTS, ...props, min, max, step };
    const [internalValue, setInternalValue] = useState<number | null>(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const displayValue = currentValue ?? '';
    const numericValue = currentValue ?? 0;

    const emitValue = (
      nextValue: number | null,
      event?: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>
    ) => {
      if (!isControlled) setInternalValue(nextValue);
      onValueChange?.(nextValue, event);
    };

    const stepValue = step ?? NUMBER_INPUT_MOLECULE_DEFAULTS.step;
    const canDecrement = currentValue === null || min === undefined || currentValue > min;
    const canIncrement = currentValue === null || max === undefined || currentValue < max;

    return (
      <NumberInputMoleculeView
        {...resolved}
        displayValue={String(displayValue)}
        forwardedRef={ref}
        canDecrement={canDecrement}
        canIncrement={canIncrement}
        onInputChange={(event) => {
          const parsed = parseValue(event.target.value);
          emitValue(parsed === null ? null : clamp(parsed, min, max), event);
        }}
        onInputBlur={(event) => onBlur?.(parseValue(event.target.value), event)}
        onDecrementClick={(event) => {
          const nextValue = clamp(numericValue - stepValue, min, max);
          emitValue(nextValue, event);
          onDecrement?.(nextValue);
        }}
        onIncrementClick={(event) => {
          const nextValue = clamp(numericValue + stepValue, min, max);
          emitValue(nextValue, event);
          onIncrement?.(nextValue);
        }}
      />
    );
  }
);

NumberInputMoleculeImpl.displayName = 'NumberInputMolecule';
