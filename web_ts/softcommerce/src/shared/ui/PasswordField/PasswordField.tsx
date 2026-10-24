// Layer: public entry. Wires the Impl hook to the pure View.
import { forwardRef } from 'react';
import type { InterPasswordField } from './InterPasswordField';
import { usePasswordFieldImpl } from './PasswordFieldImpl';
import { PasswordFieldView } from './PasswordFieldView';

/** Masked input over a `password` catalog field (R-CRUD-17): the max of S-CRUD-14, the `Mostrar caracteres` switch and the optional confirmation. */
export const PasswordField = forwardRef<HTMLInputElement, InterPasswordField>((props, ref) => (
  <PasswordFieldView ref={ref} {...usePasswordFieldImpl(props)} />
));
PasswordField.displayName = 'PasswordField';
