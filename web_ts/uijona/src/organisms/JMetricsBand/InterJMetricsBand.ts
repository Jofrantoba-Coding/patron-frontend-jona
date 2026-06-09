// InterJMetricsBand.ts — JONA Interface

export interface MetricItem {
  value: string;
  label: string;
}

export interface InterJMetricsBand {
  metrics: MetricItem[];
  as?: 'section' | 'div';
  id?: string;
  className?: string;
}

export const JMETRICS_BAND_DEFAULTS: Partial<InterJMetricsBand> = {
  as: 'section',
};
