// InterJSelectField.ts — JONA Interface
import React from 'react';
import { JComboBoxOption, JComboBoxGroup } from '../../atoms/JComboBox';

export interface InterJSelectField {
  id: string;
  label: string;
  options?: JComboBoxOption[];
  groups?: JComboBoxGroup[];
  placeholder?: string;
  errorMessage?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  // Observer events
  onChange?: (value: string, event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (value: string, event: React.FocusEvent<HTMLSelectElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLSelectElement>) => void;
}
