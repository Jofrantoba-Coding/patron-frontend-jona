import { J_NAVBAR_TEMPLATE } from './JNavbarView';
import type { InterJNavbar } from './InterJNavbar';
import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { cn } from '../../core/cn';
/** JNavbar — barra de navegación sticky con drawer móvil. */
@Component({
  selector: 'j-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_NAVBAR_TEMPLATE,
})
export class JNavbar {
  readonly mobileOpen = model<boolean>(false);
  readonly className = input<string>('');
  protected readonly headerClasses = computed(() =>
    cn('sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md', this.className())
  );
}
