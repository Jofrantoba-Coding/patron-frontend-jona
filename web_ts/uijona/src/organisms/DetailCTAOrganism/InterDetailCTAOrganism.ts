// InterDetailCTAOrganism.ts — JONA Interface

export interface InterDetailCTAOrganism {
  title: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  as?: 'section' | 'div';
  className?: string;
}

export const DETAIL_CTA_ORGANISM_DEFAULTS: Partial<InterDetailCTAOrganism> = {
  as: 'section',
};
