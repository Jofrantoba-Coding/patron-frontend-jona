import React from 'react';
import { cn } from '../../lib/cn';
import {
  InterPanelAtom,
  PANEL_ATOM_DEFAULTS,
  PanelAlign,
  PanelArea,
  PanelDirection,
  PanelGap,
  PanelJustify,
  PanelLayout,
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

const getLayoutClasses = (
  layout: PanelLayout,
  direction: PanelDirection,
  gap: PanelGap,
  alignItems: PanelAlign,
  justifyContent: PanelJustify,
  wrap: boolean | PanelWrap | undefined
): string | undefined => {
  if (layout === 'none') return undefined;

  if (layout === 'flow') {
    return cn(
      'flex min-w-0 flex-row',
      wrapClasses[resolveWrap(wrap, 'wrap')],
      gapClasses[gap],
      alignClasses[alignItems],
      justifyClasses[justifyContent]
    );
  }

  if (layout === 'box') {
    return cn(
      'flex min-w-0',
      directionClasses[direction],
      wrapClasses[resolveWrap(wrap, 'nowrap')],
      gapClasses[gap],
      alignClasses[alignItems],
      justifyClasses[justifyContent]
    );
  }

  if (layout === 'grid') {
    return cn('grid min-w-0', gapClasses[gap], alignClasses[alignItems], justifyClasses[justifyContent]);
  }

  if (layout === 'border') {
    return cn(
      'grid min-h-0 min-w-0',
      "[grid-template-areas:'top'_'left'_'center'_'right'_'bottom']",
      '[grid-template-columns:minmax(0,1fr)]',
      '[grid-template-rows:auto_auto_minmax(0,1fr)_auto_auto]',
      "md:[grid-template-areas:'top_top_top'_'left_center_right'_'bottom_bottom_bottom']",
      'md:[grid-template-columns:auto_minmax(0,1fr)_auto]',
      'md:[grid-template-rows:auto_minmax(0,1fr)_auto]',
      gapClasses[gap],
      alignClasses[alignItems],
      justifyClasses[justifyContent]
    );
  }

  return cn('relative min-w-0', gapClasses[gap]);
};

const getLayoutStyle = (
  layout: PanelLayout,
  columns: number | string | undefined,
  rows: number | string | undefined,
  autoFitMin: string | undefined,
  style: React.CSSProperties | undefined
): React.CSSProperties | undefined => {
  const layoutStyle: React.CSSProperties = {};

  if (layout === 'grid') {
    layoutStyle.gridTemplateColumns = autoFitMin
      ? `repeat(auto-fit, minmax(${autoFitMin}, 1fr))`
      : resolveTemplate(columns);
    layoutStyle.gridTemplateRows = resolveTemplate(rows);
  }

  if (layout === 'border') {
    layoutStyle.gridTemplateColumns = resolveTemplate(columns);
    layoutStyle.gridTemplateRows = resolveTemplate(rows);
  }

  return Object.keys(layoutStyle).length > 0 ? { ...layoutStyle, ...style } : style;
};

type PanelManagedChildProps = {
  style?: React.CSSProperties;
  'data-panel-area'?: PanelArea;
  'data-panel-card'?: string | number;
};

const getCardKey = (child: React.ReactElement<PanelManagedChildProps>): string | undefined => {
  const card = child.props['data-panel-card'];
  if (card !== undefined) return String(card);
  if (child.key !== null) return String(child.key);
  return undefined;
};

const prepareLayoutChildren = (
  children: React.ReactNode,
  layout: PanelLayout,
  activeCard: string | number | undefined
): React.ReactNode => {
  if (layout !== 'border' && layout !== 'card') return children;

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

    const cardKey = getCardKey(child);
    const isActive = activeCard === undefined
      ? !firstCardShown
      : cardKey === String(activeCard);
    firstCardShown = firstCardShown || isActive;

    if (isActive) return child;

    return React.cloneElement(child, {
      style: { ...child.props.style, display: 'none' },
    });
  });
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
    const layoutStyle = getLayoutStyle(layout, columns, rows, autoFitMin, style);

    return (
      <Tag
        ref={ref}
        className={cn(
          variantClasses[variant],
          paddingClasses[padding],
          radiusClasses[radius],
          getLayoutClasses(layout, direction, gap, alignItems, justifyContent, wrap),
          className
        )}
        style={layoutStyle}
        {...props}
      >
        {managedChildren}
      </Tag>
    );
  }
);
PanelAtomView.displayName = 'PanelAtomView';
