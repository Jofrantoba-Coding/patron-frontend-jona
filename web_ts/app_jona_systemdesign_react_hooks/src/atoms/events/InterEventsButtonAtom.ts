// InterEventsButtonAtom.ts — Observer: Event Contract for ButtonAtom
// Declares every event ButtonAtom can emit.
// Consumers (Organisms/Molecules) implement these handlers.
import React from 'react';

export interface InterEventsButtonAtom {
  /** Fired when the button is clicked (not disabled, not loading) */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /** Fired when the button receives keyboard focus */
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;

  /** Fired when the button loses keyboard focus */
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;

  /** Fired on keydown while button is focused (e.g. Enter/Space) */
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}
