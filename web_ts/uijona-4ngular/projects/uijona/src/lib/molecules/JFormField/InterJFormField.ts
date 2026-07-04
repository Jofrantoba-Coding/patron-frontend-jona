export type JFormFieldOrientation = 'vertical' | 'horizontal';

/** Contrato publico de JFormField. */
export interface InterJFormField {
  id: string;
  label: string;
  errorMessage?: string;
  description?: string;
  orientation?: JFormFieldOrientation;
  required?: boolean;
  placeholder?: string;
  type?: string;
  value?: string;
}

export const JFORMFIELD_DEFAULTS = {
  orientation: 'vertical',
} as const satisfies Required<Pick<InterJFormField, 'orientation'>>;
