export type JTooltipSide = 'top' | 'bottom' | 'left' | 'right';

/** Contrato publico de JTooltip. El trigger se proyecta como contenido. */
export interface InterJTooltip {
  content: string;
  side?: JTooltipSide;
  delayMs?: number;
}
