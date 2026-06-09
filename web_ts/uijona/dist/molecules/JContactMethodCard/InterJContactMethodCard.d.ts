export interface InterJContactMethodCard {
    icon: string;
    label: string;
    description: string;
    href: string;
    actionLabel?: string;
    isPrimary?: boolean;
    className?: string;
}
export declare const JCONTACT_METHOD_CARD_DEFAULTS: Partial<InterJContactMethodCard>;
