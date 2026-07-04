import { J_TOOLTIP_TEMPLATE } from './JTooltipView';
import type { JTooltipSide, InterJTooltip } from './InterJTooltip';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { cn } from '../../core/cn';

const GAP = 6;

const PADDING = 8;

/**
 * JTooltip — tooltip posicionado (fixed) que envuelve un trigger proyectado.
 * Aparece al hover/focus tras `delayMs`.
 */
@Component({
  selector: 'j-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents', '(document:keydown.escape)': 'hide()' },
  template: J_TOOLTIP_TEMPLATE,
})
export class JTooltip {
  readonly content = input.required<string>();
  readonly side = input<JTooltipSide>('top');
  readonly delayMs = input<number>(300);
  readonly className = input<string>('');

  readonly shown = output<void>();
  readonly hidden = output<void>();

  protected readonly cn = cn;
  protected readonly tooltipId = `jtooltip-${Math.random().toString(36).slice(2, 9)}`;
  protected readonly visible = signal(false);
  protected readonly style = signal<Record<string, string>>({});
  private readonly trigger = viewChild<ElementRef<HTMLElement>>('trigger');
  private timer: ReturnType<typeof setTimeout> | null = null;

  protected show(): void {
    this.timer = setTimeout(() => {
      this.style.set(this.computeStyle());
      this.visible.set(true);
      this.shown.emit();
    }, this.delayMs());
  }

  protected hide(): void {
    if (this.timer) clearTimeout(this.timer);
    if (this.visible()) {
      this.visible.set(false);
      this.hidden.emit();
    }
  }

  private computeStyle(): Record<string, string> {
    const el = this.trigger()?.nativeElement;
    if (!el) return {};
    const r = el.getBoundingClientRect();
    const maxWidth = Math.min(320, window.innerWidth - PADDING * 2);
    const centerX = Math.min(
      Math.max(r.left + r.width / 2, PADDING + maxWidth / 2),
      window.innerWidth - PADDING - maxWidth / 2
    );
    const centerY = r.top + r.height / 2;
    const base: Record<string, string> = {
      position: 'fixed',
      'z-index': '9999',
      'max-width': `${maxWidth}px`,
    };
    switch (this.side()) {
      case 'top':
        return { ...base, bottom: `${window.innerHeight - r.top + GAP}px`, left: `${centerX}px`, transform: 'translateX(-50%)' };
      case 'bottom':
        return { ...base, top: `${r.bottom + GAP}px`, left: `${centerX}px`, transform: 'translateX(-50%)' };
      case 'left':
        return { ...base, top: `${centerY}px`, right: `${Math.max(window.innerWidth - r.left + GAP, PADDING)}px`, transform: 'translateY(-50%)' };
      case 'right':
        return { ...base, top: `${centerY}px`, left: `${Math.min(r.right + GAP, window.innerWidth - PADDING - maxWidth)}px`, transform: 'translateY(-50%)' };
    }
  }
}
