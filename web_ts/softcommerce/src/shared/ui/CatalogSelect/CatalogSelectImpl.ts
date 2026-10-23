// Layer: Implementation. Resolves the defaults and guards the read-only state; no state of its own.
import { CATALOGSELECT_DEFAULTS, type InterCatalogSelect } from './InterCatalogSelect';

export type CatalogSelectViewProps = Required<Omit<InterCatalogSelect, 'onChange'>> & { onValueChange: (value: string) => void };

export function useCatalogSelectImpl(props: InterCatalogSelect): CatalogSelectViewProps {
  const { name, label, options, value, readOnly, hasError, placeholder, onChange } = { ...CATALOGSELECT_DEFAULTS, ...props };
  return {
    name, label, options, value, readOnly, hasError, placeholder,
    // A read-only field never reports a change, even if the browser lets the event through.
    onValueChange: (next) => {
      if (!readOnly) onChange(next);
    },
  };
}
