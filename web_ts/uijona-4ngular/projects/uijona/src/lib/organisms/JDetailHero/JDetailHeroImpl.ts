import { J_DETAIL_HERO_TEMPLATE, J_DETAIL_HERO_STYLES } from './JDetailHeroView';
import type { InterJDetailHero } from './InterJDetailHero';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
} from '@angular/core';
import { cn } from '../../core/cn';
import { JVisual } from '../JMarketingHero';

const CTA_BASE =
  'inline-flex min-h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 w-full sm:w-auto';

/** JDetailHero — hero oscuro de detalle con enlace de retorno, título y CTAs. */
@Component({
  selector: 'j-detail-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_DETAIL_HERO_TEMPLATE,
  styles: J_DETAIL_HERO_STYLES,
})
export class JDetailHero {
  readonly backHref = input.required<string>();
  readonly backLabel = input.required<string>();
  readonly eyebrow = input<string>();
  readonly title = input.required<string>();
  readonly outcome = input.required<string>();
  readonly primaryHref = input.required<string>();
  readonly primaryLabel = input.required<string>();
  readonly secondaryHref = input<string>();
  readonly secondaryLabel = input<string>();
  readonly className = input<string>('');

  protected readonly cn = cn;
  protected readonly ctaBase = CTA_BASE;
  private readonly visualRef = contentChild(JVisual);
  protected readonly hasVisual = computed(() => !!this.visualRef());
}
