// InterSiteFooterOrganism.ts — JONA Interface

export interface FooterLink {
  label: string;
  href: string;
}

export interface InterSiteFooterOrganism {
  copyright: string;
  links: FooterLink[];
  className?: string;
}

export const SITE_FOOTER_ORGANISM_DEFAULTS: Partial<InterSiteFooterOrganism> = {};
