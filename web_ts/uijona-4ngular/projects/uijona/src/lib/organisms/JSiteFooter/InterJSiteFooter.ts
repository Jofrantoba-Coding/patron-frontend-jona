export interface FooterLink {
  label: string;
  href: string;
}

/** Contrato publico de JSiteFooter. */
export interface InterJSiteFooter {
  copyright: string;
  links: FooterLink[];
}
