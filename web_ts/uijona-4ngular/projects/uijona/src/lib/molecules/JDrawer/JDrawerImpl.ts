import { J_DRAWER_TEMPLATE, J_DRAWER_STYLES } from './JDrawerView';
import type { JDrawerSide, JDrawerSize, InterJDrawer } from './InterJDrawer';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { cn } from '../../core/cn';

const SIDE_PANEL: Record<JDrawerSide, string> = {
  right: 'inset-y-0 right-0 h-full flex-col',
  left: 'inset-y-0 left-0 h-full flex-col',
  top: 'inset-x-0 top-0 w-full flex-col',
  bottom: 'inset-x-0 bottom-0 w-full flex-col',
};

const SIDE_OPEN: Record<JDrawerSide, string> = {
  right: 'translate-x-0',
  left: 'translate-x-0',
  top: 'translate-y-0',
  bottom: 'translate-y-0',
};

const SIDE_HIDDEN: Record<JDrawerSide, string> = {
  right: 'translate-x-full',
  left: '-translate-x-full',
  top: '-translate-y-full',
  bottom: 'translate-y-full',
};

const SIZE: Record<JDrawerSize, Record<JDrawerSide, string>> = {
  sm: { right: 'w-64', left: 'w-64', top: 'h-48', bottom: 'h-48' },
  md: { right: 'w-80', left: 'w-80', top: 'h-64', bottom: 'h-64' },
  lg: { right: 'w-[28rem]', left: 'w-[28rem]', top: 'h-80', bottom: 'h-80' },
  full: { right: 'w-full', left: 'w-full', top: 'h-full', bottom: 'h-full' },
};

/**
 * JDrawer — panel lateral con backdrop, transición y cierre por Escape/overlay.
 */
@Component({
  selector: 'j-drawer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents', '(document:keydown.escape)': 'onEscape()' },
  template: J_DRAWER_TEMPLATE,
  styles: J_DRAWER_STYLES,
})
export class JDrawer {
  readonly open = input.required<boolean>();
  readonly side = input<JDrawerSide>('right');
  readonly title = input<string>();
  readonly description = input<string>();
  readonly size = input<JDrawerSize>('md');
  readonly showCloseButton = input<boolean>(true);
  readonly className = input<string>('');

  readonly closed = output<void>();

  protected readonly cn = cn;
  private readonly document = inject(DOCUMENT);
  protected readonly isHorizontal = computed(() => this.side() === 'left' || this.side() === 'right');

  protected readonly panelClasses = computed(() => {
    const side = this.side();
    return cn(
      'fixed z-50 flex bg-white shadow-xl transition-transform duration-300 ease-in-out',
      SIDE_PANEL[side],
      SIZE[this.size()][side],
      this.isHorizontal() ? 'max-w-[85vw]' : 'max-h-[85vh]',
      this.open() ? SIDE_OPEN[side] : SIDE_HIDDEN[side],
      this.className()
    );
  });

  constructor() {
    effect(() => {
      this.document.body.style.overflow = this.open() ? 'hidden' : '';
    });
  }

  protected onEscape(): void {
    if (this.open()) this.closed.emit();
  }
}
