import React from 'react';
import { cn } from '../../lib/cn';
import {
  InterJPanel,
  JPANEL_DEFAULTS,
  JPanelAlign,
  JPanelArea,
  JPanelDirection,
  JPanelGap,
  JPanelGroupMode,
  JPanelJustify,
  JPanelLayout,
  JPanelLayoutPlacement,
  JPanelPadding,
  JPanelRadius,
  JPanelResponsiveConfig,
  JPanelVariant,
  JPanelWrap,
} from './InterJPanel';

type JPanelCssVars = React.CSSProperties & Record<`--${string}`, string | number | undefined>;

const variantClasses: Record<JPanelVariant, string> = {
  default: 'bg-white border border-neutral-200',
  outlined: 'bg-transparent border border-neutral-300',
  elevated: 'bg-white shadow-md border-0',
  flat: 'bg-neutral-50 border-0',
  ghost: 'bg-transparent border-0',
};

const paddingClasses: Record<JPanelPadding, string> = {
  none: 'p-0',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

const radiusClasses: Record<JPanelRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

const gapValues: Record<JPanelGap, string> = {
  none: '0',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
};

const alignValues: Record<JPanelAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const justifyValues: Record<JPanelJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

const directionValues: Record<JPanelDirection, string> = {
  row: 'row',
  column: 'column',
};

const wrapValues: Record<JPanelWrap, string> = {
  nowrap: 'nowrap',
  wrap: 'wrap',
  reverse: 'wrap-reverse',
};

const responsiveLayouts = new Set<JPanelLayout>(['grid', 'gridbag', 'group', 'spring']);

const resolveJPanelTag = (as?: React.ElementType): React.ElementType => {
  if (typeof as === 'string') return as.trim() ? as : 'div';
  return as ?? 'div';
};

const resolveWrap = (
  wrap: boolean | JPanelWrap | undefined,
  fallback: JPanelWrap
): JPanelWrap => {
  if (typeof wrap === 'boolean') return wrap ? 'wrap' : 'nowrap';
  return wrap ?? fallback;
};

const resolveTemplate = (value: number | string | undefined): string | undefined => {
  if (typeof value === 'number') return `repeat(${value}, minmax(0, 1fr))`;
  return value;
};

const resolveCssValue = (value: number | string | undefined): string | undefined =>
  value === undefined ? undefined : String(value);

const resolvePlacement = (
  layout: JPanelLayout,
  placement: JPanelLayoutPlacement | undefined
): JPanelLayoutPlacement | undefined => responsiveLayouts.has(layout) ? placement ?? 'responsive' : placement;

const resolveConfig = (
  base: Required<Pick<InterJPanel, 'layout' | 'direction' | 'gap' | 'alignItems' | 'justifyContent'>> &
    Pick<InterJPanel, 'wrap' | 'columns' | 'rows' | 'autoFitMin' | 'placement' | 'dense' | 'mode' | 'minHeight'>,
  override?: JPanelResponsiveConfig
) => ({
  layout: override?.layout ?? base.layout,
  direction: override?.direction ?? base.direction,
  gap: override?.gap ?? base.gap,
  alignItems: override?.alignItems ?? base.alignItems,
  justifyContent: override?.justifyContent ?? base.justifyContent,
  wrap: override?.wrap ?? base.wrap,
  columns: override?.columns ?? base.columns,
  rows: override?.rows ?? base.rows,
  autoFitMin: override?.autoFitMin ?? base.autoFitMin,
  placement: override?.placement ?? base.placement,
  dense: override?.dense ?? base.dense,
  mode: override?.mode ?? base.mode,
  minHeight: override?.minHeight ?? base.minHeight,
});

const setConfigVars = (
  style: JPanelCssVars,
  config: ReturnType<typeof resolveConfig>,
  prefix: '' | 'tablet' | 'desktop'
) => {
  const cssPrefix = (prefix ? `--jpanel-${prefix}` : '--jpanel') as '--jpanel' | '--jpanel-tablet' | '--jpanel-desktop';
  const setVar = (name: string, value: string | number | undefined) => {
    style[`${cssPrefix}-${name}` as `--${string}`] = value;
  };
  const wrapFallback: JPanelWrap = config.layout === 'flow'
    ? 'wrap'
    : config.direction === 'column' ? 'nowrap' : 'wrap';
  const placement = resolvePlacement(config.layout, config.placement);

  setVar('gap', gapValues[config.gap]);
  setVar('direction', directionValues[config.direction]);
  setVar('wrap', wrapValues[resolveWrap(config.wrap, wrapFallback)]);
  setVar('align-items', alignValues[config.alignItems]);
  setVar('justify-content', justifyValues[config.justifyContent]);
  setVar('columns', resolveTemplate(config.columns));
  setVar('rows', resolveTemplate(config.rows));
  setVar('auto-fit-min', config.autoFitMin ?? '12rem');
  setVar('spring-min-height', config.minHeight ?? '16rem');
  setVar('placement', placement);
};

type JPanelManagedChildProps = {
  style?: React.CSSProperties;
  area?: JPanelArea;
  card?: string | number;
  gridBagColumn?: number | string;
  gridBagRow?: number | string;
  gridBagColumnSpan?: number | string;
  gridBagRowSpan?: number | string;
  gridBagAlign?: string;
  gridBagJustify?: string;
  groupSpan?: number | string;
  groupAlign?: string;
  groupJustify?: string;
  springLeft?: number | string;
  springRight?: number | string;
  springTop?: number | string;
  springBottom?: number | string;
  springWidth?: number | string;
  springHeight?: number | string;
  'data-panel-area'?: JPanelArea;
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

const getCardKey = (child: React.ReactElement<JPanelManagedChildProps>): string | undefined => {
  const card = child.props.card ?? child.props['data-panel-card'];
  if (card !== undefined) return String(card);
  if (child.key !== null) return String(child.key);
  return undefined;
};

const getBorderArea = (child: React.ReactElement<JPanelManagedChildProps>): JPanelArea | undefined =>
  child.props.area ?? child.props['data-panel-area'];

const hasSpringConstraint = (child: React.ReactElement<JPanelManagedChildProps>): boolean =>
  [
    child.props.springLeft,
    child.props.springRight,
    child.props.springTop,
    child.props.springBottom,
    child.props.springWidth,
    child.props.springHeight,
    child.props['data-spring-left'],
    child.props['data-spring-right'],
    child.props['data-spring-top'],
    child.props['data-spring-bottom'],
    child.props['data-spring-width'],
    child.props['data-spring-height'],
  ].some((value) => value !== undefined);

const layoutSetIncludes = (layouts: Set<JPanelLayout>, layout: JPanelLayout): boolean => layouts.has(layout);

const getJPanelDiagnostics = (
  children: React.ReactNode,
  layouts: Set<JPanelLayout>,
  activeCard: string | number | undefined
): string[] => {
  const diagnostics: string[] = [];

  if (layoutSetIncludes(layouts, 'border')) {
    React.Children.forEach(children, (child, index) => {
      if (React.isValidElement<JPanelManagedChildProps>(child) && !getBorderArea(child)) {
        diagnostics.push(
          `[JPanel] layout="border" necesita que el hijo #${index + 1} defina area="top|right|bottom|left|center" o data-panel-area.`
        );
      }
    });
  }

  if (layoutSetIncludes(layouts, 'card') && activeCard !== undefined) {
    let hasActiveCard = false;

    React.Children.forEach(children, (child) => {
      if (React.isValidElement<JPanelManagedChildProps>(child) && getCardKey(child) === String(activeCard)) {
        hasActiveCard = true;
      }
    });

    if (!hasActiveCard) {
      diagnostics.push(
        `[JPanel] layout="card" recibio activeCard="${String(activeCard)}", pero ningun hijo define card, data-panel-card o key con ese valor.`
      );
    }
  }

  if (layoutSetIncludes(layouts, 'spring')) {
    React.Children.forEach(children, (child, index) => {
      if (React.isValidElement<JPanelManagedChildProps>(child) && !hasSpringConstraint(child)) {
        diagnostics.push(
          `[JPanel] layout="spring" necesita que el hijo #${index + 1} defina al menos una constraint springLeft/right/top/bottom/width/height o data-spring-*.`
        );
      }
    });
  }

  return diagnostics;
};

const logJPanelDiagnostics = (diagnostics: string[]) => {
  if (diagnostics.length === 0 || typeof console === 'undefined' || typeof console.log !== 'function') return;
  diagnostics.forEach((message) => console.log(message));
};

const prepareLayoutChildren = (
  children: React.ReactNode,
  layouts: Set<JPanelLayout>,
  activeCard: string | number | undefined
): React.ReactNode => {
  const needsManagedChildren = ['border', 'card', 'gridbag', 'group', 'spring']
    .some((layout) => layouts.has(layout as JPanelLayout));

  if (!needsManagedChildren) return children;

  let firstCardShown = false;

  return React.Children.map(children, (child) => {
    if (!React.isValidElement<JPanelManagedChildProps>(child)) return child;

    const nextProps: Partial<JPanelManagedChildProps> & Record<string, string | React.CSSProperties | undefined> = {};
    const nextStyle: JPanelCssVars = { ...child.props.style };

    if (layoutSetIncludes(layouts, 'border')) {
      const area = child.props.area ?? child.props['data-panel-area'];
      if (area) {
        nextProps['data-panel-area'] = area;
        nextStyle.gridArea = area;
      }
    }

    if (layoutSetIncludes(layouts, 'gridbag')) {
      nextProps['data-jpanel-gridbag-item'] = '';
      nextProps['data-jona-gridbag-item'] = '';
      nextStyle['--jpanel-gridbag-column'] = resolveCssValue(child.props.gridBagColumn ?? child.props['data-gridbag-column'] ?? child.props['data-gridbag-col']);
      nextStyle['--jpanel-gridbag-row'] = resolveCssValue(child.props.gridBagRow ?? child.props['data-gridbag-row']);
      nextStyle['--jpanel-gridbag-column-span'] = resolveCssValue(child.props.gridBagColumnSpan ?? child.props['data-gridbag-column-span'] ?? child.props['data-gridbag-colspan']);
      nextStyle['--jpanel-gridbag-row-span'] = resolveCssValue(child.props.gridBagRowSpan ?? child.props['data-gridbag-row-span'] ?? child.props['data-gridbag-rowspan']);
      nextStyle['--jpanel-gridbag-align'] = child.props.gridBagAlign ?? child.props['data-gridbag-align'];
      nextStyle['--jpanel-gridbag-justify'] = child.props.gridBagJustify ?? child.props['data-gridbag-justify'];
    }

    if (layoutSetIncludes(layouts, 'group')) {
      nextProps['data-jpanel-group-item'] = '';
      nextProps['data-jona-group-item'] = '';
      nextStyle['--jpanel-group-span'] = resolveCssValue(child.props.groupSpan ?? child.props['data-group-span']);
      nextStyle['--jpanel-group-align'] = child.props.groupAlign ?? child.props['data-group-align'];
      nextStyle['--jpanel-group-justify'] = child.props.groupJustify ?? child.props['data-group-justify'];
    }

    if (layoutSetIncludes(layouts, 'spring')) {
      nextProps['data-jpanel-spring-item'] = '';
      nextProps['data-jona-spring-item'] = '';
      nextStyle['--jpanel-spring-left'] = resolveCssValue(child.props.springLeft ?? child.props['data-spring-left']);
      nextStyle['--jpanel-spring-right'] = resolveCssValue(child.props.springRight ?? child.props['data-spring-right']);
      nextStyle['--jpanel-spring-top'] = resolveCssValue(child.props.springTop ?? child.props['data-spring-top']);
      nextStyle['--jpanel-spring-bottom'] = resolveCssValue(child.props.springBottom ?? child.props['data-spring-bottom']);
      nextStyle['--jpanel-spring-width'] = resolveCssValue(child.props.springWidth ?? child.props['data-spring-width']);
      nextStyle['--jpanel-spring-height'] = resolveCssValue(child.props.springHeight ?? child.props['data-spring-height']);
    }

    if (layoutSetIncludes(layouts, 'card')) {
      const cardKey = getCardKey(child);
      const isActive = activeCard === undefined
        ? !firstCardShown
        : cardKey === String(activeCard);

      firstCardShown = firstCardShown || isActive;
      nextProps['data-jpanel-card-state'] = isActive ? 'active' : 'hidden';
      if (cardKey !== undefined) nextProps['data-panel-card'] = cardKey;
    }

    return React.cloneElement(child, {
      ...nextProps,
      style: nextStyle,
    });
  });
};

export const JPanelView = React.forwardRef<HTMLElement, InterJPanel>(
  (
    {
      variant = JPANEL_DEFAULTS.variant,
      padding = JPANEL_DEFAULTS.padding,
      radius = JPANEL_DEFAULTS.radius,
      as,
      layout = JPANEL_DEFAULTS.layout,
      direction = JPANEL_DEFAULTS.direction,
      gap = JPANEL_DEFAULTS.gap,
      alignItems = JPANEL_DEFAULTS.alignItems,
      justifyContent = JPANEL_DEFAULTS.justifyContent,
      wrap,
      columns,
      rows,
      autoFitMin,
      placement,
      dense,
      mode,
      minHeight,
      activeCard,
      tablet,
      desktop,
      area,
      card,
      gridBagColumn,
      gridBagRow,
      gridBagColumnSpan,
      gridBagRowSpan,
      gridBagAlign,
      gridBagJustify,
      groupSpan,
      groupAlign,
      groupJustify,
      springLeft,
      springRight,
      springTop,
      springBottom,
      springWidth,
      springHeight,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const Tag = resolveJPanelTag(as);
    const baseConfig = {
      layout,
      direction,
      gap,
      alignItems,
      justifyContent,
      wrap,
      columns,
      rows,
      autoFitMin,
      placement,
      dense,
      mode,
      minHeight,
    };
    const tabletConfig = resolveConfig(baseConfig, tablet);
    const desktopConfig = resolveConfig(tabletConfig, desktop);
    const layoutVariants = new Set<JPanelLayout>([layout, tabletConfig.layout, desktopConfig.layout]);
    const layoutStyle: JPanelCssVars = { ...style };

    setConfigVars(layoutStyle, baseConfig, '');
    setConfigVars(layoutStyle, tabletConfig, 'tablet');
    setConfigVars(layoutStyle, desktopConfig, 'desktop');

    const diagnostics = getJPanelDiagnostics(children, layoutVariants, activeCard);
    const diagnosticsKey = diagnostics.join('\n');

    React.useEffect(() => {
      logJPanelDiagnostics(diagnostics);
    }, [diagnosticsKey]);

    const resolvedArea = area ?? props['data-panel-area'];
    const resolvedCard = card ?? props['data-panel-card'];

    if (gridBagColumn ?? props['data-gridbag-column'] ?? props['data-gridbag-col']) {
      layoutStyle['--jpanel-gridbag-column'] = resolveCssValue(gridBagColumn ?? props['data-gridbag-column'] ?? props['data-gridbag-col']);
    }
    if (gridBagRow ?? props['data-gridbag-row']) {
      layoutStyle['--jpanel-gridbag-row'] = resolveCssValue(gridBagRow ?? props['data-gridbag-row']);
    }
    if (gridBagColumnSpan ?? props['data-gridbag-column-span'] ?? props['data-gridbag-colspan']) {
      layoutStyle['--jpanel-gridbag-column-span'] = resolveCssValue(gridBagColumnSpan ?? props['data-gridbag-column-span'] ?? props['data-gridbag-colspan']);
    }
    if (gridBagRowSpan ?? props['data-gridbag-row-span'] ?? props['data-gridbag-rowspan']) {
      layoutStyle['--jpanel-gridbag-row-span'] = resolveCssValue(gridBagRowSpan ?? props['data-gridbag-row-span'] ?? props['data-gridbag-rowspan']);
    }
    layoutStyle['--jpanel-gridbag-align'] = gridBagAlign ?? props['data-gridbag-align'];
    layoutStyle['--jpanel-gridbag-justify'] = gridBagJustify ?? props['data-gridbag-justify'];
    layoutStyle['--jpanel-group-span'] = resolveCssValue(groupSpan ?? props['data-group-span']);
    layoutStyle['--jpanel-group-align'] = groupAlign ?? props['data-group-align'];
    layoutStyle['--jpanel-group-justify'] = groupJustify ?? props['data-group-justify'];
    layoutStyle['--jpanel-spring-left'] = resolveCssValue(springLeft ?? props['data-spring-left']);
    layoutStyle['--jpanel-spring-right'] = resolveCssValue(springRight ?? props['data-spring-right']);
    layoutStyle['--jpanel-spring-top'] = resolveCssValue(springTop ?? props['data-spring-top']);
    layoutStyle['--jpanel-spring-bottom'] = resolveCssValue(springBottom ?? props['data-spring-bottom']);
    layoutStyle['--jpanel-spring-width'] = resolveCssValue(springWidth ?? props['data-spring-width']);
    layoutStyle['--jpanel-spring-height'] = resolveCssValue(springHeight ?? props['data-spring-height']);

    const managedChildren = prepareLayoutChildren(children, layoutVariants, activeCard);

    return (
      <Tag
        ref={ref}
        className={cn(
          'jpanel',
          variantClasses[variant],
          paddingClasses[padding],
          radiusClasses[radius],
          className
        )}
        style={layoutStyle}
        data-jpanel-layout={layout}
        data-jpanel-tablet-layout={tabletConfig.layout}
        data-jpanel-desktop-layout={desktopConfig.layout}
        data-jpanel-placement={resolvePlacement(layout, placement)}
        data-jpanel-tablet-placement={resolvePlacement(tabletConfig.layout, tabletConfig.placement)}
        data-jpanel-desktop-placement={resolvePlacement(desktopConfig.layout, desktopConfig.placement)}
        data-jpanel-dense={dense === false ? 'false' : 'true'}
        data-jpanel-tablet-dense={tabletConfig.dense === false ? 'false' : 'true'}
        data-jpanel-desktop-dense={desktopConfig.dense === false ? 'false' : 'true'}
        data-jpanel-mode={mode ?? 'sequential'}
        data-jpanel-tablet-mode={tabletConfig.mode ?? 'sequential'}
        data-jpanel-desktop-mode={desktopConfig.mode ?? 'sequential'}
        data-panel-area={resolvedArea}
        data-panel-card={resolvedCard}
        {...props}
      >
        {managedChildren}
      </Tag>
    );
  }
);
JPanelView.displayName = 'JPanelView';
