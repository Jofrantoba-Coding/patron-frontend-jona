// Layer: public entry. Wires the Impl hook to the pure View.
import { forwardRef } from 'react';
import type { InterLookupField } from './InterLookupField';
import { useLookupFieldImpl } from './LookupFieldImpl';
import { LookupFieldView } from './LookupFieldView';

/** A code box, its read-only description, a search button and a clear button over a lookup dialog (R-CRUD-19); the payload carries the id. */
export const LookupField = forwardRef<HTMLInputElement, InterLookupField>((props, ref) => <LookupFieldView ref={ref} {...useLookupFieldImpl(props)} />);
LookupField.displayName = 'LookupField';
