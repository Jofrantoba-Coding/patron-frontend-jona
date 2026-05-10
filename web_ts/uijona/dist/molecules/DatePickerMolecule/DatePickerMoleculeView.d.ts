import React from 'react';
interface DatePickerMoleculeViewProps {
    displayValue: string;
    open: boolean;
    viewYear: number;
    viewMonth: number;
    selectedDate: Date | null;
    today: Date;
    min?: Date;
    max?: Date;
    disabled: boolean;
    placeholder: string;
    className?: string;
    panelStyle: React.CSSProperties;
    triggerRef: React.RefObject<HTMLButtonElement>;
    panelRef: React.RefObject<HTMLDivElement>;
    onTriggerClick: () => void;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onSelectDay: (date: Date) => void;
}
export declare const DatePickerMoleculeView: React.FC<DatePickerMoleculeViewProps>;
export {};
