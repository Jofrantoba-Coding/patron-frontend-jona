// InterJSiteFooter.ts — JONA Interface

export interface FooterLink {
  label: string;
  href: string;
}

export interface InterJSiteFooter {
  copyright: string;
  links: FooterLink[];
  className?: string;
}

export const JSITE_FOOTER_DEFAULTS: Partial<InterJSiteFooter> = {};
