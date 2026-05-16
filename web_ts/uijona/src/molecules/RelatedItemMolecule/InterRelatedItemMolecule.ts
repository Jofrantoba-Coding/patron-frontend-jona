// InterRelatedItemMolecule.ts — JONA Interface

export interface InterRelatedItemMolecule {
  name: string;
  outcome: string;
  href: string;
  linkLabel?: string;
  className?: string;
}

export const RELATED_ITEM_MOLECULE_DEFAULTS: Partial<InterRelatedItemMolecule> = {
  linkLabel: 'Ver más →',
};
