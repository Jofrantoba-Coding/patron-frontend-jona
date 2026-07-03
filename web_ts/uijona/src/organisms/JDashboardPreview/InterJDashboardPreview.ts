// InterJDashboardPreview.ts — JONA Interface

export interface DashboardStat {
  label: string;
  value: string;
  /** Delta/tendencia, p.ej. "↑ 0.2%". */
  delta?: string;
  /** Resalta la tarjeta con el color primario. */
  accent?: boolean;
}

export interface InterJDashboardPreview {
  title: string;
  statusLabel?: string;
  stats: DashboardStat[];
  chartLabel?: string;
  /** Alturas de barra 0–100. */
  chart?: number[];
  className?: string;
}

export const JDASHBOARD_PREVIEW_DEFAULTS: Partial<InterJDashboardPreview> = {
  chart: [48, 74, 58, 88, 66, 52, 80],
};
