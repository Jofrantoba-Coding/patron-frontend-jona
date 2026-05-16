import React from 'react';
import { InterSelectAtom } from './InterSelectAtom';
interface SelectAtomViewProps {
    options?: InterSelectAtom['options'];
    groups?: InterSelectAtom['groups'];
    placeholder?: string;
    hasError?: boolean;
    className?: string;
    forwardedRef?: React.Ref<HTMLSelectElement>;
    value?: string;
    id?: string;
    required?: boolean;
    disabled?: boolean;
    'aria-describedby'?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}
export declare const SelectAtomView: React.FC<SelectAtomViewProps>;
export {};
