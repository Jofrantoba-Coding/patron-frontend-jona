// JMetricsBandImpl.tsx — JONA Implementation
import React from 'react';
import { InterJMetricsBand, JMETRICS_BAND_DEFAULTS } from './InterJMetricsBand';
import { JMetricsBandView } from './JMetricsBandView';

export const JMetricsBandImpl: React.FC<InterJMetricsBand> = (props) => (
  <JMetricsBandView {...JMETRICS_BAND_DEFAULTS} {...props} />
);
