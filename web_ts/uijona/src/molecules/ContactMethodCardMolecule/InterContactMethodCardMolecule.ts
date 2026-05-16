// InterContactMethodCardMolecule.ts — JONA Interface

export interface InterContactMethodCardMolecule {
  icon: string;
  label: string;
  description: string;
  href: string;
  actionLabel?: string;
  isPrimary?: boolean;
  className?: string;
}

export const CONTACT_METHOD_CARD_MOLECULE_DEFAULTS: Partial<InterContactMethodCardMolecule> = {
  isPrimary: false,
};
