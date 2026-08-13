export type JAlertVariant = 'default' | 'info' | 'success' | 'warning' | 'danger';

/** Contrato publico de JAlert. El icono se proyecta con [jIcon]. */
export interface InterJAlert {
  variant?: JAlertVariant;
  title?: string;
  dismissible?: boolean;
}

export const JALERT_DEFAULTS = {
  variant: 'default',
  dismissible: false,
} as const satisfies Required<Pick<InterJAlert, 'variant' | 'dismissible'>>;

