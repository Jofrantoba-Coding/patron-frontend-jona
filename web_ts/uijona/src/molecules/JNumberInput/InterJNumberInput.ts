import React from 'react';

export interface InterJNumberInput
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'onBlur'> {
  value?: number | null;
  defaultValue?: number | null;
  min?: number;
  max?: number;
  step?: number;
  hasError?: boolean;
  onValueChange?: (value: number | null, event?: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => void;
  onIncrement?: (value: number) => void;
  onDecrement?: (value: number) => void;
  onBlur?: (value: number | null, event: React.FocusEvent<HTMLInputElement>) => void;
}

export const JNUMBER_INPUT_DEFAULTS: Required<Pick<InterJNumberInput, 'step' | 'hasError'>> = {
  step: 1,
  hasError: false,
};
