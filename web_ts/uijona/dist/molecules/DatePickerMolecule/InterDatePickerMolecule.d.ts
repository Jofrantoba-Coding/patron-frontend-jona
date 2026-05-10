export type DatePickerMoleculeValueFormat = 'mask' | 'iso';
export interface InterDatePickerMolecule {
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
    valueFormat?: DatePickerMoleculeValueFormat;
    onChange?: (value: string) => void;
}
export declare const DATE_PICKER_MOLECULE_DEFAULTS: Required<Pick<InterDatePickerMolecule, 'placeholder' | 'disabled' | 'mask' | 'autoApplyMask' | 'showTime' | 'showSeconds' | 'valueFormat'>>;
