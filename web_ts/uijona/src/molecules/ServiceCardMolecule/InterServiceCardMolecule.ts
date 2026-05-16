// InterServiceCardMolecule.ts — JONA Interface

export interface InterServiceCardMolecule {
  icon?: string;
  title: string;
  description: string;
  proof?: string;
  href?: string;
  className?: string;
}

export const SERVICE_CARD_MOLECULE_DEFAULTS: Partial<InterServiceCardMolecule> = {};
