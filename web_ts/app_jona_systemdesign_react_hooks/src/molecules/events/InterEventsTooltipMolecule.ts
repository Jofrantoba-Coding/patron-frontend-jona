// InterEventsTooltipMolecule.ts — Observer: Event Contract for TooltipMolecule
// Declares every event TooltipMolecule can emit.

export interface InterEventsTooltipMolecule {
  /** Fired when the tooltip becomes visible */
  onShow?: () => void;

  /** Fired when the tooltip is hidden */
  onHide?: () => void;
}
