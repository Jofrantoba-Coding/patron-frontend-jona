import { default as React } from '../../../node_modules/react';

export type PanelVariant = 'default' | 'outlined' | 'elevated' | 'flat' | 'ghost';
export type PanelPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type PanelRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type PanelLayout = 'none' | 'flow' | 'box' | 'grid' | 'border' | 'card' | 'gridbag' | 'group' | 'spring';
export type PanelDirection = 'row' | 'column';
export type PanelWrap = 'nowrap' | 'wrap' | 'reverse';
export type PanelGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type PanelAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type PanelJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type PanelArea = 'top' | 'right' | 'bottom' | 'left' | 'center';
export type PanelLayoutPlacement = 'responsive' | 'fixed';
export type PanelGroupMode = 'sequential' | 'parallel';
export interface InterPanelAtom extends React.HTMLAttributes<HTMLDivElement> {
    variant?: PanelVariant;
    padding?: PanelPadding;
    radius?: PanelRadius;
    /** Renders as a different HTML element while keeping all div semantics. */
    as?: React.ElementType;
    /** Controls how direct children are arranged inside the panel. */
    layout?: PanelLayout;
    /** Direction used by box layout. */
    direction?: PanelDirection;
    /** Space between children in flow, box, grid, border, and card layouts. */
    gap?: PanelGap;
    /** Cross-axis alignment for flex/grid based layouts. */
    alignItems?: PanelAlign;
    /** Main-axis distribution for flex/grid based layouts. */
    justifyContent?: PanelJustify;
    /** Wrapping behavior for flow and box layouts. */
    wrap?: boolean | PanelWrap;
    /** Grid columns as a count or CSS grid-template-columns value. */
    columns?: number | string;
    /** Grid rows as a count or CSS grid-template-rows value. */
    rows?: number | string;
    /** Creates responsive auto-fit columns when layout="grid". */
    autoFitMin?: string;
    /** Applies advanced constraints from the first breakpoint or immediately. */
    placement?: PanelLayoutPlacement;
    /** Enables dense packing for layout="gridbag". */
    dense?: boolean;
    /** Logical grouping mode for layout="group". */
    mode?: PanelGroupMode;
    /** Minimum layout height for layout="spring" when constraints are active. */
    minHeight?: string;
    /** Active child key for layout="card". Matches data-panel-card or React key. */
    activeCard?: string | number;
    /** Area used by a parent PanelAtom when layout="border". */
    'data-panel-area'?: PanelArea;
    /** Card key used by a parent PanelAtom when layout="card". */
    'data-panel-card'?: string | number;
}
export declare const PANEL_ATOM_DEFAULTS: Required<Pick<InterPanelAtom, 'variant' | 'padding' | 'radius' | 'layout' | 'direction' | 'gap' | 'alignItems' | 'justifyContent'>>;
