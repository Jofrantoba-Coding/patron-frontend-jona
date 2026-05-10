// InterTextareaAtom.ts — JONA Interface
import React from 'react';

export type TextareaAtomResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface InterTextareaAtom {
  hasError?: boolean;
  autoResize?: boolean;
  resize?: TextareaAtomResize;
  className?: string;
  // Observer events
  onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (value: string, event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const TEXTAREA_ATOM_DEFAULTS: Required<Pick<InterTextareaAtom, 'hasError' | 'autoResize' | 'resize'>> = {
  hasError: false,
  autoResize: false,
  resize: 'both',
};
