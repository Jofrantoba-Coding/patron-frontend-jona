// Layer: public entry. Wires the Impl hook to the pure View.
import { forwardRef } from 'react';
import type { InterNumberField } from './InterNumberField';
import { useNumberFieldImpl } from './NumberFieldImpl';
import { NumberFieldView } from './NumberFieldView';

/** Digits-only input over an integer catalog field (G4, scale 0); the value stays a string until the codec. */
export const NumberField = forwardRef<HTMLInputElement, InterNumberField>((props, ref) => (
  <NumberFieldView ref={ref} {...useNumberFieldImpl(props)} />
));
NumberField.displayName = 'NumberField';
