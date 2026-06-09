import React from 'react';

export type StatCardTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type StatCardTrend = 'up' | 'down' | 'flat';

export interface InterJStatCard extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: StatCardTone;
  trend?: StatCardTrend;
  trendLabel?: React.ReactNode;
}

export const JSTAT_CARD_DEFAULTS: Required<Pick<InterJStatCard, 'tone' | 'trend'>> = {
  tone: 'neutral',
  trend: 'flat',
};
