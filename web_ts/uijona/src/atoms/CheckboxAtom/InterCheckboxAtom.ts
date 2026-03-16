// InterCheckboxAtom.ts — JONA Interface
import React from 'react';

export interface InterCheckboxAtom {
  checked?: boolean;
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
  // Observer events
  onCheckedChange?: (checked: boolean) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const CHECKBOX_ATOM_DEFAULTS: Required<Pick<InterCheckboxAtom, 'checked' | 'hasError' | 'disabled'>> = {
  checked:  false,
  hasError: false,
  disabled: false,
};
