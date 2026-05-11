import type { CSSProperties } from 'react';
import type {
  PanelAlign,
  PanelGap,
  PanelJustify,
} from '../atoms/PanelAtom/PanelAtom';

export type LayoutPlacement = 'responsive' | 'fixed';

export type LayoutCssVars = CSSProperties & Record<`--${string}`, string | number | undefined>;

export const layoutGapClasses: Record<PanelGap, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

export const layoutAlignClasses: Record<PanelAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

export const layoutJustifyClasses: Record<PanelJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export const resolveGridTemplate = (value: number | string | undefined): string | undefined => {
  if (typeof value === 'number') return `repeat(${value}, minmax(0, 1fr))`;
  return value;
};

export const toCssValue = (value: number | string | undefined): string | undefined => {
  if (value === undefined) return undefined;
  return String(value);
};
