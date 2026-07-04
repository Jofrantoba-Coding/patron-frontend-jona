import { Directive, input } from '@angular/core';
import { cn } from '../core/cn';
import type { JStyle } from '../core/types';
import type {
  JPanelAlign,
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
} from '../atoms/JPanel';

/**
 * Template compartido por los layouts que envuelven JPanel con un `layout` fijo.
 * Cada layout provee `layoutType` y (opcionalmente) los `default*`.
 */
export const LAYOUT_TEMPLATE = `
  <j-panel
    [layout]="layoutType"
    [variant]="variant()"
    [padding]="padding()"
    [radius]="radius()"
    [gap]="gap() ?? defaultGap"
    [direction]="direction() ?? defaultDirection"
    [alignItems]="alignItems()"
    [justifyContent]="justifyContent()"
    [wrap]="wrap() ?? defaultWrap"
    [columns]="columns()"
    [rows]="rows()"
    [autoFitMin]="autoFitMin() ?? defaultAutoFitMin"
    [placement]="placement() ?? defaultPlacement"
    [dense]="dense()"
    [mode]="mode()"
    [minHeight]="minHeight()"
    [mobileSmall]="mobileSmall()"
    [mobileLarge]="mobileLarge()"
    [tablet]="tablet()"
    [desktop]="desktop()"
    [tv]="tv()"
    [className]="cn('w-full max-w-full min-w-0', className())"
    [style]="style()"
  >
    <ng-content />
  </j-panel>
`;

@Directive()
export abstract class JLayoutBase {
  abstract readonly layoutType: JPanelLayout;

  protected defaultGap: JPanelGap = 'none';
  protected defaultDirection: JPanelDirection = 'column';
  protected defaultWrap: boolean | JPanelWrap | undefined = undefined;
  protected defaultAutoFitMin: string | undefined = undefined;
  protected defaultPlacement: JPanelLayoutPlacement | undefined = undefined;

  readonly variant = input<JPanelVariant>('ghost');
  readonly padding = input<JPanelPadding>('none');
  readonly radius = input<JPanelRadius>('none');
  readonly gap = input<JPanelGap>();
  readonly direction = input<JPanelDirection>();
  readonly alignItems = input<JPanelAlign>('stretch');
  readonly justifyContent = input<JPanelJustify>('start');
  readonly wrap = input<boolean | JPanelWrap>();
  readonly columns = input<number | string>();
  readonly rows = input<number | string>();
  readonly autoFitMin = input<string>();
  readonly placement = input<JPanelLayoutPlacement>();
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

  protected readonly cn = cn;
}
