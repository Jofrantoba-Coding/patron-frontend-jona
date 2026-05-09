import React, { useState } from 'react';
import { InterSearchInputMolecule, SEARCH_INPUT_MOLECULE_DEFAULTS } from './InterSearchInputMolecule';
import { SearchInputMoleculeView } from './SearchInputMoleculeView';

export const SearchInputMoleculeImpl = React.forwardRef<HTMLInputElement, InterSearchInputMolecule>(
  ({ value, defaultValue = '', onChange, onSearch, onClear, onBlur, onEnterPress, ...props }, ref) => {
    const resolved = { ...SEARCH_INPUT_MOLECULE_DEFAULTS, ...props };
    const [internalValue, setInternalValue] = useState(defaultValue);
    const inputValue = value ?? internalValue;

    const setNextValue = (nextValue: string, event: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) setInternalValue(nextValue);
      onChange?.(nextValue, event);
    };

    return (
      <SearchInputMoleculeView
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

SearchInputMoleculeImpl.displayName = 'SearchInputMolecule';
