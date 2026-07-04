import { J_MARKETING_CTA_TEMPLATE } from './JMarketingCTAView';
import type { InterJMarketingCTA } from './InterJMarketingCTA';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { cn } from '../../core/cn';

const LINK_BASE =
  'inline-flex min-h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500';

/** JMarketingCTA — bloque CTA claro con acciones (href o evento). */
@Component({
  selector: 'j-marketing-cta',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_MARKETING_CTA_TEMPLATE,
})
export class JMarketingCTA {
  readonly heading = input.required<string>();
  readonly description = input<string>();
  readonly primaryLabel = input.required<string>();
  readonly primaryHref = input<string>();
  readonly secondaryLabel = input<string>();
  readonly secondaryHref = input<string>();
  readonly className = input<string>('');

  readonly primaryClick = output<void>();
  readonly secondaryClick = output<void>();

  protected readonly cn = cn;
  protected readonly linkBase = LINK_BASE;
  protected readonly primaryCls = 'bg-primary-600 text-white hover:bg-primary-700';
  protected readonly secondaryCls = 'border border-neutral-300 text-neutral-900 hover:bg-neutral-100';
}
