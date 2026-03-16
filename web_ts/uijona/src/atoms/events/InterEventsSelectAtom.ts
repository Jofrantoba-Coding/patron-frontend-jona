import React from 'react';

export interface InterEventsSelectAtom {
  onChange?: (value: string, event: React.ChangeEvent<HTMLSelectElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  onBlur?: (value: string, event: React.FocusEvent<HTMLSelectElement>) => void;
}
