import React from 'react';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { cn } from '../../lib/cn';
import {
  layoutGapClasses,
  toCssValue,
  type LayoutCssVars,
} from '../layoutPrimitives';
import type { InterSpringLayout } from './InterSpringLayout';

type SpringChildProps = {
  style?: React.CSSProperties;
  'data-spring-left'?: number | string;
  'data-spring-right'?: number | string;
  'data-spring-top'?: number | string;
  'data-spring-bottom'?: number | string;
  'data-spring-width'?: number | string;
  'data-spring-height'?: number | string;
};

const prepareSpringChildren = (children: React.ReactNode): React.ReactNode =>
  React.Children.map(children, (child) => {
    if (!React.isValidElement<SpringChildProps>(child)) return child;

    const style: LayoutCssVars = {
      ...child.props.style,
      '--jona-spring-left': toCssValue(child.props['data-spring-left']),
      '--jona-spring-right': toCssValue(child.props['data-spring-right']),
      '--jona-spring-top': toCssValue(child.props['data-spring-top']),
      '--jona-spring-bottom': toCssValue(child.props['data-spring-bottom']),
      '--jona-spring-width': toCssValue(child.props['data-spring-width']),
      '--jona-spring-height': toCssValue(child.props['data-spring-height']),
    };

    return React.cloneElement(child, {
      'data-jona-spring-item': '',
      style,
    } as Partial<SpringChildProps> & { 'data-jona-spring-item': string });
  });

export const SpringLayoutView = React.forwardRef<HTMLDivElement, InterSpringLayout>(
  (
    {
      children,
      className,
      style,
      gap = 'md',
      autoFitMin = '12rem',
      minHeight = '16rem',
      placement = 'responsive',
      ...props
    },
    ref
  ) => {
    const layoutStyle: LayoutCssVars = {
      '--jona-layout-min': autoFitMin,
      '--jona-spring-min-height': minHeight,
      ...style,
    };

    return (
      <PanelAtom
        ref={ref}
        className={cn('jona-spring-layout', layoutGapClasses[gap], className)}
        data-jona-layout-placement={placement}
        style={layoutStyle}
        {...props}
      >
        {prepareSpringChildren(children)}
      </PanelAtom>
    );
  }
);

SpringLayoutView.displayName = 'SpringLayoutView';
