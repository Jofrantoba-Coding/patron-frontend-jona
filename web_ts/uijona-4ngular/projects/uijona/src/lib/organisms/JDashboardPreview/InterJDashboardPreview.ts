export interface DashboardStat {
  label: string;
  value: string;
  delta?: string;
  accent?: boolean;
}

/** Contrato publico de JDashboardPreview. */
export interface InterJDashboardPreview {
  title: string;
  statusLabel?: string;
  stats: DashboardStat[];
  chartLabel?: string;
  chart?: number[];
}
