import React, { useEffect } from 'react';
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

type JPanelViewProps = InterJPanel &
  Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'style' | 'children'> & {
    forwardedRef?: React.Ref<HTMLElement>;
  };

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
  if (typeof as === 'string' && as.trim() === '') return 'div';
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
) => {
  const layout = override?.layout ?? base.layout;

  return {
    layout,
    direction: override?.direction ?? base.direction,
    gap: override?.gap ?? base.gap,
    alignItems: override?.alignItems ?? base.alignItems,
    justifyContent: override?.justifyContent ?? base.justifyContent,
    wrap: override?.wrap ?? base.wrap,
    columns: override?.columns ?? base.columns,
    rows: override?.rows ?? base.rows,
    autoFitMin: override?.autoFitMin ?? base.autoFitMin,
    placement: override?.placement ?? base.placement,
    dense: override?.dense ?? base.dense ?? (layout === 'gridbag' ? true : undefined),
    mode: override?.mode ?? base.mode,
    minHeight: override?.minHeight ?? base.minHeight,
  };
};

const setConfigVars = (
  style: JPanelCssVars,
  config: ReturnType<typeof resolveConfig>,
  prefix: '' | 'mobile-large' | 'tablet' | 'desktop' | 'tv'
) => {
  const cssPrefix = prefix ? `--jpanel-${prefix}` : '--jpanel';
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

const getJPanelDiagnostics = (
  children: React.ReactNode,
  layouts: Set<JPanelLayout>,
  activeCard: string | number | undefined
): string[] => {
  const diagnostics: string[] = [];

  if (layouts.has('border')) {
    React.Children.forEach(children, (child, index) => {
      if (React.isValidElement<JPanelManagedChildProps>(child) && !getBorderArea(child)) {
        diagnostics.push(
          `[JPanel] layout="border" necesita que el hijo #${index + 1} defina area="top|right|bottom|left|center" o data-panel-area.`
        );
      }
    });
  }

  if (layouts.has('card') && activeCard !== undefined) {
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

  if (layouts.has('spring')) {
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
  if (import.meta.env.PROD || diagnostics.length === 0) return;
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

    if (layouts.has('border')) {
      const area = child.props.area ?? child.props['data-panel-area'];
      if (area) {
        nextProps['data-panel-area'] = area;
        nextStyle.gridArea = area;
      }
    }

    if (layouts.has('gridbag')) {
      nextProps['data-jpanel-gridbag-item'] = '';
      nextProps['data-jona-gridbag-item'] = '';
      nextStyle['--jpanel-gridbag-column'] = resolveCssValue(child.props.gridBagColumn ?? child.props['data-gridbag-column'] ?? child.props['data-gridbag-col']);
      nextStyle['--jpanel-gridbag-row'] = resolveCssValue(child.props.gridBagRow ?? child.props['data-gridbag-row']);
      nextStyle['--jpanel-gridbag-column-span'] = resolveCssValue(child.props.gridBagColumnSpan ?? child.props['data-gridbag-column-span'] ?? child.props['data-gridbag-colspan']);
      nextStyle['--jpanel-gridbag-row-span'] = resolveCssValue(child.props.gridBagRowSpan ?? child.props['data-gridbag-row-span'] ?? child.props['data-gridbag-rowspan']);
      nextStyle['--jpanel-gridbag-align'] = child.props.gridBagAlign ?? child.props['data-gridbag-align'];
      nextStyle['--jpanel-gridbag-justify'] = child.props.gridBagJustify ?? child.props['data-gridbag-justify'];
    }

    if (layouts.has('group')) {
      nextProps['data-jpanel-group-item'] = '';
      nextProps['data-jona-group-item'] = '';
      nextStyle['--jpanel-group-span'] = resolveCssValue(child.props.groupSpan ?? child.props['data-group-span']);
      nextStyle['--jpanel-group-align'] = child.props.groupAlign ?? child.props['data-group-align'];
      nextStyle['--jpanel-group-justify'] = child.props.groupJustify ?? child.props['data-group-justify'];
    }

    if (layouts.has('spring')) {
      nextProps['data-jpanel-spring-item'] = '';
      nextProps['data-jona-spring-item'] = '';
      nextStyle['--jpanel-spring-left'] = resolveCssValue(child.props.springLeft ?? child.props['data-spring-left']);
      nextStyle['--jpanel-spring-right'] = resolveCssValue(child.props.springRight ?? child.props['data-spring-right']);
      nextStyle['--jpanel-spring-top'] = resolveCssValue(child.props.springTop ?? child.props['data-spring-top']);
      nextStyle['--jpanel-spring-bottom'] = resolveCssValue(child.props.springBottom ?? child.props['data-spring-bottom']);
      nextStyle['--jpanel-spring-width'] = resolveCssValue(child.props.springWidth ?? child.props['data-spring-width']);
      nextStyle['--jpanel-spring-height'] = resolveCssValue(child.props.springHeight ?? child.props['data-spring-height']);
    }

    if (layouts.has('card')) {
      const cardKey = getCardKey(child);
      const isActive = activeCard === undefined
        ? !firstCardShown
        : cardKey === String(activeCard);

      firstCardShown = firstCardShown || isActive;
      nextProps['data-jpanel-card-state'] = isActive ? 'active' : 'hidden';
      if (cardKey !== undefined) nextProps['data-panel-card'] = cardKey;
    }

    return React.cloneElement(child, { ...nextProps, style: nextStyle });
  });
};

export const JPanelView: React.FC<JPanelViewProps> = ({
  variant = JPANEL_DEFAULTS.variant,
  padding = JPANEL_DEFAULTS.padding,
  radius  = JPANEL_DEFAULTS.radius,
  as,
  layout       = JPANEL_DEFAULTS.layout,
  direction    = JPANEL_DEFAULTS.direction,
  gap          = JPANEL_DEFAULTS.gap,
  alignItems   = JPANEL_DEFAULTS.alignItems,
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
  mobileSmall,
  mobileLarge,
  tablet,
  desktop,
  tv,
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
  'data-panel-area':        dataPanelArea,
  'data-panel-card':        dataPanelCard,
  'data-gridbag-column':    dataGridbagColumn,
  'data-gridbag-col':       dataGridbagCol,
  'data-gridbag-row':       dataGridbagRow,
  'data-gridbag-column-span': dataGridbagColumnSpan,
  'data-gridbag-colspan':   dataGridbagColspan,
  'data-gridbag-row-span':  dataGridbagRowSpan,
  'data-gridbag-rowspan':   dataGridbagRowspan,
  'data-gridbag-align':     dataGridbagAlign,
  'data-gridbag-justify':   dataGridbagJustify,
  'data-group-span':        dataGroupSpan,
  'data-group-align':       dataGroupAlign,
  'data-group-justify':     dataGroupJustify,
  'data-spring-left':       dataSpringLeft,
  'data-spring-right':      dataSpringRight,
  'data-spring-top':        dataSpringTop,
  'data-spring-bottom':     dataSpringBottom,
  'data-spring-width':      dataSpringWidth,
  'data-spring-height':     dataSpringHeight,
  className,
  children,
  style,
  forwardedRef,
  ...htmlProps
}) => {
  const Tag = resolveJPanelTag(as);

  const baseConfig = {
    layout, direction, gap, alignItems, justifyContent,
    wrap, columns, rows, autoFitMin, placement, dense, mode, minHeight,
  };
  const mobileSmallConfig  = resolveConfig(baseConfig, mobileSmall);
  const mobileLargeConfig  = resolveConfig(mobileSmallConfig, mobileLarge);
  const tabletConfig       = resolveConfig(mobileLargeConfig, tablet);
  const desktopConfig      = resolveConfig(tabletConfig, desktop);
  const tvConfig           = resolveConfig(desktopConfig, tv);

  const layoutVariants = new Set<JPanelLayout>([
    mobileSmallConfig.layout,
    mobileLargeConfig.layout,
    tabletConfig.layout,
    desktopConfig.layout,
    tvConfig.layout,
  ]);

  const layoutStyle: JPanelCssVars = { ...style };
  setConfigVars(layoutStyle, mobileSmallConfig, '');
  setConfigVars(layoutStyle, mobileLargeConfig, 'mobile-large');
  setConfigVars(layoutStyle, tabletConfig, 'tablet');
  setConfigVars(layoutStyle, desktopConfig, 'desktop');
  setConfigVars(layoutStyle, tvConfig, 'tv');

  const resolvedArea = area ?? dataPanelArea;
  const resolvedCard = card ?? dataPanelCard;

  if (gridBagColumn ?? dataGridbagColumn ?? dataGridbagCol) {
    layoutStyle['--jpanel-gridbag-column'] = resolveCssValue(gridBagColumn ?? dataGridbagColumn ?? dataGridbagCol);
  }
  if (gridBagRow ?? dataGridbagRow) {
    layoutStyle['--jpanel-gridbag-row'] = resolveCssValue(gridBagRow ?? dataGridbagRow);
  }
  if (gridBagColumnSpan ?? dataGridbagColumnSpan ?? dataGridbagColspan) {
    layoutStyle['--jpanel-gridbag-column-span'] = resolveCssValue(gridBagColumnSpan ?? dataGridbagColumnSpan ?? dataGridbagColspan);
  }
  if (gridBagRowSpan ?? dataGridbagRowSpan ?? dataGridbagRowspan) {
    layoutStyle['--jpanel-gridbag-row-span'] = resolveCssValue(gridBagRowSpan ?? dataGridbagRowSpan ?? dataGridbagRowspan);
  }
  layoutStyle['--jpanel-gridbag-align']   = gridBagAlign   ?? dataGridbagAlign;
  layoutStyle['--jpanel-gridbag-justify'] = gridBagJustify ?? dataGridbagJustify;
  layoutStyle['--jpanel-group-span']      = resolveCssValue(groupSpan ?? dataGroupSpan);
  layoutStyle['--jpanel-group-align']     = groupAlign    ?? dataGroupAlign;
  layoutStyle['--jpanel-group-justify']   = groupJustify  ?? dataGroupJustify;
  layoutStyle['--jpanel-spring-left']     = resolveCssValue(springLeft   ?? dataSpringLeft);
  layoutStyle['--jpanel-spring-right']    = resolveCssValue(springRight  ?? dataSpringRight);
  layoutStyle['--jpanel-spring-top']      = resolveCssValue(springTop    ?? dataSpringTop);
  layoutStyle['--jpanel-spring-bottom']   = resolveCssValue(springBottom ?? dataSpringBottom);
  layoutStyle['--jpanel-spring-width']    = resolveCssValue(springWidth  ?? dataSpringWidth);
  layoutStyle['--jpanel-spring-height']   = resolveCssValue(springHeight ?? dataSpringHeight);

  const diagnostics    = getJPanelDiagnostics(children, layoutVariants, activeCard);
  const diagnosticsKey = diagnostics.join('\n');

  useEffect(() => {
    logJPanelDiagnostics(diagnostics);
  }, [diagnosticsKey]);

  const managedChildren = prepareLayoutChildren(children, layoutVariants, activeCard);

  return (
    <Tag
      ref={forwardedRef}
      {...htmlProps}
      className={cn(
        'jpanel',
        variantClasses[variant],
        paddingClasses[padding],
        radiusClasses[radius],
        className
      )}
      style={layoutStyle}
      data-jpanel-layout={mobileSmallConfig.layout}
      data-jpanel-mobile-small-layout={mobileSmallConfig.layout}
      data-jpanel-mobile-large-layout={mobileLargeConfig.layout}
      data-jpanel-tablet-layout={tabletConfig.layout}
      data-jpanel-desktop-layout={desktopConfig.layout}
      data-jpanel-tv-layout={tvConfig.layout}
      data-jpanel-placement={resolvePlacement(mobileSmallConfig.layout, mobileSmallConfig.placement)}
      data-jpanel-mobile-small-placement={resolvePlacement(mobileSmallConfig.layout, mobileSmallConfig.placement)}
      data-jpanel-mobile-large-placement={resolvePlacement(mobileLargeConfig.layout, mobileLargeConfig.placement)}
      data-jpanel-tablet-placement={resolvePlacement(tabletConfig.layout, tabletConfig.placement)}
      data-jpanel-desktop-placement={resolvePlacement(desktopConfig.layout, desktopConfig.placement)}
      data-jpanel-tv-placement={resolvePlacement(tvConfig.layout, tvConfig.placement)}
      data-jpanel-dense={mobileSmallConfig.dense ? 'true' : 'false'}
      data-jpanel-mobile-small-dense={mobileSmallConfig.dense ? 'true' : 'false'}
      data-jpanel-mobile-large-dense={mobileLargeConfig.dense ? 'true' : 'false'}
      data-jpanel-tablet-dense={tabletConfig.dense ? 'true' : 'false'}
      data-jpanel-desktop-dense={desktopConfig.dense ? 'true' : 'false'}
      data-jpanel-tv-dense={tvConfig.dense ? 'true' : 'false'}
      data-jpanel-mode={mobileSmallConfig.mode ?? 'sequential'}
      data-jpanel-mobile-small-mode={mobileSmallConfig.mode ?? 'sequential'}
      data-jpanel-mobile-large-mode={mobileLargeConfig.mode ?? 'sequential'}
      data-jpanel-tablet-mode={tabletConfig.mode ?? 'sequential'}
      data-jpanel-desktop-mode={desktopConfig.mode ?? 'sequential'}
      data-jpanel-tv-mode={tvConfig.mode ?? 'sequential'}
      data-panel-area={resolvedArea}
      data-panel-card={resolvedCard}
    >
      {managedChildren}
    </Tag>
  );
};
JPanelView.displayName = 'JPanelView';
