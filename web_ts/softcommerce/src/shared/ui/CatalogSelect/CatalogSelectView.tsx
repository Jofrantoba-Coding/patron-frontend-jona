// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JComboBox } from 'jona-ui';
import { forwardRef } from 'react';
import type { CatalogSelectViewProps } from './CatalogSelectImpl';

export const CatalogSelectView = forwardRef<HTMLSelectElement, CatalogSelectViewProps>(
  ({ name, label, options, value, readOnly, hasError, placeholder, onValueChange }, ref) => (
    <label style={{ display: 'grid', gap: 4 }}>
      <span>{label}</span>
      <JComboBox
        ref={ref}
        name={name}
        placeholder={placeholder}
        value={value}
        options={options.map((option) => ({ value: option.id, label: option.name }))}
        disabled={readOnly}
        hasError={hasError}
        className="min-h-11 sm:min-h-9"
        onChange={(next) => onValueChange(next)}
      />
    </label>
  ),
);
CatalogSelectView.displayName = 'CatalogSelectView';
