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
  valueFormat?: JDatePickerValueFormat;
  onChange?: (value: string) => void;
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
