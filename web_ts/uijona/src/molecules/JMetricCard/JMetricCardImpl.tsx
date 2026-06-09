// JMetricCardImpl.tsx — JONA Implementation
import React from 'react';
import { InterJMetricCard, JMETRIC_CARD_DEFAULTS } from './InterJMetricCard';
import { JMetricCardView } from './JMetricCardView';

export const JMetricCardImpl: React.FC<InterJMetricCard> = (props) => (
  <JMetricCardView {...JMETRIC_CARD_DEFAULTS} {...props} />
);
