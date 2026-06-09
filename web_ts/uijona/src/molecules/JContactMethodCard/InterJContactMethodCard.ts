// InterJContactMethodCard.ts — JONA Interface

export interface InterJContactMethodCard {
  icon: string;
  label: string;
  description: string;
  href: string;
  actionLabel?: string;
  isPrimary?: boolean;
  className?: string;
}

export const JCONTACT_METHOD_CARD_DEFAULTS: Partial<InterJContactMethodCard> = {
  isPrimary: false,
};
