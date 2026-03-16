// InterSeparatorAtom.ts — JONA Interface

export type SeparatorOrientation = 'horizontal' | 'vertical';

export interface InterSeparatorAtom {
  orientation?: SeparatorOrientation;
  className?: string;
}
