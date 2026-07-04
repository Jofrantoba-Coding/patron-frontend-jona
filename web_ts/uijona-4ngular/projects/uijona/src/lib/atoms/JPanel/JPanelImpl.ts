import { J_PANEL_TEMPLATE } from './JPanelView';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import {
  JPANEL_ALIGN_VALUES,
  JPANEL_DEFAULTS,
  JPANEL_DIRECTION_VALUES,
  JPANEL_GAP_VALUES,
  JPANEL_JUSTIFY_VALUES,
  JPANEL_PADDING_CLASSES,
  JPANEL_RADIUS_CLASSES,
  JPANEL_RESPONSIVE_LAYOUTS,
  JPANEL_VARIANT_CLASSES,
  JPANEL_WRAP_VALUES,
  type JPanelAlign,
  type JPanelDirection,
  type JPanelGap,
  type JPanelGroupMode,
  type JPanelJustify,
  type JPanelLayout,
  type JPanelLayoutPlacement,
  type JPanelPadding,
  type JPanelRadius,
  type JPanelResponsiveConfig,
  type JPanelVariant,
  type JPanelWrap,
} from './InterJPanel';

interface ResolvedConfig {
  layout: JPanelLayout;
  direction: JPanelDirection;
  gap: JPanelGap;
  alignItems: JPanelAlign;
  justifyContent: JPanelJustify;
  wrap?: boolean | JPanelWrap;
  columns?: number | string;
  rows?: number | string;
  autoFitMin?: string;
  placement?: JPanelLayoutPlacement;
  dense?: boolean;
  mode?: JPanelGroupMode;
  minHeight?: string;
}

function resolveWrap(wrap: boolean | JPanelWrap | undefined, fallback: JPanelWrap): JPanelWrap {
  if (typeof wrap === 'boolean') return wrap ? 'wrap' : 'nowrap';
  return wrap ?? fallback;
}

function resolveTemplate(value: number | string | undefined): string | undefined {
  if (typeof value === 'number') return `repeat(${value}, minmax(0, 1fr))`;
  return value;
}

function resolvePlacement(
  layout: JPanelLayout,
  placement: JPanelLayoutPlacement | undefined
): JPanelLayoutPlacement | undefined {
  return JPANEL_RESPONSIVE_LAYOUTS.has(layout) ? (placement ?? 'responsive') : placement;
}

function resolveConfig(base: ResolvedConfig, override?: JPanelResponsiveConfig): ResolvedConfig {
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
}

function setConfigVars(
  style: Record<string, string>,
  config: ResolvedConfig,
  prefix: '' | 'mobile-large' | 'tablet' | 'desktop' | 'tv'
): void {
  const cssPrefix = prefix ? `--jpanel-${prefix}` : '--jpanel';
  const setVar = (name: string, value: string | undefined) => {
    if (value !== undefined) style[`${cssPrefix}-${name}`] = value;
  };
  const wrapFallback: JPanelWrap =
    config.layout === 'flow' ? 'wrap' : config.direction === 'column' ? 'nowrap' : 'wrap';
  const placement = resolvePlacement(config.layout, config.placement);

  setVar('gap', JPANEL_GAP_VALUES[config.gap]);
  setVar('direction', JPANEL_DIRECTION_VALUES[config.direction]);
  setVar('wrap', JPANEL_WRAP_VALUES[resolveWrap(config.wrap, wrapFallback)]);
  setVar('align-items', JPANEL_ALIGN_VALUES[config.alignItems]);
  setVar('justify-content', JPANEL_JUSTIFY_VALUES[config.justifyContent]);
  setVar('columns', resolveTemplate(config.columns));
  setVar('rows', resolveTemplate(config.rows));
  setVar('auto-fit-min', config.autoFitMin ?? '12rem');
  setVar('spring-min-height', config.minHeight ?? '16rem');
  setVar('placement', placement);
}

