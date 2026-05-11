import React from 'react';
import { cn } from '../../lib/cn';
import {
  InterPanelAtom,
  PANEL_ATOM_DEFAULTS,
  PanelAlign,
  PanelArea,
  PanelDirection,
  PanelGap,
  PanelGroupMode,
  PanelJustify,
  PanelLayout,
  PanelLayoutPlacement,
  PanelPadding,
  PanelRadius,
  PanelWrap,
  PanelVariant,
} from './InterPanelAtom';

const variantClasses: Record<PanelVariant, string> = {
  default:  'bg-white border border-neutral-200',
  outlined: 'bg-transparent border border-neutral-300',
  elevated: 'bg-white shadow-md border-0',
  flat:     'bg-neutral-50 border-0',
  ghost:    'bg-transparent border-0',
};

const paddingClasses: Record<PanelPadding, string> = {
  none: 'p-0',
  sm:   'p-2',
  md:   'p-4',
  lg:   'p-6',
  xl:   'p-8',
};

const radiusClasses: Record<PanelRadius, string> = {
  none: 'rounded-none',
  sm:   'rounded-sm',
  md:   'rounded-md',
  lg:   'rounded-lg',
  xl:   'rounded-xl',
  full: 'rounded-full',
};

const gapClasses: Record<PanelGap, string> = {
  none: 'gap-0',
  xs:   'gap-1',
  sm:   'gap-2',
  md:   'gap-4',
  lg:   'gap-6',
  xl:   'gap-8',
};

const alignClasses: Record<PanelAlign, string> = {
  start:    'items-start',
  center:   'items-center',
  end:      'items-end',
  stretch:  'items-stretch',
  baseline: 'items-baseline',
};

const justifyClasses: Record<PanelJustify, string> = {
  start:   'justify-start',
  center:  'justify-center',
  end:     'justify-end',
  between: 'justify-between',
  around:  'justify-around',
  evenly:  'justify-evenly',
};

const directionClasses: Record<PanelDirection, string> = {
  row:    'flex-row',
  column: 'flex-col',
};

const wrapClasses: Record<PanelWrap, string> = {
  nowrap: 'flex-nowrap',
  wrap:   'flex-wrap',
  reverse:'flex-wrap-reverse',
};

type PanelLayoutCssVars = React.CSSProperties & Record<`--${string}`, string | number | undefined>;

const responsiveLayouts = new Set<PanelLayout>(['grid', 'gridbag', 'group', 'spring']);

const resolvePanelTag = (as?: React.ElementType): React.ElementType => {
  if (typeof as === 'string') {
    return as.trim() ? as : 'div';
  }

  return as ?? 'div';
};

const resolveWrap = (
  wrap: boolean | PanelWrap | undefined,
  fallback: PanelWrap
): PanelWrap => {
  if (typeof wrap === 'boolean') return wrap ? 'wrap' : 'nowrap';
  return wrap ?? fallback;
};

const resolveTemplate = (value: number | string | undefined): string | undefined => {
  if (typeof value === 'number') return `repeat(${value}, minmax(0, 1fr))`;
  return value;
};

const resolveCssValue = (value: number | string | undefined): string | undefined => {
  if (value === undefined) return undefined;
  return String(value);
};

const resolvePlacement = (
  layout: PanelLayout,
  placement: PanelLayoutPlacement | undefined
): PanelLayoutPlacement | undefined => responsiveLayouts.has(layout) ? placement ?? 'responsive' : undefined;

const getLayoutClasses = (
  layout: PanelLayout,
  direction: PanelDirection,
  gap: PanelGap,
  alignItems: PanelAlign,
  justifyContent: PanelJustify,
  wrap: boolean | PanelWrap | undefined,
  mode: PanelGroupMode | undefined
): string | undefined => {
  if (layout === 'none') return undefined;

  if (layout === 'flow') {
    return cn(
      'flex min-w-0 w-full max-w-full flex-row',
      wrapClasses[resolveWrap(wrap, 'wrap')],
      gapClasses[gap],
      alignClasses[alignItems],
      justifyClasses[justifyContent]
    );
  }

  if (layout === 'box') {
    return cn(
      'flex min-w-0 w-full max-w-full',
      directionClasses[direction],
      wrapClasses[resolveWrap(wrap, direction === 'column' ? 'nowrap' : 'wrap')],
      gapClasses[gap],
      alignClasses[alignItems],
      justifyClasses[justifyContent]
    );
  }

  if (layout === 'grid') {
    return cn(
      'grid jona-layout-mobile-grid min-w-0 w-full max-w-full',
      gapClasses[gap],
      alignClasses[alignItems],
      justifyClasses[justifyContent]
    );
  }

  if (layout === 'gridbag') {
    return cn(
      'jona-layout-mobile-grid jona-gridbag',
      gapClasses[gap],
      alignClasses[alignItems],
      justifyClasses[justifyContent]
    );
  }

  if (layout === 'group') {
    return cn(
      'jona-layout-mobile-grid jona-group-layout',
      mode === 'parallel' && 'justify-items-stretch',
      gapClasses[gap],
      alignClasses[alignItems],
      justifyClasses[justifyContent]
    );
  }

  if (layout === 'spring') {
    return cn(
      'jona-spring-layout',
      gapClasses[gap],
      alignClasses[alignItems],
      justifyClasses[justifyContent]
    );
  }

  if (layout === 'border') {
    return cn(
      'grid min-h-0 min-w-0 w-full max-w-full',
      "[grid-template-areas:'top'_'left'_'center'_'right'_'bottom']",
      '[grid-template-columns:minmax(0,1fr)]',
      '[grid-template-rows:auto_auto_auto_auto_auto]',
      "md:[grid-template-areas:'top_top_top'_'left_center_right'_'bottom_bottom_bottom']",
      'md:[grid-template-columns:auto_minmax(0,1fr)_auto]',
      'md:[grid-template-rows:auto_minmax(0,1fr)_auto]',
      gapClasses[gap],
      alignClasses[alignItems],
      justifyClasses[justifyContent]
    );
  }

  if (layout === 'card') {
    return cn('relative min-w-0 w-full max-w-full', gapClasses[gap]);
  }

  return cn('relative min-w-0', gapClasses[gap]);
};

