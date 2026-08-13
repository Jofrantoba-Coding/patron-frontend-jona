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
import {
  SIDE_HIDDEN,
  SIDE_OPEN,
  SIDE_PANEL,
  SIZE,
} from './JDrawerStyles';

/**
 * JDrawer — panel lateral con backdrop, transición y cierre por Escape/overlay.
 */
@Component({
  selector: 'j-drawer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents', '(document:keydown.escape)': 'onEscape()' },
  templateUrl: './JDrawerView.html',
  styleUrl: './JDrawerView.css',
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
