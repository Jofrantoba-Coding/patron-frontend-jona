// InterJDetailHero.ts — JONA Interface
import React from 'react';

export interface InterJDetailHero {
  backHref: string;
  backLabel: string;
  eyebrow?: React.ReactNode;
  title: string;
  outcome: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  visual?: React.ReactNode;
  className?: string;
}

export const JDETAIL_HERO_DEFAULTS: Partial<InterJDetailHero> = {};
