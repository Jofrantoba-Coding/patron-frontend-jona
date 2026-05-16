// InterMetricsBandOrganism.ts — JONA Interface

export interface MetricItem {
  value: string;
  label: string;
}

export interface InterMetricsBandOrganism {
  metrics: MetricItem[];
  as?: 'section' | 'div';
  id?: string;
  className?: string;
}

export const METRICS_BAND_ORGANISM_DEFAULTS: Partial<InterMetricsBandOrganism> = {
  as: 'section',
};
