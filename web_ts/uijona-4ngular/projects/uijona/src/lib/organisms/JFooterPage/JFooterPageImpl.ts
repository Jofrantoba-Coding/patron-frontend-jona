import { J_FOOTER_PAGE_TEMPLATE, J_FOOTER_PAGE_STYLES } from './JFooterPageView';
import type { InterJFooterPage } from './InterJFooterPage';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
/** JFooterPage — pie de app con texto/marca, enlaces y acciones. */
@Component({
  selector: 'j-footer-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_FOOTER_PAGE_TEMPLATE,
  styles: J_FOOTER_PAGE_STYLES,
})
export class JFooterPage {
  readonly text = input<string>('© 2026 JONA UI');
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn(
      'flex min-w-0 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6',
      'bg-white border-t border-neutral-200 text-sm text-neutral-500',
      this.className()
    )
  );
}
