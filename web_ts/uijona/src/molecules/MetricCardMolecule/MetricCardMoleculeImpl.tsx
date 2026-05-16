// MetricCardMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterMetricCardMolecule, METRIC_CARD_MOLECULE_DEFAULTS } from './InterMetricCardMolecule';
import { MetricCardMoleculeView } from './MetricCardMoleculeView';

export const MetricCardMoleculeImpl: React.FC<InterMetricCardMolecule> = (props) => (
  <MetricCardMoleculeView {...METRIC_CARD_MOLECULE_DEFAULTS} {...props} />
);
