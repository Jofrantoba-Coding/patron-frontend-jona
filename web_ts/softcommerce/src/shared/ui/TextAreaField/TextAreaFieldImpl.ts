// Layer: Implementation. Filters the edits like the Swing document; no state of its own.
import { TEXTAREAFIELD_DEFAULTS, type InterTextAreaField } from './InterTextAreaField';

export interface TextAreaFieldViewProps extends Required<Pick<InterTextAreaField, 'name' | 'label' | 'value' | 'rows' | 'readOnly' | 'hasError'>> {
  onInputChange: (next: string) => void;
  onInputBlur: (value: string) => void;
}

/**
 * Typing and paste both arrive as a change whose value is the previous one with the selection replaced, so the length of that value is the length of
 * the accepted edit: one that would pass `maxLength` is ignored whole. Enter is a plain line break (the register submits from its own button).
 */
export function useTextAreaFieldImpl(props: InterTextAreaField): TextAreaFieldViewProps {
  const { name, label, value, maxLength, uppercase, transform, onChange, onBlur } = props;
  // A prop the caller passes as `undefined` takes the default too (a register spreads optional config).
  const { rows, readOnly, hasError } = { rows: props.rows ?? TEXTAREAFIELD_DEFAULTS.rows, readOnly: props.readOnly ?? TEXTAREAFIELD_DEFAULTS.readOnly, hasError: props.hasError ?? TEXTAREAFIELD_DEFAULTS.hasError };
  return {
    name, label, value, rows, readOnly, hasError,
    onInputChange: (typed) => {
      if (readOnly) return;
      const next = transform ? transform(typed) : typed;
      if (maxLength !== undefined && next.length > maxLength) return;
      onChange(uppercase ? next.toUpperCase() : next);
    },
    onInputBlur: (current) => onBlur?.(current),
  };
}
