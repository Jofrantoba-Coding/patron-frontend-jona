// InterJContextChip.ts — JONA Interface

export interface JContextChipItem {
  label: string;
  value: string;
}

export interface InterJContextChip {
  /** Read-only context, for example Empresa, PV and Período. */
  items: JContextChipItem[];
}

/** The chip has no optional prop with a default. */
export const JCONTEXTCHIP_DEFAULTS = {} as const;

/** The text the chip shows: the values joined with ` · `. */
export const contextText = (items: JContextChipItem[]): string => items.map((item) => item.value).join(' · ');

/** The accessible description and tooltip: every `label: value` pair. */
export const contextPairs = (items: JContextChipItem[]): string =>
  items.map((item) => `${item.label}: ${item.value}`).join('; ');
