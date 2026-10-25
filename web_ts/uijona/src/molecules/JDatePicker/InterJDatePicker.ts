// InterJDatePicker.ts — JONA Interface
export type JDatePickerValueFormat = 'mask' | 'iso';

export interface InterJDatePicker {
  value?: string;
  min?: string;
  max?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  mask?: string;
  autoApplyMask?: boolean;
  showTime?: boolean;
  showSeconds?: boolean;
  timezone?: string;
  timezoneOptions?: string[];
  /**
   * `iso` reports `yyyy-MM-dd` (plus the time when the mask has one) for a
   * complete valid entry and shows an ISO value through the mask; an
   * incomplete entry is reported as typed.
   */
  valueFormat?: JDatePickerValueFormat;
  /** Id of the text input. With an `id` and no `label`, an external `<label for>` names it. */
  id?: string;
  name?: string;
  /** Visible label of the text input (its accessible name). */
  label?: string;
  /** Error text: sets `aria-invalid` and joins the input description (not a live region). */
  error?: string;
  required?: boolean;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  onChange?: (value: string) => void;
  /** Observer event — value-first: the value in `valueFormat` when the text input loses focus. */
  onBlur?: (value: string) => void;
}

export const JDATEPICKER_DEFAULTS: Required<Pick<InterJDatePicker,
  'placeholder' | 'disabled' | 'mask' | 'autoApplyMask' | 'showTime' | 'showSeconds' | 'valueFormat'
>> = {
  placeholder:   'Seleccionar fecha',
  disabled:      false,
  mask:          'yyyy-MM-dd',
  autoApplyMask: true,
  showTime:      false,
  showSeconds:   false,
  valueFormat:   'mask',
};
