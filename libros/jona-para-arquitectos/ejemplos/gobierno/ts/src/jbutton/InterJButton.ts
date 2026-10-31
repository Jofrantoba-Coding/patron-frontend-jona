/** Contrato de UI de una unidad solo visual: no tiene contrato de servicio. */
export interface InterJButton {
  texto: string;
  variante?: 'principal' | 'contorno';
  tipo?: 'button' | 'submit';
  deshabilitado?: boolean;
  onClick?: () => void;
}

export const JBUTTON_DEFAULTS = {
  variante: 'principal',
  tipo: 'button',
  deshabilitado: false,
} as const satisfies Required<Pick<InterJButton, 'variante' | 'tipo' | 'deshabilitado'>>;
