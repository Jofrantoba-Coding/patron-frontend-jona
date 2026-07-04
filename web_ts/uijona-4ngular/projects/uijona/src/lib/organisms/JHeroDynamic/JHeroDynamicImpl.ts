import { J_HERO_DYNAMIC_TEMPLATE, J_HERO_DYNAMIC_STYLES } from './JHeroDynamicView';
import type { HeroDynamicCTA, InterJHeroDynamic } from './InterJHeroDynamic';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  contentChild,
  inject,
  input,
  signal,
} from '@angular/core';
import { cn } from '../../core/cn';
import { JVisual } from '../JMarketingHero';

const CTA_BASE =
  'inline-flex min-h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 w-full sm:w-auto';

const CTA_VARIANT = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  outline: 'border border-white/20 text-neutral-200 hover:bg-white/10',
} as const;

/** JHeroDynamic — hero oscuro con titular rotativo animado (respeta reduced-motion). */
@Component({
  selector: 'j-hero-dynamic',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_HERO_DYNAMIC_TEMPLATE,
  styles: J_HERO_DYNAMIC_STYLES,
})
export class JHeroDynamic implements OnInit {
  readonly eyebrow = input<string>();
  readonly titlePrefix = input.required<string>();
  readonly rotatingWords = input.required<string[]>();
  readonly subtitle = input<string>();
  readonly ctas = input<HeroDynamicCTA[]>();
  readonly intervalMs = input<number>(2200);
  readonly className = input<string>('');

  protected readonly cn = cn;
  private readonly index = signal(0);
  private readonly destroyRef = inject(DestroyRef);
  private readonly visualRef = contentChild(JVisual);
  protected readonly hasVisual = computed(() => !!this.visualRef());

  protected readonly word = computed(() => {
    const words = this.rotatingWords();
    return words.length ? words[this.index() % words.length] : '';
  });

  ngOnInit(): void {
    const words = this.rotatingWords();
    if (words.length <= 1) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const id = setInterval(() => this.index.update((i) => (i + 1) % words.length), this.intervalMs());
    this.destroyRef.onDestroy(() => clearInterval(id));
  }

  protected ctaClass(cta: HeroDynamicCTA): string {
    return cn(CTA_BASE, CTA_VARIANT[cta.variant ?? 'primary']);
  }
}
