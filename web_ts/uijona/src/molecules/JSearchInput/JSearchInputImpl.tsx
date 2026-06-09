import React, { useState } from 'react';
import { InterJSearchInput, JSEARCH_INPUT_DEFAULTS } from './InterJSearchInput';
import { JSearchInputView } from './JSearchInputView';

export const JSearchInputImpl = React.forwardRef<HTMLInputElement, InterJSearchInput>(
  ({ value, defaultValue = '', onChange, onSearch, onClear, onBlur, onEnterPress, ...props }, ref) => {
    const resolved = { ...JSEARCH_INPUT_DEFAULTS, ...props };
    const [internalValue, setInternalValue] = useState(defaultValue);
    const inputValue = value ?? internalValue;

    const setNextValue = (nextValue: string, event: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) setInternalValue(nextValue);
      onChange?.(nextValue, event);
    };

    return (
      <JSearchInputView
        {...resolved}
        inputValue={inputValue}
        forwardedRef={ref}
        onInputChange={(event) => setNextValue(event.target.value, event)}
        onInputBlur={(event) => onBlur?.(event.target.value, event)}
        onInputKeyDown={(event) => {
          if (event.key === 'Enter') {
            onEnterPress?.(inputValue, event);
            onSearch?.(inputValue, event);
          }
        }}
        onClearClick={() => {
          if (value === undefined) setInternalValue('');
          onClear?.();
        }}
        onSearchClick={(event) => onSearch?.(inputValue, event)}
      />
    );
  }
);

JSearchInputImpl.displayName = 'JSearchInput';
