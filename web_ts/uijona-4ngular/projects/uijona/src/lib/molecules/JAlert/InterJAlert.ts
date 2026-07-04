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

export const JALERT_VARIANT_CLASSES: Record<JAlertVariant, string> = {
  default: 'bg-neutral-50 border-neutral-200 text-neutral-900',
  info: 'bg-primary-50 border-primary-300 text-primary-800',
  success: 'bg-green-50 border-green-300 text-green-800',
  warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
  danger: 'bg-red-50 border-danger-500 text-danger-700',
};

export const JALERT_DISMISS_VARIANT_CLASSES: Record<JAlertVariant, string> = {
  default: 'text-neutral-400 hover:text-neutral-700',
  info: 'text-primary-400 hover:text-primary-700',
  success: 'text-green-400 hover:text-green-700',
  warning: 'text-yellow-500 hover:text-yellow-800',
  danger: 'text-danger-400 hover:text-danger-700',
};
