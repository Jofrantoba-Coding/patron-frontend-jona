import React from 'react';
import { InterJTextBox, JTEXTBOX_DEFAULTS } from './InterJTextBox';
import { JTextBoxView } from './JTextBoxView';

type JTextBoxImplProps = InterJTextBox &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    // Eventos reemplazados con firma JONA (value-first)
    | 'onChange' | 'onBlur' | 'onKeyDown'
    // Props que define InterJTextBox — si no los omitimos, la intersección
    // con HTML los narrowea: ('sm'|'md'|'lg'|number) & number = number
    | 'value' | 'defaultValue' | 'type' | 'size'
  >;

export const JTextBoxImpl = React.forwardRef<HTMLInputElement, JTextBoxImplProps>(
  ({ onChange, onBlur, onKeyDown, onEnterPress, onClear, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange?.(e.target.value, e);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
      onBlur?.(e.target.value, e);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') onEnterPress?.((e.target as HTMLInputElement).value, e);
      if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '') onClear?.();
      onKeyDown?.(e);
    };

    return (
      <JTextBoxView
        {...JTEXTBOX_DEFAULTS}
        {...props}
        forwardedRef={ref}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    );
  }
);

JTextBoxImpl.displayName = 'JTextBox';
