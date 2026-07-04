export type JSeparatorOrientation = 'horizontal' | 'vertical';

/** Contrato publico de JSeparator. */
export interface InterJSeparator {
  orientation?: JSeparatorOrientation;
}

export const JSEPARATOR_DEFAULTS = {
  orientation: 'horizontal',
} as const satisfies Required<InterJSeparator>;
