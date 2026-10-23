// Layer: public entry. Wires the Impl hook to the pure View.
import { forwardRef } from 'react';
import { useDateFieldImpl } from './DateFieldImpl';
import { DateFieldView } from './DateFieldView';
import type { InterDateField } from './InterDateField';

/** A masked `dd/MM/yyyy` date with a calendar over jona-ui `JDatePicker` (G5); the value stays text until the codec makes it ISO. */
export const DateField = forwardRef<HTMLInputElement, InterDateField>((props, ref) => <DateFieldView {...useDateFieldImpl(props, ref)} />);
DateField.displayName = 'DateField';
