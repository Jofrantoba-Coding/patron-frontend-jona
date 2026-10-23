// Layer: Implementation. Guards the edits of a read-only date and hands the inner input to the caller; no state of its own.
import { useLayoutEffect, useRef, type ForwardedRef, type RefObject } from 'react';
import { DATEFIELD_DEFAULTS, type InterDateField } from './InterDateField';

export interface DateFieldViewProps extends Required<Pick<InterDateField, 'name' | 'label' | 'value' | 'readOnly'>> {
  /** The element that wraps the picker; the Impl reaches the picker input through it (jona-ui exposes no ref or error prop). */
  wrapperRef: RefObject<HTMLDivElement>;
  onValueChange: (value: string) => void;
}

/**
 * `JDatePicker` owns the mask, the calendar and the day picking. What it cannot do is reached on its input from here:
 * `aria-invalid` while the field has an error, and the ref a blocked submit focuses.
 */
export function useDateFieldImpl(props: InterDateField, forwardedRef: ForwardedRef<HTMLInputElement>): DateFieldViewProps {
  const { name, label, value, readOnly, hasError, onChange } = { ...DATEFIELD_DEFAULTS, ...props };
  const wrapperRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const input = wrapperRef.current?.querySelector('input') ?? null;
    if (hasError) input?.setAttribute('aria-invalid', 'true');
    else input?.removeAttribute('aria-invalid');
    if (typeof forwardedRef === 'function') forwardedRef(input);
    else if (forwardedRef) forwardedRef.current = input;
    return () => {
      if (typeof forwardedRef === 'function') forwardedRef(null);
      else if (forwardedRef) forwardedRef.current = null;
    };
  });
  return {
    name, label, value, readOnly, wrapperRef,
    // A read-only field never reports a change.
    onValueChange: (next) => {
      if (!readOnly) onChange(next);
    },
  };
}
