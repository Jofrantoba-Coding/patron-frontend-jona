import { J_HEADER_PAGE_TEMPLATE, J_HEADER_PAGE_STYLES } from './JHeaderPageView';
import type { InterJHeaderPage } from './InterJHeaderPage';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
/** JHeaderPage — cabecera de app con título, navegación y acciones. */
@Component({
  selector: 'j-header-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_HEADER_PAGE_TEMPLATE,
  styles: J_HEADER_PAGE_STYLES,
})
export class JHeaderPage {
  readonly title = input<string>('JONA UI');
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn(
      'flex min-w-0 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6',
      'bg-white border-b border-neutral-200 shadow-sm',
      this.className()
    )
  );
}