const getLayoutStyle = (
  layout: PanelLayout,
  columns: number | string | undefined,
  rows: number | string | undefined,
  autoFitMin: string | undefined,
  minHeight: string | undefined,
  style: React.CSSProperties | undefined
): React.CSSProperties | undefined => {
  const layoutStyle: PanelLayoutCssVars = {};

  if (layout === 'grid') {
    layoutStyle['--jona-layout-min'] = autoFitMin ?? '12rem';
    layoutStyle['--jona-layout-columns'] = resolveTemplate(columns);
    layoutStyle['--jona-layout-rows'] = resolveTemplate(rows);
  }

  if (layout === 'border') {
    layoutStyle.gridTemplateColumns = resolveTemplate(columns);
    layoutStyle.gridTemplateRows = resolveTemplate(rows);
  }

  if (layout === 'gridbag') {
    layoutStyle['--jona-layout-min'] = autoFitMin ?? '12rem';
    layoutStyle['--jona-layout-columns'] = resolveTemplate(columns);
    layoutStyle['--jona-layout-rows'] = resolveTemplate(rows);
  }

  if (layout === 'group') {
    layoutStyle['--jona-layout-min'] = autoFitMin ?? '12rem';
    layoutStyle['--jona-layout-columns'] = resolveTemplate(columns);
  }

  if (layout === 'spring') {
    layoutStyle['--jona-layout-min'] = autoFitMin ?? '12rem';
    layoutStyle['--jona-spring-min-height'] = minHeight ?? '16rem';
  }

  return Object.keys(layoutStyle).length > 0 ? { ...layoutStyle, ...style } : style;
};

type PanelManagedChildProps = {
  style?: React.CSSProperties;
  'data-panel-area'?: PanelArea;
  'data-panel-card'?: string | number;
  'data-gridbag-column'?: number | string;
  'data-gridbag-col'?: number | string;
  'data-gridbag-row'?: number | string;
  'data-gridbag-column-span'?: number | string;
  'data-gridbag-colspan'?: number | string;
  'data-gridbag-row-span'?: number | string;
  'data-gridbag-rowspan'?: number | string;
  'data-gridbag-align'?: string;
  'data-gridbag-justify'?: string;
  'data-group-span'?: number | string;
  'data-group-align'?: string;
  'data-group-justify'?: string;
  'data-spring-left'?: number | string;
  'data-spring-right'?: number | string;
  'data-spring-top'?: number | string;
  'data-spring-bottom'?: number | string;
  'data-spring-width'?: number | string;
  'data-spring-height'?: number | string;
};

const getCardKey = (child: React.ReactElement<PanelManagedChildProps>): string | undefined => {
  const card = child.props['data-panel-card'];
  if (card !== undefined) return String(card);
  if (child.key !== null) return String(child.key);
  return undefined;
};

const getGridBagColumn = (props: PanelManagedChildProps): string | undefined =>
  resolveCssValue(props['data-gridbag-column'] ?? props['data-gridbag-col']);

const getGridBagColumnSpan = (props: PanelManagedChildProps): string | undefined =>
  resolveCssValue(props['data-gridbag-column-span'] ?? props['data-gridbag-colspan']);

const getGridBagRowSpan = (props: PanelManagedChildProps): string | undefined =>
  resolveCssValue(props['data-gridbag-row-span'] ?? props['data-gridbag-rowspan']);

