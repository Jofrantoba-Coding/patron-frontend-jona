import React from 'react';
interface JDatePickerTimeParts {
    hour: number;
    minute: number;
    second: number;
    timezone?: string;
}
export interface JDatePickerViewProps {
    inputValue: string;
    open: boolean;
    viewYear: number;
    viewMonth: number;
    selectedDate: Date | null;
    today: Date;
    min?: Date;
    max?: Date;
    disabled: boolean;
    placeholder: string;
    mask: string;
    showTime: boolean;
    showSeconds: boolean;
    showTimezone: boolean;
    timezoneOptions?: string[];
    timeParts: JDatePickerTimeParts;
    className?: string;
    panelStyle: React.CSSProperties;
    triggerRef: React.RefObject<HTMLDivElement>;
    panelRef: React.RefObject<HTMLDivElement>;
    inputRef: React.RefObject<HTMLInputElement>;
    onInputChange: (value: string) => void;
    onTriggerClick: () => void;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onSelectDay: (date: Date) => void;
    onTimeChange: (part: 'hour' | 'minute' | 'second', value: string) => void;
    onTimezoneChange: (value: string) => void;
}
export declare const JDatePickerView: React.FC<JDatePickerViewProps>;
export {};
