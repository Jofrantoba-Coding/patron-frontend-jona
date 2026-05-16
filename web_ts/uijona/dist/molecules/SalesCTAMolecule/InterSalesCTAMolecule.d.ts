import React from 'react';
export type SalesCTATone = 'brand' | 'dark' | 'light';
export interface InterSalesCTAMolecule extends React.HTMLAttributes<HTMLDivElement> {
    heading: string;
    description?: string;
    primaryLabel: string;
    primaryHref?: string;
    onPrimaryClick?: () => void;
    secondaryLabel?: string;
    secondaryHref?: string;
    onSecondaryClick?: () => void;
    tone?: SalesCTATone;
}
export declare const SALES_CTA_MOLECULE_DEFAULTS: Required<Pick<InterSalesCTAMolecule, 'tone'>>;
