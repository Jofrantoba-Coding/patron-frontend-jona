// InterJServiceCard.ts — JONA Interface

export interface InterJServiceCard {
  icon?: string;
  title: string;
  description: string;
  proof?: string;
  href?: string;
  className?: string;
}

export const JSERVICE_CARD_DEFAULTS: Partial<InterJServiceCard> = {};
