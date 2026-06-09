// InterJContactMethods.ts — JONA Interface

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

export const JCONTACT_METHODS_DEFAULTS: Partial<InterJContactMethods> = {
  as: 'section',
};
