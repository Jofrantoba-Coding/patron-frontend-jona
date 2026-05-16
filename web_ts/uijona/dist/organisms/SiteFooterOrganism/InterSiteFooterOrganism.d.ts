export interface FooterLink {
    label: string;
    href: string;
}
export interface InterSiteFooterOrganism {
    copyright: string;
    links: FooterLink[];
    className?: string;
}
export declare const SITE_FOOTER_ORGANISM_DEFAULTS: Partial<InterSiteFooterOrganism>;
