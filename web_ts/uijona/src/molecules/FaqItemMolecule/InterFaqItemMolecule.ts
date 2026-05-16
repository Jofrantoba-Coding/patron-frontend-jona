// InterFaqItemMolecule.ts — JONA Interface

export interface InterFaqItemMolecule {
  question: string;
  answer: string;
  className?: string;
}

export const FAQ_ITEM_MOLECULE_DEFAULTS: Partial<InterFaqItemMolecule> = {};
