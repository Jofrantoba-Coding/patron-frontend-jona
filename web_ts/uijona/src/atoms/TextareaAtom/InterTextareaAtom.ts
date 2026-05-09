// InterTextareaAtom.ts — JONA Interface
import React from 'react';

export interface InterTextareaAtom {
  hasError?: boolean;
  autoResize?: boolean;
  className?: string;
  // Observer events
  onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (value: string, event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const TEXTAREA_ATOM_DEFAULTS: Required<Pick<InterTextareaAtom, 'hasError' | 'autoResize'>> = {
  hasError: false,
  autoResize: false,
};