/**
 * JPanel — panel estructural con motor de layout responsive (flow, box, grid,
 * border, card, gridbag, group, spring) por breakpoint. El posicionamiento se
 * resuelve por CSS a partir de variables `--jpanel-*` y atributos `data-jpanel-*`.
 *
 * Nota Angular: a diferencia de React, JPanel no inyecta props en los hijos. Para
 * layouts con constraints por hijo (border/gridbag/group/spring), coloca en cada
 * hijo directo los atributos `data-panel-area` / `data-jpanel-*-item` y las
 * variables CSS correspondientes; la hoja de estilos ya los interpreta.
 */
@Component({
  selector: 'j-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_PANEL_TEMPLATE,
})
export class JPanel {
  readonly variant = input<JPanelVariant>(JPANEL_DEFAULTS.variant);
  readonly padding = input<JPanelPadding>(JPANEL_DEFAULTS.padding);
  readonly radius = input<JPanelRadius>(JPANEL_DEFAULTS.radius);
  readonly layout = input<JPanelLayout>(JPANEL_DEFAULTS.layout);
  readonly direction = input<JPanelDirection>(JPANEL_DEFAULTS.direction);
  readonly gap = input<JPanelGap>(JPANEL_DEFAULTS.gap);
  readonly alignItems = input<JPanelAlign>(JPANEL_DEFAULTS.alignItems);
  readonly justifyContent = input<JPanelJustify>(JPANEL_DEFAULTS.justifyContent);
  readonly wrap = input<boolean | JPanelWrap>();
  readonly columns = input<number | string>();
  readonly rows = input<number | string>();
  readonly autoFitMin = input<string>();
  readonly placementInput = input<JPanelLayoutPlacement | undefined>(undefined, {
    alias: 'placement',
  });
  readonly dense = input<boolean>();
  readonly mode = input<JPanelGroupMode>();
  readonly minHeight = input<string>();
  readonly mobileSmall = input<JPanelResponsiveConfig>();
  readonly mobileLarge = input<JPanelResponsiveConfig>();
  readonly tablet = input<JPanelResponsiveConfig>();
  readonly desktop = input<JPanelResponsiveConfig>();
  readonly tv = input<JPanelResponsiveConfig>();
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  protected placementOf(config: ResolvedConfig): JPanelLayoutPlacement | undefined {
    return resolvePlacement(config.layout, config.placement);
  }

  private readonly baseConfig = computed<ResolvedConfig>(() => ({
    layout: this.layout(),
    direction: this.direction(),
    gap: this.gap(),
    alignItems: this.alignItems(),
    justifyContent: this.justifyContent(),
    wrap: this.wrap(),
    columns: this.columns(),
    rows: this.rows(),
    autoFitMin: this.autoFitMin(),
    placement: this.placementInput(),
    dense: this.dense(),
    mode: this.mode(),
    minHeight: this.minHeight(),
  }));

  protected readonly ms = computed(() => resolveConfig(this.baseConfig(), this.mobileSmall()));
  protected readonly ml = computed(() => resolveConfig(this.ms(), this.mobileLarge()));
  protected readonly tb = computed(() => resolveConfig(this.ml(), this.tablet()));
  protected readonly dk = computed(() => resolveConfig(this.tb(), this.desktop()));
  protected readonly tv2 = computed(() => resolveConfig(this.dk(), this.tv()));

  protected readonly classes = computed(() =>
    cn(
      'jpanel',
      JPANEL_VARIANT_CLASSES[this.variant()],
      JPANEL_PADDING_CLASSES[this.padding()],
      JPANEL_RADIUS_CLASSES[this.radius()],
      this.className()
    )
  );

  protected readonly layoutStyle = computed<Record<string, string>>(() => {
    const style: Record<string, string> = {};
    setConfigVars(style, this.ms(), '');
    setConfigVars(style, this.ml(), 'mobile-large');
    setConfigVars(style, this.tb(), 'tablet');
    setConfigVars(style, this.dk(), 'desktop');
    setConfigVars(style, this.tv2(), 'tv');
    const extra = this.style();
    if (extra && typeof extra === 'object') {
      for (const [k, v] of Object.entries(extra)) {
        if (v != null) style[k] = String(v);
      }
    }
    return style;
  });
}
