import { CSSProperties } from 'react';
import { PanelAlign, PanelGap, PanelJustify } from '../atoms/PanelAtom/PanelAtom';
export type LayoutPlacement = 'responsive' | 'fixed';
export type LayoutCssVars = CSSProperties & Record<`--${string}`, string | number | undefined>;
export declare const layoutGapClasses: Record<PanelGap, string>;
export declare const layoutAlignClasses: Record<PanelAlign, string>;
export declare const layoutJustifyClasses: Record<PanelJustify, string>;
export declare const resolveGridTemplate: (value: number | string | undefined) => string | undefined;
export declare const toCssValue: (value: number | string | undefined) => string | undefined;
