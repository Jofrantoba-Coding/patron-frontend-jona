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
export declare const DETAIL_CTA_ORGANISM_DEFAULTS: Partial<InterDetailCTAOrganism>;
