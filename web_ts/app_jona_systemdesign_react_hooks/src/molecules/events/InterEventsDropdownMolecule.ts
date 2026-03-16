// InterEventsDropdownMolecule.ts — Observer: Event Contract for DropdownMolecule
// Declares every event DropdownMolecule can emit.

export interface InterEventsDropdownMolecule {
  /** Fired when the dropdown menu opens */
  onOpen?: () => void;

  /** Fired when the dropdown menu closes */
  onClose?: () => void;

  /** Fired when a menu item is selected — carries the item label */
  onItemSelect?: (label: string) => void;

  /** Fired when a disabled item is clicked */
  onDisabledItemClick?: (label: string) => void;
}
