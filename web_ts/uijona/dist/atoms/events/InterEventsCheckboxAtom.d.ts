export interface InterEventsCheckboxAtom {
    onCheckedChange?: (checked: boolean) => void;
    onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
}
