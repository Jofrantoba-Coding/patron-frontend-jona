// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JDatePicker } from 'jona-ui';
import type { DateFieldViewProps } from './DateFieldImpl';
import { DATE_MASK } from './InterDateField';

export const DateFieldView = ({ name, label, value, readOnly, wrapperRef, onValueChange }: DateFieldViewProps) => (
  <label style={{ display: 'grid', gap: 4 }}>
    <span>{label}</span>
    <div ref={wrapperRef} data-field={name}>
      {/* A read-only date is disabled: the picker has no read-only mode. The 44px mobile floor rides on its root. */}
      <JDatePicker
        value={value}
        mask={DATE_MASK}
        placeholder={DATE_MASK}
        disabled={readOnly}
        className="min-h-11 sm:min-h-9"
        onChange={(next) => onValueChange(next)}
      />
    </div>
  </label>
);
