import React from 'react';
import { JMultiSelectOption } from './InterJMultiSelect';
interface JMultiSelectViewProps {
    selected: JMultiSelectOption[];
    filtered: JMultiSelectOption[];
    query: string;
    open: boolean;
    disabled: boolean;
    placeholder: string;
    searchPlaceholder: string;
    emptyText: string;
    maxSelected?: number;
    className?: string;
    listStyle: React.CSSProperties;
    triggerRef: React.RefObject<HTMLDivElement>;
    inputRef: React.RefObject<HTMLInputElement>;
    listRef: React.RefObject<HTMLDivElement>;
    onTriggerClick: () => void;
    onQueryChange: (q: string) => void;
    onToggle: (opt: JMultiSelectOption) => void;
    onRemove: (value: string) => void;
    onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
export declare const JMultiSelectView: React.FC<JMultiSelectViewProps>;
export {};
