// InterJMarketingHero.ts — JONA Interface
import React from 'react';

export interface MarketingHeroCTA {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
}

export interface InterJMarketingHero extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctas?: MarketingHeroCTA[];
  visual?: React.ReactNode;
  metrics?: React.ReactNode;
}

export const JMARKETING_HERO_DEFAULTS: Partial<InterJMarketingHero> = {};
