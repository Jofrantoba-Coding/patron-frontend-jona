import { default as React } from '../../../node_modules/react';

export type StatCardTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type StatCardTrend = 'up' | 'down' | 'flat';
export interface InterStatCardMolecule extends React.HTMLAttributes<HTMLDivElement> {
    label: React.ReactNode;
    value: React.ReactNode;
    description?: React.ReactNode;
    icon?: React.ReactNode;
    tone?: StatCardTone;
    trend?: StatCardTrend;
    trendLabel?: React.ReactNode;
}
export declare const STAT_CARD_MOLECULE_DEFAULTS: Required<Pick<InterStatCardMolecule, 'tone' | 'trend'>>;
