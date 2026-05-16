import { default as React } from '../../../node_modules/react';
import { ComboboxOption } from './InterComboboxMolecule';

interface ComboboxMoleculeViewProps {
    selected: ComboboxOption | null;
    query: string;
    filtered: ComboboxOption[];
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
    onSelect: (opt: ComboboxOption) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
}
export declare const ComboboxMoleculeView: React.FC<ComboboxMoleculeViewProps>;
export {};
