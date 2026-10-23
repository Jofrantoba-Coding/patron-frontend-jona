// Layer: public entry. Wires the Impl hook to the pure View.
import { forwardRef } from 'react';
import type { InterOptionsField } from './InterOptionsField';
import { useOptionsFieldImpl } from './OptionsFieldImpl';
import { OptionsFieldView } from './OptionsFieldView';

/** A fixed list of coded options as a select or a radio group (G7); the payload carries the code. */
export const OptionsField = forwardRef<HTMLElement, InterOptionsField>((props, ref) => (
  <OptionsFieldView ref={ref} {...useOptionsFieldImpl(props)} />
));
OptionsField.displayName = 'OptionsField';
