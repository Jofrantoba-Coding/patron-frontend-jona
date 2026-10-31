// InterJErrorSummary.ts — JONA Interface

export interface JErrorSummaryItem {
  /** Field key handed back by `onSelect`, so the host can focus the field. */
  field: string;
  label: string;
  message: string;
}

export interface InterJErrorSummary {
  title?: string;
  /** Errors in display order; an empty list renders nothing. */
  errors: JErrorSummaryItem[];
  /** Observer event — value-first: the field of the activated entry. */
  onSelect?: (field: string) => void;
}

export const JERRORSUMMARY_DEFAULTS = {
  title: 'Revise los campos marcados',
} as const satisfies Required<Pick<InterJErrorSummary, 'title'>>;
