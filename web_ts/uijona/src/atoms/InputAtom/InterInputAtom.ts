// InterInputAtom.ts — JONA Interface
import React from 'react';

export interface InterInputAtom {
  hasError?: boolean;
  className?: string;
  // Observer events
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (value: string, event: React.FocusEvent<HTMLInputElement>) => void;
  onEnterPress?: (value: string, event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}

export const INPUT_ATOM_DEFAULTS: Required<Pick<InterInputAtom, 'hasError'>> = {
  hasError: false,
};
