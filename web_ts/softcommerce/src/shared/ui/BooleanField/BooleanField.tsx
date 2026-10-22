// Layer: public entry. Wires the Impl hook to the pure View.
import { forwardRef } from 'react';
import { useBooleanFieldImpl } from './BooleanFieldImpl';
import { BooleanFieldView } from './BooleanFieldView';
import type { InterBooleanField } from './InterBooleanField';

/** Checkbox over a boolean catalog field (G3); the payload carries a boolean, never a string. */
export const BooleanField = forwardRef<HTMLInputElement, InterBooleanField>((props, ref) => (
  <BooleanFieldView ref={ref} {...useBooleanFieldImpl(props)} />
));
BooleanField.displayName = 'BooleanField';
