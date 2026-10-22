// Layer: public entry. Wires the Impl hook to the pure View.
import { forwardRef } from 'react';
import type { InterNumberField } from './InterNumberField';
import { useNumberFieldImpl } from './NumberFieldImpl';
import { NumberFieldView } from './NumberFieldView';

/** Digits-only input over an integer catalog field, or a decimal one with `scale` > 0 (G4); the value stays a string until the codec. */
export const NumberField = forwardRef<HTMLInputElement, InterNumberField>((props, ref) => (
  <NumberFieldView ref={ref} {...useNumberFieldImpl(props)} />
));
NumberField.displayName = 'NumberField';
