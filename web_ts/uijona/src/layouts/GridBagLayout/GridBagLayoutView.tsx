import React from 'react';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { cn } from '../../lib/cn';
import {
  layoutAlignClasses,
  layoutGapClasses,
  layoutJustifyClasses,
  resolveGridTemplate,
  toCssValue,
  type LayoutCssVars,
} from '../layoutPrimitives';
import type { InterGridBagLayout } from './InterGridBagLayout';

type GridBagChildProps = {
  style?: React.CSSProperties;
  'data-gridbag-column'?: number | string;
  'data-gridbag-col'?: number | string;
  'data-gridbag-row'?: number | string;
  'data-gridbag-column-span'?: number | string;
  'data-gridbag-colspan'?: number | string;
  'data-gridbag-row-span'?: number | string;
  'data-gridbag-rowspan'?: number | string;
  'data-gridbag-align'?: string;
  'data-gridbag-justify'?: string;
};

const getGridBagColumn = (props: GridBagChildProps): string | undefined =>
  toCssValue(props['data-gridbag-column'] ?? props['data-gridbag-col']);

const getGridBagColumnSpan = (props: GridBagChildProps): string | undefined =>
  toCssValue(props['data-gridbag-column-span'] ?? props['data-gridbag-colspan']);

const getGridBagRowSpan = (props: GridBagChildProps): string | undefined =>
  toCssValue(props['data-gridbag-row-span'] ?? props['data-gridbag-rowspan']);

const prepareGridBagChildren = (children: React.ReactNode): React.ReactNode =>
  React.Children.map(children, (child) => {
    if (!React.isValidElement<GridBagChildProps>(child)) return child;

    const style: LayoutCssVars = {
      ...child.props.style,
      '--jona-gridbag-column': getGridBagColumn(child.props),
      '--jona-gridbag-row': toCssValue(child.props['data-gridbag-row']),
      '--jona-gridbag-column-span': getGridBagColumnSpan(child.props),
      '--jona-gridbag-row-span': getGridBagRowSpan(child.props),
      '--jona-gridbag-align': child.props['data-gridbag-align'],
      '--jona-gridbag-justify': child.props['data-gridbag-justify'],
    };

    return React.cloneElement(child, {
      'data-jona-gridbag-item': '',
      style,
    } as Partial<GridBagChildProps> & { 'data-jona-gridbag-item': string });
  });

export const GridBagLayoutView = React.forwardRef<HTMLDivElement, InterGridBagLayout>(
  (
    {
      children,
      className,
      style,
      gap = 'md',
      alignItems = 'stretch',
      justifyContent = 'start',
      columns,
      rows,
      autoFitMin = '12rem',
      dense = true,
      placement = 'responsive',
      ...props
    },
    ref
  ) => {
    const layoutStyle: LayoutCssVars = {
      '--jona-layout-min': autoFitMin,
      '--jona-layout-columns': resolveGridTemplate(columns),
      '--jona-layout-rows': resolveGridTemplate(rows),
      ...style,
    };

    return (
      <PanelAtom
        ref={ref}
        className={cn(
          'jona-layout-mobile-grid jona-gridbag',
          layoutGapClasses[gap],
          layoutAlignClasses[alignItems],
          layoutJustifyClasses[justifyContent],
          className
        )}
        data-jona-layout-placement={placement}
        data-jona-layout-dense={dense ? 'true' : 'false'}
        style={layoutStyle}
        {...props}
      >
        {prepareGridBagChildren(children)}
      </PanelAtom>
    );
  }
);

GridBagLayoutView.displayName = 'GridBagLayoutView';
