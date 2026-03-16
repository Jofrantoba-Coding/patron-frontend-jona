// InterEventsInputAtom.ts — Observer: Event Contract for InputAtom
// Declares every event InputAtom can emit.
import React from 'react';

export interface InterEventsInputAtom {
  /** Fired on every keystroke — carries the new string value */
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;

  /** Fired when the input receives focus */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /** Fired when the input loses focus (good for validation triggers) */
  onBlur?: (value: string, event: React.FocusEvent<HTMLInputElement>) => void;

  /** Fired when Enter is pressed inside the input */
  onEnterPress?: (value: string, event: React.KeyboardEvent<HTMLInputElement>) => void;

  /** Fired on any keydown event */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  /** Fired when the input value is cleared (value becomes '') */
  onClear?: () => void;
}
