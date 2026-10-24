// Layer: public entry. Wires the Impl hook to the pure View.
import { forwardRef } from 'react';
import type { InterTextAreaField } from './InterTextAreaField';
import { useTextAreaFieldImpl } from './TextAreaFieldImpl';
import { TextAreaFieldView } from './TextAreaFieldView';

/** Multi-line text over a `textarea` catalog field (R-CRUD-18): the max of S-CRUD-14, `upper` as typed, Enter is a line break. */
export const TextAreaField = forwardRef<HTMLTextAreaElement, InterTextAreaField>((props, ref) => (
  <TextAreaFieldView ref={ref} {...useTextAreaFieldImpl(props)} />
));
TextAreaField.displayName = 'TextAreaField';
