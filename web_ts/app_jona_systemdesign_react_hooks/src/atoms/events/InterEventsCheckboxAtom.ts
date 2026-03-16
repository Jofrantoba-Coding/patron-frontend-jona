// InterEventsCheckboxAtom.ts — Observer: Event Contract for CheckboxAtom
// Declares every event CheckboxAtom can emit.

export interface InterEventsCheckboxAtom {
  /** Fired when the checked state changes */
  onCheckedChange?: (checked: boolean) => void;

  /** Fired when the checkbox receives focus */
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;

  /** Fired when the checkbox loses focus */
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
}
