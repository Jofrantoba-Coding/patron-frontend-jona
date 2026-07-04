import { J_POPOVER_TEMPLATE } from './JPopoverView';
import type { JPopoverAlign, JPopoverSide, InterJPopover } from './InterJPopover';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { cn } from '../../core/cn';

const VP = 8;

/**
 * JPopover — contenido flotante anclado a un trigger, con click-outside y Escape.
 */
@Component({
  selector: 'j-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
    '(document:keydown.escape)': 'close()',
    '(document:mousedown)': 'onDocMouseDown($event)',
    '(window:resize)': 'reposition()',
    '(window:scroll)': 'reposition()',
  },
  template: J_POPOVER_TEMPLATE,
})
export class JPopover {
  readonly align = input<JPopoverAlign>('start');
  readonly side = input<JPopoverSide>('bottom');
  readonly className = input<string>('');

  readonly opened = output<void>();
  readonly closed = output<void>();

  protected readonly cn = cn;
  protected readonly open = signal(false);
  protected readonly panelStyle = signal<Record<string, string>>({});
  private readonly host = inject(ElementRef<HTMLElement>);

  private triggerEl(): HTMLElement | null {
    return this.host.nativeElement.querySelector('.inline-block');
  }

  protected toggle(): void {
    if (this.open()) {
      this.close();
    } else {
      this.reposition();
      this.open.set(true);
      this.opened.emit();
    }
  }

  protected close(): void {
    if (this.open()) {
      this.open.set(false);
      this.closed.emit();
    }
  }

  protected reposition(): void {
    const el = this.triggerEl();
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const side = this.side();
    const align = this.align();

    let top: number;
    if (side === 'bottom') top = r.bottom + 4;
    else if (side === 'top') top = r.top - 4;
    else top = r.top;

    let left: number;
    if (side === 'right') left = r.right + 4;
    else if (side === 'left') left = r.left - 4;
    else if (align === 'end') left = r.right;
    else if (align === 'center') left = r.left + r.width / 2;
    else left = r.left;
    left = Math.min(Math.max(left, VP), vw - VP);

    const style: Record<string, string> = { position: 'fixed', left: `${left}px`, 'z-index': '50' };
    if (side === 'top') style['bottom'] = `${vh - top}px`;
    else style['top'] = `${top}px`;
    if (align === 'center') style['transform'] = 'translateX(-50%)';
    else if (align === 'end') style['transform'] = 'translateX(-100%)';
    this.panelStyle.set(style);
  }

  protected onDocMouseDown(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }
}
