import { default as React } from '../../../node_modules/react';
import { MultiSelectOption } from './InterMultiSelectMolecule';

interface MultiSelectMoleculeViewProps {
    selected: MultiSelectOption[];
    filtered: MultiSelectOption[];
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
    onToggle: (opt: MultiSelectOption) => void;
    onRemove: (value: string) => void;
    onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
export declare const MultiSelectMoleculeView: React.FC<MultiSelectMoleculeViewProps>;
export {};
