// InterJDetailCTA.ts — JONA Interface

export interface InterJDetailCTA {
  title: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  as?: 'section' | 'div';
  className?: string;
}

export const JDETAIL_CTA_DEFAULTS: Partial<InterJDetailCTA> = {
  as: 'section',
};
