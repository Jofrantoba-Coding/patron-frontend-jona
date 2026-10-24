// Layer: Implementation. Filters the edits like the Swing document and owns the show / hide switch.
import { useState } from 'react';
import { PASSWORDFIELD_DEFAULTS, type InterPasswordField } from './InterPasswordField';

export interface PasswordFieldViewProps {
  name: string;
  label: string;
  value: string;
  readOnly: boolean;
  hasError: boolean;
  showLabel: string;
  /** True while the characters are readable. */
  shown: boolean;
  confirmLabel?: string;
  confirmValue: string;
  confirmHasError: boolean;
  confirmRef?: (element: HTMLInputElement | null) => void;
  onInputChange: (next: string) => void;
  onConfirmInputChange: (next: string) => void;
  onShownChange: (shown: boolean) => void;
}

/**
 * Typing and paste both arrive as a change whose value is the previous one with the selection replaced, so the length of that value is the length of
 * the accepted edit: one that would pass `maxLength` is ignored whole (S-CRUD-42, S-CRUD-14). The show switch only changes how the same value is drawn.
 */
export function usePasswordFieldImpl(props: InterPasswordField): PasswordFieldViewProps {
  const { name, label, value, maxLength, onChange, onConfirmChange } = props;
  const [shown, setShown] = useState(false);
  // A prop the caller passes as `undefined` takes the default too (a register spreads optional config).
  const readOnly = props.readOnly ?? PASSWORDFIELD_DEFAULTS.readOnly;
  const accept = (report?: (value: string) => void) => (next: string) => {
    if (readOnly || (maxLength !== undefined && next.length > maxLength)) return;
    report?.(next);
  };
  return {
    name, label, value, readOnly, shown,
    hasError: props.hasError ?? PASSWORDFIELD_DEFAULTS.hasError,
    showLabel: props.showLabel ?? PASSWORDFIELD_DEFAULTS.showLabel,
    confirmLabel: props.confirmLabel,
    confirmValue: props.confirmValue ?? '',
    confirmHasError: props.confirmHasError ?? PASSWORDFIELD_DEFAULTS.confirmHasError,
    confirmRef: props.confirmRef,
    onInputChange: accept(onChange),
    onConfirmInputChange: accept(onConfirmChange),
    onShownChange: setShown,
  };
}
