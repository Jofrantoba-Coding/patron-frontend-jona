import React from 'react';
import { InterSearchInputMolecule } from './InterSearchInputMolecule';
type SearchInputMoleculeViewProps = Omit<InterSearchInputMolecule, 'onChange' | 'onSearch' | 'onClear' | 'onBlur' | 'onEnterPress'> & {
    inputValue: string;
    forwardedRef?: React.Ref<HTMLInputElement>;
    onInputChange: React.ChangeEventHandler<HTMLInputElement>;
    onInputBlur: React.FocusEventHandler<HTMLInputElement>;
    onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
    onClearClick: React.MouseEventHandler<HTMLButtonElement>;
    onSearchClick: React.MouseEventHandler<HTMLButtonElement>;
};
export declare const SearchInputMoleculeView: React.FC<SearchInputMoleculeViewProps>;
export {};
