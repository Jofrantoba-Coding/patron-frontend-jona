// Layer: Implementation. Filters the edits to accepted digits; no state of its own.
import { NUMBERFIELD_DEFAULTS, type InterNumberField } from './InterNumberField';

export interface NumberFieldViewProps extends Required<Pick<InterNumberField, 'name' | 'label' | 'value' | 'readOnly' | 'hasError'>> {
  onInputChange: (next: string) => void;
  onInputBlur: (value: string) => void;
}

/**
 * Typing and paste both arrive as a change whose value is the previous one with the selection replaced, so the
 * digits of that value are the accepted edit. One that would pass `max` is ignored whole (no truncation, no error),
 * like the Swing `IntegerDocument`; letters and symbols are dropped.
 */
export function useNumberFieldImpl(props: InterNumberField): NumberFieldViewProps {
  const { name, label, value, max, readOnly, hasError, onChange, onBlur } = { ...NUMBERFIELD_DEFAULTS, ...props };
  return {
    name, label, value, readOnly, hasError,
    onInputChange: (next) => {
      if (readOnly) return;
      const digits = next.replace(/\D/g, '');
      if (max !== undefined && digits.length > max) return;
      if (digits !== value) onChange(digits);
    },
    onInputBlur: (current) => onBlur?.(current),
  };
}
