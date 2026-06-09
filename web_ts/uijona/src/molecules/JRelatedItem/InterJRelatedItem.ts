// InterJRelatedItem.ts — JONA Interface

export interface InterJRelatedItem {
  name: string;
  outcome: string;
  href: string;
  linkLabel?: string;
  className?: string;
}

export const JRELATED_ITEM_DEFAULTS: Partial<InterJRelatedItem> = {
  linkLabel: 'Ver más →',
};
