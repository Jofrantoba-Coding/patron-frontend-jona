import type { InterJHeaderPage } from './InterJHeaderPage';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
/** JHeaderPage — cabecera de app con título, navegación y acciones. */
@Component({
  selector: 'j-header-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  templateUrl: './JHeaderPageView.html',
  styleUrl: './JHeaderPageView.css',
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
