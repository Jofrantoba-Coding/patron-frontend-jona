export type JLogoMarqueeSpeed = 'slow' | 'normal' | 'fast';

/** Contrato publico de JLogoMarquee. `items` son etiquetas/logos de texto. */
export interface InterJLogoMarquee {
  items: string[];
  label?: string;
  speed?: JLogoMarqueeSpeed;
  pauseOnHover?: boolean;
}
