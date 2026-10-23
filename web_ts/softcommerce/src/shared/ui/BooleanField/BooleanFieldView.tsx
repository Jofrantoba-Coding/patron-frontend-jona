// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JCheckBox } from 'jona-ui';
import { forwardRef } from 'react';
import type { BooleanFieldViewProps } from './BooleanFieldImpl';

export const BooleanFieldView = forwardRef<HTMLInputElement, BooleanFieldViewProps>(
  ({ label, checked, readOnly, hasError, onCheckedChange }, ref) => (
    // The wrapper keeps the 44px hit area on touch screens and compacts from sm: up.
    <div className="flex min-h-11 items-center sm:min-h-9">
      <JCheckBox
        ref={ref}
        label={label}
        checked={checked}
        disabled={readOnly}
        hasError={hasError}
        aria-invalid={hasError || undefined}
        onCheckedChange={(next) => onCheckedChange(next)}
      />
    </div>
  ),
);
BooleanFieldView.displayName = 'BooleanFieldView';
