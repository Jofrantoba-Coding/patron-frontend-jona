import { default as React } from '../../../node_modules/react';

interface DatePickerTimeParts {
    hour: number;
    minute: number;
    second: number;
    timezone?: string;
}
interface DatePickerMoleculeViewProps {
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
    timeParts: DatePickerTimeParts;
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
export declare const DatePickerMoleculeView: React.FC<DatePickerMoleculeViewProps>;
export {};
