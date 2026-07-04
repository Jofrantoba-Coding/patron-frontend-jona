import { J_DETAIL_CTA_TEMPLATE } from './JDetailCTAView';
import type { InterJDetailCTA } from './InterJDetailCTA';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';

const CTA_BASE =
  'inline-flex min-h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500';

/** JDetailCTA — sección CTA oscura con título, cuerpo y acciones. */
@Component({
  selector: 'j-detail-cta',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_DETAIL_CTA_TEMPLATE,
})
export class JDetailCTA {
  readonly title = input.required<string>();
  readonly body = input.required<string>();
  readonly primaryHref = input.required<string>();
  readonly primaryLabel = input.required<string>();
  readonly secondaryHref = input<string>();
  readonly secondaryLabel = input<string>();
  readonly className = input<string>('');
  protected readonly cn = cn;
  protected readonly ctaBase = CTA_BASE;
}
