import React from 'react';
export interface InterDetailHeroOrganism {
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
export declare const DETAIL_HERO_ORGANISM_DEFAULTS: Partial<InterDetailHeroOrganism>;
