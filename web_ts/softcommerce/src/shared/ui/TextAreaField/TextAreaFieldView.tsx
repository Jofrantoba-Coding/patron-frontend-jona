// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JTextArea } from 'jona-ui';
import { forwardRef } from 'react';
import type { TextAreaFieldViewProps } from './TextAreaFieldImpl';

export const TextAreaFieldView = forwardRef<HTMLTextAreaElement, TextAreaFieldViewProps>(
  ({ name, label, value, rows, readOnly, hasError, onInputChange, onInputBlur }, ref) => (
    <label style={{ display: 'grid', gap: 4 }}>
      <span>{label}</span>
      <JTextArea
        ref={ref}
        name={name}
        rows={rows}
        value={value}
        readOnly={readOnly}
        hasError={hasError}
        resize="vertical"
        className="min-h-11 sm:min-h-9"
        onChange={(next) => onInputChange(next)}
        onBlur={(current) => onInputBlur(current)}
      />
    </label>
  ),
);
TextAreaFieldView.displayName = 'TextAreaFieldView';
