export interface MarketingHeroCTA {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
}

/** Contrato publico de JMarketingHero. Slots `[jVisual]`, `[jMetrics]`. */
export interface InterJMarketingHero {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctas?: MarketingHeroCTA[];
}
