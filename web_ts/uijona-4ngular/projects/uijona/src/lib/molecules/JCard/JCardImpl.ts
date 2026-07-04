import { J_CARD_TEMPLATE_1, J_CARD_TEMPLATE_2, J_CARD_TEMPLATE_3, J_CARD_TEMPLATE_4, J_CARD_TEMPLATE_5, J_CARD_TEMPLATE_6 } from './JCardView';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';

/**
 * JCard — contenedor con superficie (borde, sombra). Se compone con
 * JCardHeader / JCardTitle / JCardDescription / JCardContent / JCardFooter.
 */
@Component({
  selector: 'j-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_CARD_TEMPLATE_1,
})
export class JCard {
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);
  protected readonly classes = computed(() =>
    cn('min-w-0 rounded-lg border border-neutral-200 bg-white shadow-sm', this.className())
  );
}

@Component({
  selector: 'j-card-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_CARD_TEMPLATE_2,
})
export class JCardHeader {
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn('flex min-w-0 flex-col gap-1.5 p-4 sm:p-6', this.className())
  );
}

@Component({
  selector: 'j-card-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_CARD_TEMPLATE_3,
})
export class JCardTitle {
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn('break-words text-lg font-semibold leading-tight text-neutral-900', this.className())
  );
}

@Component({
  selector: 'j-card-description',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_CARD_TEMPLATE_4,
})
export class JCardDescription {
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn('break-words text-sm text-neutral-500', this.className())
  );
}

@Component({
  selector: 'j-card-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_CARD_TEMPLATE_5,
})
export class JCardContent {
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn('min-w-0 p-4 pt-0 sm:p-6 sm:pt-0', this.className())
  );
}

@Component({
  selector: 'j-card-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_CARD_TEMPLATE_6,
})
export class JCardFooter {
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn('flex min-w-0 flex-wrap items-center gap-2 p-4 pt-0 sm:p-6 sm:pt-0', this.className())
  );
}
