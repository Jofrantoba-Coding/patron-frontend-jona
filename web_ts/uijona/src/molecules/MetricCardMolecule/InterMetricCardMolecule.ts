// InterMetricCardMolecule.ts — JONA Interface

export interface InterMetricCardMolecule {
  value: string;
  label: string;
  className?: string;
}

export const METRIC_CARD_MOLECULE_DEFAULTS: Partial<InterMetricCardMolecule> = {};
