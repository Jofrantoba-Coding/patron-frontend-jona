// InterEventsSwitchAtom.ts — Observer: Event Contract for SwitchAtom
// Declares every event SwitchAtom can emit.

export interface InterEventsSwitchAtom {
  /** Fired when the toggle state changes */
  onCheckedChange?: (checked: boolean) => void;

  /** Fired when the switch receives focus */
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;

  /** Fired when the switch loses focus */
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
}