const prepareLayoutChildren = (
  children: React.ReactNode,
  layout: PanelLayout,
  activeCard: string | number | undefined
): React.ReactNode => {
  if (!['border', 'card', 'gridbag', 'group', 'spring'].includes(layout)) return children;

  let firstCardShown = false;

  return React.Children.map(children, (child) => {
    if (!React.isValidElement<PanelManagedChildProps>(child)) return child;

    if (layout === 'border') {
      const area = child.props['data-panel-area'];
      if (!area) return child;

      return React.cloneElement(child, {
        style: { ...child.props.style, gridArea: area },
      });
    }

    if (layout === 'gridbag') {
      const style: PanelLayoutCssVars = {
        ...child.props.style,
        '--jona-gridbag-column': getGridBagColumn(child.props),
        '--jona-gridbag-row': resolveCssValue(child.props['data-gridbag-row']),
        '--jona-gridbag-column-span': getGridBagColumnSpan(child.props),
        '--jona-gridbag-row-span': getGridBagRowSpan(child.props),
        '--jona-gridbag-align': child.props['data-gridbag-align'],
        '--jona-gridbag-justify': child.props['data-gridbag-justify'],
      };

      return React.cloneElement(child, {
        'data-jona-gridbag-item': '',
        style,
      } as Partial<PanelManagedChildProps> & { 'data-jona-gridbag-item': string });
    }

    if (layout === 'group') {
      const style: PanelLayoutCssVars = {
        ...child.props.style,
        '--jona-group-span': resolveCssValue(child.props['data-group-span']),
        '--jona-group-align': child.props['data-group-align'],
        '--jona-group-justify': child.props['data-group-justify'],
      };

      return React.cloneElement(child, {
        'data-jona-group-item': '',
        style,
      } as Partial<PanelManagedChildProps> & { 'data-jona-group-item': string });
    }

    if (layout === 'spring') {
      const style: PanelLayoutCssVars = {
        ...child.props.style,
        '--jona-spring-left': resolveCssValue(child.props['data-spring-left']),
        '--jona-spring-right': resolveCssValue(child.props['data-spring-right']),
        '--jona-spring-top': resolveCssValue(child.props['data-spring-top']),
        '--jona-spring-bottom': resolveCssValue(child.props['data-spring-bottom']),
        '--jona-spring-width': resolveCssValue(child.props['data-spring-width']),
        '--jona-spring-height': resolveCssValue(child.props['data-spring-height']),
      };

      return React.cloneElement(child, {
        'data-jona-spring-item': '',
        style,
      } as Partial<PanelManagedChildProps> & { 'data-jona-spring-item': string });
    }

    const cardKey = getCardKey(child);
    const isActive = activeCard === undefined
      ? !firstCardShown
      : cardKey === String(activeCard);
    firstCardShown = firstCardShown || isActive;

    if (isActive) {
      return React.cloneElement(child, {
        style: {
          ...child.props.style,
          minWidth: 0,
          width: '100%',
          maxWidth: '100%',
        },
      });
    }

    return React.cloneElement(child, {
      style: { ...child.props.style, display: 'none' },
    });
  });
};

const getLayoutDataAttributes = (
  layout: PanelLayout,
  placement: PanelLayoutPlacement | undefined,
  dense: boolean | undefined,
  mode: PanelGroupMode | undefined
): Record<string, string> => {
  const attributes: Record<string, string> = {};
  const resolvedPlacement = resolvePlacement(layout, placement);

  if (resolvedPlacement) {
    attributes['data-jona-layout-placement'] = resolvedPlacement;
  }

  if (layout === 'gridbag') {
    attributes['data-jona-layout-dense'] = dense === false ? 'false' : 'true';
  }

  if (layout === 'group') {
    attributes['data-jona-layout-mode'] = mode ?? 'sequential';
  }

  return attributes;
};

export const PanelAtomView = React.forwardRef<HTMLDivElement, InterPanelAtom>(
  (
    {
      variant = PANEL_ATOM_DEFAULTS.variant,
      padding = PANEL_ATOM_DEFAULTS.padding,
      radius  = PANEL_ATOM_DEFAULTS.radius,
      as,
      layout = PANEL_ATOM_DEFAULTS.layout,
      direction = PANEL_ATOM_DEFAULTS.direction,
      gap = PANEL_ATOM_DEFAULTS.gap,
      alignItems = PANEL_ATOM_DEFAULTS.alignItems,
      justifyContent = PANEL_ATOM_DEFAULTS.justifyContent,
      wrap,
      columns,
      rows,
      autoFitMin,
      placement,
      dense,
      mode,
      minHeight,
      activeCard,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const Tag = resolvePanelTag(as);
    const managedChildren = prepareLayoutChildren(children, layout, activeCard);
    const layoutStyle = getLayoutStyle(layout, columns, rows, autoFitMin, minHeight, style);
    const layoutDataAttributes = getLayoutDataAttributes(layout, placement, dense, mode);

    return (
      <Tag
        ref={ref}
        className={cn(
          variantClasses[variant],
          paddingClasses[padding],
          radiusClasses[radius],
          getLayoutClasses(layout, direction, gap, alignItems, justifyContent, wrap, mode),
          className
        )}
        style={layoutStyle}
        {...props}
        {...layoutDataAttributes}
      >
        {managedChildren}
      </Tag>
    );
  }
);
PanelAtomView.displayName = 'PanelAtomView';
