import { J_SITE_FOOTER_TEMPLATE } from './JSiteFooterView';
import type { FooterLink, InterJSiteFooter } from './InterJSiteFooter';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
/** JSiteFooter — pie de sitio con copyright y enlaces. */
@Component({
  selector: 'j-site-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_SITE_FOOTER_TEMPLATE,
})
export class JSiteFooter {
  readonly copyright = input.required<string>();
  readonly links = input.required<FooterLink[]>();
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn(
      'mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-neutral-200 px-4 py-7 text-sm text-neutral-500',
      this.className()
    )
  );
}
