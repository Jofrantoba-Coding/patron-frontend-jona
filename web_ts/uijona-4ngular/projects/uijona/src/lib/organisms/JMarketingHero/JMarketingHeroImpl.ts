import { J_MARKETING_HERO_TEMPLATE, J_MARKETING_HERO_STYLES } from './JMarketingHeroView';
import type { MarketingHeroCTA, InterJMarketingHero } from './InterJMarketingHero';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  computed,
  contentChild,
  input,
} from '@angular/core';
import { cn } from '../../core/cn';
/** Marca el contenido visual del hero (para el layout de 2 columnas). */
@Directive({ selector: '[jVisual]', standalone: true })
export class JVisual {}

const CTA_BASE =
  'inline-flex min-h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 w-full sm:w-auto';
const CTA_VARIANT = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  outline: 'border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-100',
} as const;

/** JMarketingHero — hero de marketing con copy, CTAs, visual y métricas. */
@Component({
  selector: 'j-marketing-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_MARKETING_HERO_TEMPLATE,
  styles: J_MARKETING_HERO_STYLES,
})
export class JMarketingHero {
  readonly eyebrow = input<string>();
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly ctas = input<MarketingHeroCTA[]>();
  readonly className = input<string>('');

  protected readonly cn = cn;
  private readonly visualRef = contentChild(JVisual);
  protected readonly hasVisual = computed(() => !!this.visualRef());

  protected ctaClass(cta: MarketingHeroCTA): string {
    return cn(CTA_BASE, CTA_VARIANT[cta.variant ?? 'primary']);
  }
}
