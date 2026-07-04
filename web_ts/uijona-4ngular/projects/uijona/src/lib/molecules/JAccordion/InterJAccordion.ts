export type JAccordionSize = 'sm' | 'md' | 'lg';

export type JAccordionVariant = 'default' | 'bordered' | 'ghost';

export interface JAccordionItem {
  value: string;
  title: string;
  content: string;
  disabled?: boolean;
  icon?: string;
}

/** Contrato publico de JAccordion. */
export interface InterJAccordion {
  items: JAccordionItem[];
  value?: string | string[];
  multiple?: boolean;
  variant?: JAccordionVariant;
  size?: JAccordionSize;
}
