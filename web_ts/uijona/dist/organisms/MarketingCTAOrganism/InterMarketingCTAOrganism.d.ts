export interface InterMarketingCTAOrganism {
    heading: string;
    description?: string;
    primaryLabel: string;
    primaryHref?: string;
    onPrimaryClick?: () => void;
    secondaryLabel?: string;
    secondaryHref?: string;
    onSecondaryClick?: () => void;
    className?: string;
}
export declare const MARKETING_CTA_ORGANISM_DEFAULTS: Partial<InterMarketingCTAOrganism>;
