// Layer: Interface. Public contract of login step 2: shapes and defaults only, no logic.

export interface SelectOption {
  value: string;
  label: string;
}

export interface InterUiContexto {
  title?: string;
  submitLabel?: string;
  empresaOptions: SelectOption[];
  puntoVentaOptions: SelectOption[];
  empresaId: string;
  puntoVentaId: string;
  /** ISO `yyyy-MM-dd`. */
  fechaInicio: string;
  fechaFin: string;
  empresaError?: string;
  puntoVentaError?: string;
  /** One message for whichever period rule failed. */
  periodError?: string;
  submitError?: string;
  submitErrorTraceId?: string;
  isLoading?: boolean;
  isSubmitting?: boolean;
  /** Callbacks are value-first: the business value, no DOM event. */
  onEmpresaChange?: (idEmpresa: string) => void;
  onPuntoVentaChange?: (idPuntoVenta: string) => void;
  onFechaInicioChange?: (fechaInicio: string) => void;
  onFechaFinChange?: (fechaFin: string) => void;
  onSubmit?: () => void;
}

/** Presentation defaults only; selections, dates and flags are state and never defaulted. */
export const UICONTEXTO_DEFAULTS: Required<Pick<InterUiContexto, 'title' | 'submitLabel'>> = {
  title: 'Contexto de trabajo',
  submitLabel: 'Confirmar',
};
