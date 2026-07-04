export type StatCardTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export type StatCardTrend = 'up' | 'down' | 'flat';

/** Contrato publico de JStatCard. El icono se proyecta con [jIcon]. */
export interface InterJStatCard {
  label: string;
  value: string;
  description?: string;
  tone?: StatCardTone;
  trend?: StatCardTrend;
  trendLabel?: string;
  valueFirst?: boolean;
}
