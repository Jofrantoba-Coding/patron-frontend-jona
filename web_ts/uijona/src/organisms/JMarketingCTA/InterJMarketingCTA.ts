// InterJMarketingCTA.ts — JONA Interface

export interface InterJMarketingCTA {
  heading: string;
  description?: string;
  primaryLabel: string;
  primaryHref?: string;
  onPrimaryClick?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
  onSecondaryClick?: () => void;
  className?: string;
}

export const JMARKETING_CTA_DEFAULTS: Partial<InterJMarketingCTA> = {};
