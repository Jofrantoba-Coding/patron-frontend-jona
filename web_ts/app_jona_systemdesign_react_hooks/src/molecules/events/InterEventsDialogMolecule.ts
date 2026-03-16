// InterEventsDialogMolecule.ts — Observer: Event Contract for DialogMolecule
// Declares every event DialogMolecule can emit.

export interface InterEventsDialogMolecule {
  /** Fired when the dialog requests to close
   *  (ESC key, backdrop click, or close button) */
  onClose?: () => void;

  /** Fired after the dialog finishes its open animation */
  onOpened?: () => void;

  /** Fired after the dialog finishes its close animation */
  onClosed?: () => void;

  /** Fired when the primary action (confirm/submit) is triggered */
  onConfirm?: () => void;

  /** Fired when the secondary action (cancel) is triggered */
  onCancel?: () => void;
}
