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
export declare const JDATEPICKER_DEFAULTS: Required<Pick<InterJDatePicker, 'placeholder' | 'disabled' | 'mask' | 'autoApplyMask' | 'showTime' | 'showSeconds' | 'valueFormat'>>;
