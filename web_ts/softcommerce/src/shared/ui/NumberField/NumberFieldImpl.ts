// Layer: Implementation. Filters the edits to accepted digits; no state of its own.
import { NUMBERFIELD_DEFAULTS, type InterNumberField } from './InterNumberField';

export interface NumberFieldViewProps extends Required<Pick<InterNumberField, 'name' | 'label' | 'value' | 'readOnly' | 'hasError'>> {
  /** The keypad: digits for an integer, digits and a point for a decimal. */
  inputMode: 'numeric' | 'decimal';
  onInputChange: (next: string) => void;
  onInputBlur: (value: string) => void;
}

const DECIMAL_INPUT = /^-?[0-9]*(\.[0-9]*)?$/;

/**
 * Typing and paste both arrive as a change whose value is the previous one with the selection replaced, so the
 * digits of that value are the accepted edit. One that would pass `max` is ignored whole (no truncation, no error),
 * like the Swing `IntegerDocument`; letters and symbols are dropped.
 */
export function useNumberFieldImpl(props: InterNumberField): NumberFieldViewProps {
  const { name, label, value, max, scale, readOnly, hasError, onChange, onBlur } = { ...NUMBERFIELD_DEFAULTS, ...props };
  const decimal = scale > 0;
  return {
    name, label, value, readOnly, hasError, inputMode: decimal ? 'decimal' : 'numeric',
    onInputChange: (next) => {
      if (readOnly) return;
      // A decimal keeps the edit only when the whole text still matches the pattern (S-CRUD-25): a second point or a letter is ignored.
      if (decimal) {
        if (DECIMAL_INPUT.test(next) && next !== value) onChange(next);
        return;
      }
      const digits = next.replace(/\D/g, '');
      if (max !== undefined && digits.length > max) return;
      if (digits !== value) onChange(digits);
    },
    onInputBlur: (current) => onBlur?.(current),
  };
}
