// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JTextBox } from 'jona-ui';
import { forwardRef } from 'react';
import type { NumberFieldViewProps } from './NumberFieldImpl';

export const NumberFieldView = forwardRef<HTMLInputElement, NumberFieldViewProps>(
  ({ name, label, value, inputMode, readOnly, hasError, onInputChange, onInputBlur }, ref) => (
    <label style={{ display: 'grid', gap: 4 }}>
      <span>{label}</span>
      {/* A text input, not type=number: the value is a digit string that keeps its leading zeros (hora 05) or its typed decimals. */}
      <JTextBox
        ref={ref}
        name={name}
        inputMode={inputMode}
        autoComplete="off"
        value={value}
        readOnly={readOnly}
        hasError={hasError}
        className="min-h-11 sm:min-h-9"
        onChange={(next) => onInputChange(next)}
        onBlur={(current) => onInputBlur(current)}
      />
    </label>
  ),
);
NumberFieldView.displayName = 'NumberFieldView';
