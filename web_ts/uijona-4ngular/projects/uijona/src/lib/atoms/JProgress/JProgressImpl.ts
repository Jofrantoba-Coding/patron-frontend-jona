import { J_PROGRESS_TEMPLATE } from './JProgressView';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import {
  JPROGRESS_BAR_FILL,
  JPROGRESS_BAR_HEIGHT,
  JPROGRESS_CIRCLE_COLOR,
  JPROGRESS_CIRCLE_DIAMETER,
  JPROGRESS_CIRCLE_FONT_SIZE,
  JPROGRESS_CIRCLE_STROKE_WIDTH,
  JPROGRESS_DEFAULTS,
  type JProgressSize,
  type JProgressType,
  type JProgressVariant,
} from './InterJProgress';

/**
 * JProgress — barra o circulo de progreso, con label opcional y animacion shimmer.
 */
@Component({
  selector: 'j-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_PROGRESS_TEMPLATE,
})
export class JProgress {
  readonly value = input<number>(JPROGRESS_DEFAULTS.value);
  readonly max = input<number>(JPROGRESS_DEFAULTS.max);
  readonly variant = input<JProgressVariant>(JPROGRESS_DEFAULTS.variant);
  readonly type = input<JProgressType>(JPROGRESS_DEFAULTS.type);
  readonly size = input<JProgressSize>(JPROGRESS_DEFAULTS.size);
  readonly showLabel = input<boolean>(JPROGRESS_DEFAULTS.showLabel);
  readonly label = input<string>();
  readonly animated = input<boolean>(JPROGRESS_DEFAULTS.animated);
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  protected readonly cn = cn;

  protected readonly pct = computed(() => {
    const max = this.max();
    return Math.min(100, Math.max(0, max > 0 ? (this.value() / max) * 100 : 0));
  });

  protected readonly displayLabel = computed(
    () => this.label() ?? `${Math.round(this.pct())}%`
  );

  protected readonly sz = computed(() => JPROGRESS_CIRCLE_DIAMETER[this.size()]);
  protected readonly sw = computed(() => JPROGRESS_CIRCLE_STROKE_WIDTH[this.size()]);
  protected readonly radius = computed(() => (this.sz() - this.sw()) / 2);
  protected readonly circ = computed(() => 2 * Math.PI * this.radius());
  protected readonly offset = computed(() => this.circ() - (this.pct() / 100) * this.circ());
  protected readonly circleColor = computed(() => JPROGRESS_CIRCLE_COLOR[this.variant()]);
  protected readonly circleFontSize = computed(() => JPROGRESS_CIRCLE_FONT_SIZE[this.size()]);
  protected readonly barHeight = computed(() => JPROGRESS_BAR_HEIGHT[this.size()]);
  protected readonly barFill = computed(() => JPROGRESS_BAR_FILL[this.variant()]);
}
