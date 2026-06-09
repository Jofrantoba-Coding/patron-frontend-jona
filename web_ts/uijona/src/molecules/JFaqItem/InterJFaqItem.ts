// InterJFaqItem.ts — JONA Interface

export interface InterJFaqItem {
  question: string;
  answer: string;
  className?: string;
}

export const JFAQ_ITEM_DEFAULTS: Partial<InterJFaqItem> = {};
