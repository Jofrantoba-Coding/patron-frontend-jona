// Layer: Interface. Public contract of the demo stub form: shapes and defaults only, no logic.

export interface InterUiDemoStub {
  filterLabel?: string;
  filter: string;
  /** Names of the permission flags granted to this form. */
  grantedActions: string[];
  /** Callbacks are value-first: the business value, no DOM event. */
  onFilterChange?: (filter: string) => void;
}

/** Presentation defaults only; the filter text is state and never defaulted. */
export const UIDEMOSTUB_DEFAULTS: Required<Pick<InterUiDemoStub, 'filterLabel'>> = {
  filterLabel: 'Filtro',
};
