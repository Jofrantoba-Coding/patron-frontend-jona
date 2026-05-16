// InterMetricCardMolecule.ts — JONA Interface
import React from 'react';

export type MetricCardTone = 'light' | 'dark';

export interface InterMetricCardMolecule extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  label: string;
  tone?: MetricCardTone;
}

export const METRIC_CARD_MOLECULE_DEFAULTS: Required<Pick<InterMetricCardMolecule, 'tone'>> = {
  tone: 'dark',
};
