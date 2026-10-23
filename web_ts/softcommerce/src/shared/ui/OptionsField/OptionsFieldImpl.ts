// Layer: Implementation. Resolves the defaults and guards the read-only state; no state of its own.
import { OPTIONSFIELD_DEFAULTS, type InterOptionsField } from './InterOptionsField';

export type OptionsFieldViewProps = Required<Omit<InterOptionsField, 'onChange'>> & { onValueChange: (value: string) => void };

export function useOptionsFieldImpl(props: InterOptionsField): OptionsFieldViewProps {
  const { name, label, options, display, value, readOnly, hasError, placeholder, onChange } = { ...OPTIONSFIELD_DEFAULTS, ...props };
  return {
    name, label, options, display, value, readOnly, hasError, placeholder,
    // A read-only field never reports a change, even if the browser lets the click through.
    onValueChange: (next) => {
      if (!readOnly) onChange(next);
    },
  };
}
