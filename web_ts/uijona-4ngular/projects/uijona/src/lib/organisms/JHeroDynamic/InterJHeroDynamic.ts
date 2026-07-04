export interface HeroDynamicCTA {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
}

/** Contrato publico de JHeroDynamic. Slot `[jVisual]`. */
export interface InterJHeroDynamic {
  eyebrow?: string;
  titlePrefix: string;
  rotatingWords: string[];
  subtitle?: string;
  ctas?: HeroDynamicCTA[];
  intervalMs?: number;
}
