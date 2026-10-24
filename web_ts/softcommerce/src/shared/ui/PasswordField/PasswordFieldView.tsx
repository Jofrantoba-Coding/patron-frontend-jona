// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JCheckBox, JTextBox } from 'jona-ui';
import { forwardRef } from 'react';
import type { PasswordFieldViewProps } from './PasswordFieldImpl';

export const PasswordFieldView = forwardRef<HTMLInputElement, PasswordFieldViewProps>(
  ({ name, label, value, readOnly, hasError, showLabel, shown, confirmLabel, confirmValue, confirmHasError, confirmRef, onInputChange, onConfirmInputChange, onShownChange }, ref) => (
    <div style={{ display: 'grid', gap: 8 }}>
      <label style={{ display: 'grid', gap: 4 }}>
        <span>{label}</span>
        <JTextBox
          ref={ref}
          name={name}
          type={shown ? 'text' : 'password'}
          autoComplete="new-password"
          value={value}
          readOnly={readOnly}
          hasError={hasError}
          className="min-h-11 sm:min-h-9"
          onChange={(next) => onInputChange(next)}
        />
      </label>
      {confirmLabel !== undefined && (
        <label style={{ display: 'grid', gap: 4 }}>
          <span>{confirmLabel}</span>
          <JTextBox
            ref={confirmRef}
            name={`${name}_confirmacion`}
            type={shown ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmValue}
            readOnly={readOnly}
            hasError={confirmHasError}
            className="min-h-11 sm:min-h-9"
            onChange={(next) => onConfirmInputChange(next)}
          />
        </label>
      )}
      {/* The wrapper keeps the 44px hit area on touch screens and compacts from sm: up. */}
      <div className="flex min-h-11 items-center sm:min-h-9">
        <JCheckBox label={showLabel} checked={shown} onCheckedChange={(next) => onShownChange(next)} />
      </div>
    </div>
  ),
);
PasswordFieldView.displayName = 'PasswordFieldView';
