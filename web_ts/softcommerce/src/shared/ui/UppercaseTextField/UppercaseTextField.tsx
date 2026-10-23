import { JTextBox, type InterJTextBox } from 'jona-ui';
import { forwardRef } from 'react';

export interface UppercaseTextFieldProps extends Omit<InterJTextBox, 'onChange' | 'maxLength'> {
  /** An edit that would leave the value longer than this is ignored whole: no truncation, no error. */
  maxLength?: number;
  uppercase?: boolean;
  /** Applied to every edit before the length check, so characters it drops (letters in a digits field) never count. */
  transform?: (next: string) => string;
  /** Value-first: only accepted values are reported. */
  onChange: (value: string) => void;
}

/**
 * Text input with Swing-like document limits. Typing and paste both arrive as a change whose value is the
 * previous one with the selection replaced, so checking the resulting length is the same as replacing
 * `[selectionStart, selectionEnd)` by hand; a rejected change leaves the controlled value untouched.
 */
export const UppercaseTextField = forwardRef<HTMLInputElement, UppercaseTextFieldProps>(
  ({ maxLength, uppercase, transform, onChange, ...box }, ref) => (
    <JTextBox
      {...box}
      ref={ref}
      onChange={(typed) => {
        const next = transform ? transform(typed) : typed;
        if (maxLength !== undefined && next.length > maxLength) return;
        onChange(uppercase ? next.toUpperCase() : next);
      }}
    />
  ),
);
UppercaseTextField.displayName = 'UppercaseTextField';
