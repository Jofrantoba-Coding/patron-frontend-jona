import type { JDrawerSide, JDrawerSize, InterJDrawer } from './InterJDrawer';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { cn } from '../../core/cn';
import { JFocusTrap } from '../../core/focus';
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

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly trap = new JFocusTrap();

  constructor() {
    effect(() => {
      this.document.body.style.overflow = this.open() ? 'hidden' : '';
    });

    // A diferencia de JDialog, el panel del drawer SIEMPRE esta en el DOM: se
    // desplaza con transform para animar. Por eso ademas de atrapar el foco hay
    // que retirarlo del arbol accesible cuando esta cerrado (ver la View).
    effect(() => {
      const panel = this.panel()?.nativeElement;
      if (this.open() && panel) this.trap.activar(panel);
      else if (!this.open()) this.trap.liberar();
    });
  }

  protected onEscape(): void {
    if (this.open()) this.closed.emit();
  }

  protected onPanelKeydown(event: KeyboardEvent): void {
    const panel = this.panel()?.nativeElement;
    if (panel) this.trap.alPulsarTecla(event, panel);
  }
}
