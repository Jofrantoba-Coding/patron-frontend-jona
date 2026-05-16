// InterMarketingHeroMolecule.ts — JONA Interface
import React from 'react';

export interface MarketingHeroCTA {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
}

export interface InterMarketingHeroMolecule extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctas?: MarketingHeroCTA[];
  visual?: React.ReactNode;
  metrics?: React.ReactNode;
}

export const MARKETING_HERO_MOLECULE_DEFAULTS: Partial<InterMarketingHeroMolecule> = {};
