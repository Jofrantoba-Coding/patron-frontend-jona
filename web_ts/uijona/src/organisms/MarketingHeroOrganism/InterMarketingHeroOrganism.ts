// InterMarketingHeroOrganism.ts — JONA Interface
import React from 'react';

export interface MarketingHeroCTA {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
}

export interface InterMarketingHeroOrganism extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctas?: MarketingHeroCTA[];
  visual?: React.ReactNode;
  metrics?: React.ReactNode;
}

export const MARKETING_HERO_ORGANISM_DEFAULTS: Partial<InterMarketingHeroOrganism> = {};
