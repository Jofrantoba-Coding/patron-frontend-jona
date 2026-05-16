export interface ContactMethodData {
    icon: string;
    label: string;
    description: string;
    href: string;
    actionLabel?: string;
    isPrimary?: boolean;
}
export interface InterContactMethodsOrganism {
    methods: ContactMethodData[];
    as?: 'section' | 'div';
    className?: string;
}
export declare const CONTACT_METHODS_ORGANISM_DEFAULTS: Partial<InterContactMethodsOrganism>;
