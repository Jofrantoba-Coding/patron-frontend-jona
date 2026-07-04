/** Contrato publico de JContactMethodCard. */
export interface InterJContactMethodCard {
  icon: string;
  label: string;
  description: string;
  href: string;
  actionLabel?: string;
  isPrimary?: boolean;
}
