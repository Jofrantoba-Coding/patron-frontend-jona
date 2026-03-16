import React from 'react';
export interface InterEventsInputAtom {
    onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (value: string, event: React.FocusEvent<HTMLInputElement>) => void;
    onEnterPress?: (value: string, event: React.KeyboardEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onClear?: () => void;
}
