export interface ContactMethodData {
  icon: string;
  label: string;
  description: string;
  href: string;
  actionLabel?: string;
  isPrimary?: boolean;
}

/** Contrato publico de JContactMethods. */
export interface InterJContactMethods {
  methods: ContactMethodData[];
}
