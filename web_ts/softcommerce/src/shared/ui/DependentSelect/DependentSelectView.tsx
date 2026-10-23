// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JAlert, JButton, JComboBox } from 'jona-ui';
import { forwardRef } from 'react';
import type { DependentSelectViewProps } from './DependentSelectImpl';

export const DependentSelectView = forwardRef<HTMLSelectElement, DependentSelectViewProps>(
  ({ name, label, options, value, disabled, loadFailed, hasError, placeholder, loadErrorMessage, retryLabel, onValueChange, onRetry }, ref) => (
    <div>
      <label style={{ display: 'grid', gap: 4 }}>
        <span>{label}</span>
        <JComboBox
          ref={ref}
          name={name}
          placeholder={placeholder}
          value={value}
          options={options.map((option) => ({ value: option.id, label: option.name }))}
          disabled={disabled}
          aria-describedby={loadFailed ? `${name}-load-error` : undefined}
          hasError={hasError}
          className="min-h-11 sm:min-h-9"
          onChange={(next) => onValueChange(next)}
        />
      </label>
      {loadFailed && (
        <JAlert id={`${name}-load-error`} variant="danger" role="alert">
          <span>{loadErrorMessage}</span>
          <JButton variant="outline" className="min-h-11 sm:min-h-9" onClick={onRetry}>
            {retryLabel}
          </JButton>
        </JAlert>
      )}
    </div>
  ),
);
DependentSelectView.displayName = 'DependentSelectView';
