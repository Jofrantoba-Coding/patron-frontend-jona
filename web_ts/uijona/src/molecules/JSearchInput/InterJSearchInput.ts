import React from 'react';

export interface InterJSearchInput
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'onKeyDown'> {
  value?: string;
  defaultValue?: string;
  clearable?: boolean;
  loading?: boolean;
  containerClassName?: string;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (value: string, event?: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => void;
  onClear?: () => void;
  onBlur?: (value: string, event: React.FocusEvent<HTMLInputElement>) => void;
  onEnterPress?: (value: string, event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const JSEARCH_INPUT_DEFAULTS: Required<Pick<InterJSearchInput, 'clearable' | 'loading'>> = {
  clearable: true,
  loading: false,
};
