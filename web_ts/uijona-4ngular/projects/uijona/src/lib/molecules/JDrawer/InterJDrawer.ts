export type JDrawerSide = 'left' | 'right' | 'top' | 'bottom';

export type JDrawerSize = 'sm' | 'md' | 'lg' | 'full';

/** Contrato publico de JDrawer. Slot `[jFooter]` para el pie. */
export interface InterJDrawer {
  open: boolean;
  side?: JDrawerSide;
  title?: string;
  description?: string;
  size?: JDrawerSize;
  showCloseButton?: boolean;
}
