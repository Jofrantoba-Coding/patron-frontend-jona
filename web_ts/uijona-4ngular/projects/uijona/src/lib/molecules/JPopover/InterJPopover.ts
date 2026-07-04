export type JPopoverAlign = 'start' | 'center' | 'end';

export type JPopoverSide = 'top' | 'bottom' | 'left' | 'right';

/** Contrato publico de JPopover. Slot `[jTrigger]` = disparador, default = contenido. */
export interface InterJPopover {
  align?: JPopoverAlign;
  side?: JPopoverSide;
}
