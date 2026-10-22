// Layer: Interface. Public contract of the cascading select: shapes and defaults only, no logic.
export interface CascadeLevel {
  name: string;
  label: string;
}

export interface CascadeOption {
  id: string;
  name: string;
}

/** What the View renders for one level. */
export interface CascadeLevelState extends CascadeLevel {
  value: string;
  options: CascadeOption[];
  disabled: boolean;
  /** True while the last load of this level's options failed; the View offers a retry. */
  loadFailed: boolean;
  error?: string;
}

export interface InterCascadeSelect {
  levels: CascadeLevelState[];
  /** Value-first: the level name and its new id; lower levels arrive as separate calls with ''. */
  onChange: (name: string, value: string) => void;
  /** Value-first: re-runs the options load of the named level. */
  onRetry: (name: string) => void;
  registerField?: (name: string) => (element: HTMLSelectElement | null) => void;
}

/** Presentation defaults only; values and options are state and never defaulted. */
export const CASCADESELECT_DEFAULTS = {
  placeholder: 'Seleccione',
  loadErrorMessage: 'No se pudieron cargar las opciones.',
  retryLabel: 'Reintentar',
};
