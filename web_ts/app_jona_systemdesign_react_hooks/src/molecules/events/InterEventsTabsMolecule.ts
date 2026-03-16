// InterEventsTabsMolecule.ts — Observer: Event Contract for TabsMolecule
// Declares every event TabsMolecule can emit.

export interface InterEventsTabsMolecule {
  /** Fired when the active tab changes — carries the new tab value */
  onChange?: (value: string) => void;

  /** Fired when a tab trigger receives focus */
  onTabFocus?: (value: string) => void;

  /** Fired when a disabled tab is clicked (useful for analytics/UX hints) */
  onDisabledTabClick?: (value: string) => void;
}
