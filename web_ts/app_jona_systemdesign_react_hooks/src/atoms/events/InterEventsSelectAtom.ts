// InterEventsSelectAtom.ts — Observer: Event Contract for SelectAtom
// Declares every event SelectAtom can emit.
import React from 'react';

export interface InterEventsSelectAtom {
  /** Fired when the selected value changes — carries the new value string */
  onChange?: (value: string, event: React.ChangeEvent<HTMLSelectElement>) => void;

  /** Fired when the select receives focus */
  onFocus?: (event: React.FocusEvent<HTMLSelectElement>) => void;

  /** Fired when the select loses focus */
  onBlur?: (value: string, event: React.FocusEvent<HTMLSelectElement>) => void;
}
