// Layer: Implementation. Adapts the value-first contract to the checkbox events; no state of its own.
import { BOOLEANFIELD_DEFAULTS, type InterBooleanField } from './InterBooleanField';

export interface BooleanFieldViewProps extends Required<Pick<InterBooleanField, 'label' | 'checked' | 'readOnly' | 'hasError'>> {
  onCheckedChange: (checked: boolean) => void;
}

export function useBooleanFieldImpl(props: InterBooleanField): BooleanFieldViewProps {
  const { label, checked, readOnly, hasError, onChange } = { ...BOOLEANFIELD_DEFAULTS, ...props };
  return {
    label,
    checked,
    readOnly,
    hasError,
    // A read-only field never reports a change, even if the browser lets the click through.
    onCheckedChange: (next) => {
      if (!readOnly) onChange(next);
    },
  };
}
