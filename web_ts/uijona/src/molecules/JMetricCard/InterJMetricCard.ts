// InterJMetricCard.ts — JONA Interface

export interface InterJMetricCard {
  value: string;
  label: string;
  className?: string;
}

export const JMETRIC_CARD_DEFAULTS: Partial<InterJMetricCard> = {};
