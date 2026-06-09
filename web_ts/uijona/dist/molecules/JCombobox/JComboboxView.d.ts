import React from 'react';
import { JComboboxOption } from './InterJCombobox';
interface JComboboxViewProps {
    selected: JComboboxOption | null;
    query: string;
    filtered: JComboboxOption[];
    open: boolean;
    disabled: boolean;
    placeholder: string;
    searchPlaceholder: string;
    emptyText: string;
    className?: string;
    listStyle: React.CSSProperties;
    triggerRef: React.RefObject<HTMLButtonElement>;
    inputRef: React.RefObject<HTMLInputElement>;
    listRef: React.RefObject<HTMLDivElement>;
    activeIndex: number;
    onTriggerClick: () => void;
    onQueryChange: (q: string) => void;
    onSelect: (opt: JComboboxOption) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
}
export declare const JComboboxView: React.FC<JComboboxViewProps>;
export {};
