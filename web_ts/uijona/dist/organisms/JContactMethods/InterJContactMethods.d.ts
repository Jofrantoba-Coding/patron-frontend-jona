export interface ContactMethodData {
    icon: string;
    label: string;
    description: string;
    href: string;
    actionLabel?: string;
    isPrimary?: boolean;
}
export interface InterJContactMethods {
    methods: ContactMethodData[];
    as?: 'section' | 'div';
    className?: string;
}
export declare const JCONTACT_METHODS_DEFAULTS: Partial<InterJContactMethods>;
