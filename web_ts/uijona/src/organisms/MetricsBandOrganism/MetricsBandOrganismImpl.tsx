// MetricsBandOrganismImpl.tsx — JONA Implementation
import React from 'react';
import { InterMetricsBandOrganism, METRICS_BAND_ORGANISM_DEFAULTS } from './InterMetricsBandOrganism';
import { MetricsBandOrganismView } from './MetricsBandOrganismView';

export const MetricsBandOrganismImpl: React.FC<InterMetricsBandOrganism> = (props) => (
  <MetricsBandOrganismView {...METRICS_BAND_ORGANISM_DEFAULTS} {...props} />
);
