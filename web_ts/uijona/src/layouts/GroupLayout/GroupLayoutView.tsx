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
import type { InterGroupLayout } from './InterGroupLayout';

type GroupChildProps = {
  style?: React.CSSProperties;
  'data-group-span'?: number | string;
  'data-group-align'?: string;
  'data-group-justify'?: string;
};

const prepareGroupChildren = (children: React.ReactNode): React.ReactNode =>
  React.Children.map(children, (child) => {
    if (!React.isValidElement<GroupChildProps>(child)) return child;

    const style: LayoutCssVars = {
      ...child.props.style,
      '--jona-group-span': toCssValue(child.props['data-group-span']),
      '--jona-group-align': child.props['data-group-align'],
      '--jona-group-justify': child.props['data-group-justify'],
    };

    return React.cloneElement(child, {
      'data-jona-group-item': '',
      style,
    } as Partial<GroupChildProps> & { 'data-jona-group-item': string });
  });

export const GroupLayoutView = React.forwardRef<HTMLDivElement, InterGroupLayout>(
  (
    {
      children,
      className,
      style,
      gap = 'md',
      alignItems = 'stretch',
      justifyContent = 'start',
      columns,
      autoFitMin = '12rem',
      mode = 'sequential',
      placement = 'responsive',
      ...props
    },
    ref
  ) => {
    const layoutStyle: LayoutCssVars = {
      '--jona-layout-min': autoFitMin,
      '--jona-layout-columns': resolveGridTemplate(columns),
      ...style,
    };

    return (
      <PanelAtom
        ref={ref}
        className={cn(
          'jona-layout-mobile-grid jona-group-layout',
          mode === 'parallel' && 'justify-items-stretch',
          layoutGapClasses[gap],
          layoutAlignClasses[alignItems],
          layoutJustifyClasses[justifyContent],
          className
        )}
        data-jona-layout-mode={mode}
        data-jona-layout-placement={placement}
        style={layoutStyle}
        {...props}
      >
        {prepareGroupChildren(children)}
      </PanelAtom>
    );
  }
);

GroupLayoutView.displayName = 'GroupLayoutView';
