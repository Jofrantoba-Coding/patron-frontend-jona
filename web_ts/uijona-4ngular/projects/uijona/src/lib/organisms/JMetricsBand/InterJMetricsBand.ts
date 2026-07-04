export interface MetricItem {
  value: string;
  label: string;
}

/** Contrato publico de JMetricsBand. */
export interface InterJMetricsBand {
  metrics: MetricItem[];
}
